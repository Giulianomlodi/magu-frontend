// src/app/api/holders/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Holder from "@/lib/models/holder";
import { convertMongooseDocToHolder } from "@/types/mongoose";
import type {
  Holder as HolderType,
  Distribution,
  HolderBreakdown,
} from "@/types/holder";
import type { TierType, TokenTier } from "@/types/holder";
import rarityData from "@/app/api/snapshot/snapshots/1_rarity_analysis.json";
import fs from "fs/promises";
import path from "path";

interface RarityData {
  nfts: Array<{
    tokenId: number;
    rarityTier: TierType;
  }>;
}

interface ValidatedHolderData {
  address: string;
  tokenCount: number;
  tokenIds: number[];
  tokenTiers: TokenTier[];
  weightedCount: number;
  breakdown: Record<string, HolderBreakdown>;
  campaignStats: {
    totalAccumulatedTokens: number;
    lastProcessedDay: number;
  };
  distributions: Distribution[];
}

interface DistributionInput {
  date: string | Date;
  baseAllocation: number;
  adjustedAllocation: number;
  breakdown: Record<
    string,
    {
      count: number;
      multiplier: number;
      subtotal: number;
    }
  >;
}

// Logger utility
class Logger {
  private logPath: string;
  private errorPath: string;

  constructor() {
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    this.logPath = path.join(process.cwd(), "logs", `holders-${timestamp}.log`);
    this.errorPath = path.join(
      process.cwd(),
      "logs",
      `holders-error-${timestamp}.log`
    );

    // Ensure logs directory exists
    fs.mkdir(path.join(process.cwd(), "logs"), { recursive: true }).catch(
      console.error
    );
  }

  async log(message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n${
      data ? JSON.stringify(data, null, 2) + "\n" : ""
    }`;

    console.log(message, data || "");
    await fs.appendFile(this.logPath, logMessage).catch(console.error);
  }

  async error(message: string, error?: unknown) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}\n${
      error ? JSON.stringify(error, null, 2) + "\n" : ""
    }`;

    console.error(message, error || "");
    await fs.appendFile(this.errorPath, errorMessage).catch(console.error);
  }
}

const normalizeAddress = (address: string): string => {
  const cleanAddress = address.trim().toLowerCase();
  return cleanAddress.startsWith("0x") ? cleanAddress : `0x${cleanAddress}`;
};

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const getTokenTier = (tokenId: number): TierType => {
  const nftData = (rarityData as RarityData).nfts.find(
    (nft) => nft.tokenId === tokenId
  );
  return nftData?.rarityTier || "Uncommon";
};

const safeNumber = (value: unknown, defaultValue: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

const validateTokenId = (tokenId: unknown): number => {
  const num = Number(tokenId);
  if (isNaN(num)) {
    throw new Error(`Invalid token ID: ${tokenId}`);
  }
  return num;
};

const calculateTotalAccumulated = (distributions: Distribution[]): number => {
  return distributions.reduce((total, dist) => {
    return total + (Number(dist.adjustedAllocation) || 0);
  }, 0);
};

const validateDistribution = (dist: DistributionInput): Distribution => {
  return {
    date: new Date(dist.date),
    baseAllocation: Number(dist.baseAllocation),
    adjustedAllocation: Number(dist.adjustedAllocation),
    breakdown: Object.entries(dist.breakdown).reduce((acc, [key, value]) => {
      acc[key] = {
        count: Number(value.count),
        multiplier: Number(value.multiplier),
        subtotal: Number(value.subtotal),
      };
      return acc;
    }, {} as Record<string, HolderBreakdown>),
  };
};

const validateHolderData = (
  holder: unknown
): {
  isValid: boolean;
  errors: string[];
  validatedData?: ValidatedHolderData;
} => {
  const errors: string[] = [];

  if (!holder || typeof holder !== "object") {
    return { isValid: false, errors: ["Holder data is missing or invalid"] };
  }

  const holderObj = holder as Record<string, unknown>;

  try {
    // Validate and normalize address
    if (!holderObj.address || typeof holderObj.address !== "string") {
      errors.push("Address is missing or invalid");
      return { isValid: false, errors };
    }

    const normalizedAddress = normalizeAddress(holderObj.address);
    if (!isValidEthereumAddress(normalizedAddress)) {
      errors.push("Invalid Ethereum address format");
      return { isValid: false, errors };
    }

    // Validate tokenIds array
    if (!Array.isArray(holderObj.tokenIds)) {
      errors.push("TokenIds must be an array");
      return { isValid: false, errors };
    }

    const tokenIds = holderObj.tokenIds.map((id) => validateTokenId(id));
    const tokenCount = tokenIds.length;
    const weightedCount = safeNumber(holderObj.weightedCount, 0);

    // Validate and transform distributions
    const distributions = Array.isArray(holderObj.distributions)
      ? holderObj.distributions.map((dist: unknown) => {
          if (typeof dist !== "object" || !dist) {
            throw new Error("Invalid distribution data");
          }
          return validateDistribution(dist as DistributionInput);
        })
      : [];

    // Calculate total accumulated from distributions
    const totalAccumulated = calculateTotalAccumulated(distributions);

    // Map token IDs to their tiers with explicit typing
    const tokenTiers: TokenTier[] = tokenIds.map(
      (tokenId: number): TokenTier => ({
        tokenId,
        tier: getTokenTier(tokenId),
      })
    );

    const validatedData: ValidatedHolderData = {
      address: normalizedAddress,
      tokenCount,
      tokenIds,
      tokenTiers,
      weightedCount,
      breakdown: (holderObj.breakdown as Record<string, HolderBreakdown>) || {},
      campaignStats: {
        totalAccumulatedTokens: totalAccumulated,
        lastProcessedDay: distributions.length,
      },
      distributions,
    };

    return {
      isValid: errors.length === 0,
      errors,
      validatedData,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Validation failed");
    return { isValid: false, errors };
  }
};

export async function GET(request: Request) {
  const logger = new Logger();

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    let address = searchParams.get("address");

    if (!address) {
      await logger.error("Missing address parameter");
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    address = normalizeAddress(address);
    await logger.log("Searching for address", { address });

    const holder = await Holder.findOne({ address }).lean();

    await logger.log("DB Query Result", {
      searchAddress: address,
      found: !!holder,
      resultAddress: holder?.address,
      tokenCount: holder?.tokenCount,
      tokenIdsLength: holder?.tokenIds?.length,
      distributionsLength: holder?.distributions?.length,
      campaignStats: holder?.campaignStats,
    });

    if (!holder) {
      return NextResponse.json(
        {
          error:
            "Holder not found. If you have already purchased a banana, please wait the next snapshot.",
        },
        { status: 404 }
      );
    }

    // Calculate total accumulated directly from distributions
    const totalAccumulated = calculateTotalAccumulated(
      holder.distributions || []
    );

    // Create a new holder object with the processed campaign stats
    const processedHolder = {
      ...holder,
      campaignStats: {
        totalAccumulatedTokens: totalAccumulated,
        lastProcessedDay: (holder.distributions || []).length,
      },
      tokenCount: Number(holder.tokenCount),
      weightedCount: Number(holder.weightedCount),
      tokenIds: holder.tokenIds.map(Number),
    };

    const convertedHolder = convertMongooseDocToHolder(processedHolder);

    await logger.log("Processed holder data", {
      address: convertedHolder.address,
      campaignStats: convertedHolder.campaignStats,
      tokenCount: convertedHolder.tokenCount,
      distributionsLength: convertedHolder.distributions.length,
      totalAccumulated,
    });

    return NextResponse.json({
      data: convertedHolder,
      debug:
        process.env.NODE_ENV === "development"
          ? {
              originalData: holder,
              processedData: {
                distributionsLength: holder.distributions?.length,
                totalAccumulated,
                campaignStats: convertedHolder.campaignStats,
              },
            }
          : undefined,
    });
  } catch (error: unknown) {
    await logger.error("Error fetching holder", error);
    return NextResponse.json(
      { error: "Failed to fetch holder data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const logger = new Logger();

  try {
    await dbConnect();
    let holders: unknown;
    try {
      holders = await request.json();
    } catch (e) {
      throw new Error("Invalid JSON in request body");
    }

    if (!Array.isArray(holders)) {
      throw new Error("Request body must be an array of holders");
    }

    await logger.log("Starting holder processing", {
      totalHolders: holders.length,
    });

    const operations = [];
    const validationErrors: Array<{
      address: string;
      errors: string[];
    }> = [];

    for (const holder of holders) {
      const validation = validateHolderData(holder);

      if (!validation.isValid || !validation.validatedData) {
        validationErrors.push({
          address:
            typeof holder === "object" && holder && "address" in holder
              ? String(holder.address)
              : "unknown",
          errors: validation.errors,
        });
        await logger.error(`Validation failed for holder`, {
          holder,
          errors: validation.errors,
        });
        continue;
      }

      const validatedHolder = validation.validatedData;

      await logger.log(`Processing holder`, {
        address: validatedHolder.address,
        tokenCount: validatedHolder.tokenCount,
        tokenIdsLength: validatedHolder.tokenIds.length,
        tokenTiersLength: validatedHolder.tokenTiers.length,
        distributionsLength: validatedHolder.distributions.length,
        totalAccumulated: validatedHolder.campaignStats.totalAccumulatedTokens,
      });

      operations.push({
        updateOne: {
          filter: { address: validatedHolder.address },
          update: {
            $set: {
              address: validatedHolder.address,
              tokenCount: validatedHolder.tokenCount,
              tokenIds: validatedHolder.tokenIds,
              tokenTiers: validatedHolder.tokenTiers,
              weightedCount: validatedHolder.weightedCount,
              breakdown: validatedHolder.breakdown,
              lastUpdated: new Date(),
              campaignStats: validatedHolder.campaignStats,
            },
            $push:
              validatedHolder.distributions.length > 0
                ? {
                    distributions: {
                      $each: validatedHolder.distributions,
                    },
                  }
                : {},
          },
          upsert: true,
        },
      });
    }

    if (validationErrors.length > 0) {
      await logger.log("Validation errors summary", validationErrors);
    }

    if (operations.length === 0) {
      await logger.error("No valid holders to update", validationErrors);
      return NextResponse.json(
        {
          error: "No valid holders to update",
          validationErrors,
        },
        { status: 400 }
      );
    }

    await logger.log("Prepared operations", { count: operations.length });

    const result = await Holder.bulkWrite(operations);

    // Verify updates
    const verificationResults = await Promise.all(
      operations.map(async (op) => {
        const address = op.updateOne.filter.address;
        const updated = await Holder.findOne({ address });
        const totalAccumulated = updated?.distributions
          ? calculateTotalAccumulated(updated.distributions)
          : 0;

        return {
          address,
          success: !!updated,
          found: !!updated,
          tokenCount: updated?.tokenCount,
          tokenIdsLength: updated?.tokenIds?.length,
          tokenTiersLength: updated?.tokenTiers?.length,
          distributionsLength: updated?.distributions?.length,
          totalAccumulated,
          campaignStats: {
            totalAccumulatedTokens: totalAccumulated,
            lastProcessedDay: updated?.distributions?.length || 0,
          },
        };
      })
    );

    await logger.log("Verification results", verificationResults);

    return NextResponse.json({
      message: "Holders updated successfully",
      count: operations.length,
      validationErrors:
        validationErrors.length > 0 ? validationErrors : undefined,
      verificationResults,
    });
  } catch (error: unknown) {
    await logger.error("Error updating holders", error);
    return NextResponse.json(
      {
        error: "Failed to update holders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
