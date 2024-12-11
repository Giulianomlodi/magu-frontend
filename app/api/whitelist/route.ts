// src/app/api/whitelist/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Referral from "@/lib/models/referral";
import Holder from "@/lib/models/holder";

export async function GET() {
  try {
    await dbConnect();

    // Get all successful referrals grouped by referrer
    const whitelistData = await Referral.aggregate([
      // Only get used referrals
      { $match: { used: true } },

      // Group by referrer
      {
        $group: {
          _id: "$referrerAddress",
          whitelistedAddresses: {
            $push: {
              address: "$referredAddress",
              claimedAt: "$usedAt",
            },
          },
          totalReferred: { $sum: 1 },
        },
      },

      // Lookup referrer details from Holders collection
      {
        $lookup: {
          from: "holders",
          localField: "_id",
          foreignField: "address",
          as: "holderData",
        },
      },

      // Format the output
      {
        $project: {
          referrer: "$_id",
          holderTokenCount: { $arrayElemAt: ["$holderData.tokenCount", 0] },
          totalReferred: 1,
          whitelistedAddresses: 1,
        },
      },

      // Sort by most referrals
      { $sort: { totalReferred: -1 } },
    ]);

    // Get total whitelist count
    const totalWhitelisted = await Referral.countDocuments({ used: true });

    return NextResponse.json({
      data: {
        totalWhitelisted,
        referrers: whitelistData,
      },
    });
  } catch (error) {
    console.error("Error fetching whitelist:", error);
    return NextResponse.json(
      { error: "Failed to fetch whitelist data" },
      { status: 500 }
    );
  }
}
