import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Auction from "@/lib/models/auction";
import type { AuctionData, AuctionUpdate } from "@/types/auction";

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

async function validateUpdate(update: AuctionUpdate) {
  if (update.startingValue !== undefined && update.startingValue < 0) {
    throw new ValidationError("Starting value cannot be negative");
  }
  if (update.currentValue !== undefined && update.currentValue < 0) {
    throw new ValidationError("Current value cannot be negative");
  }
  if (update.targetValue !== undefined && update.targetValue < 0) {
    throw new ValidationError("Target value cannot be negative");
  }

  const auction = await Auction.getCurrentAuction();
  if (!auction) {
    throw new ValidationError("No auction found");
  }

  const newStartingValue = update.startingValue ?? auction.startingValue;
  const newCurrentValue = update.currentValue ?? auction.currentValue;
  const newTargetValue = update.targetValue ?? auction.targetValue;

  if (newCurrentValue < newStartingValue) {
    throw new ValidationError(
      "Current value cannot be less than starting value"
    );
  }

  if (newCurrentValue > newTargetValue) {
    throw new ValidationError("Current value cannot exceed target value");
  }

  if (newStartingValue >= newTargetValue) {
    throw new ValidationError("Starting value must be less than target value");
  }
}

export async function GET() {
  try {
    await dbConnect();
    const auction = await Auction.getCurrentAuction();

    if (!auction) {
      return NextResponse.json(
        { error: "No auction data found" },
        { status: 404 }
      );
    }

    const auctionData: AuctionData = {
      startingValue: auction.startingValue,
      currentValue: auction.currentValue,
      targetValue: auction.targetValue,
      isLive: auction.isLive,
      lastUpdated: auction.lastUpdated,
    };

    return NextResponse.json({
      data: auctionData,
      message: "Auction data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching auction data:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const update: AuctionUpdate = await request.json();

    // Validate the update
    await validateUpdate(update);

    const auction = await Auction.getCurrentAuction();
    if (!auction) {
      return NextResponse.json({ error: "No auction found" }, { status: 404 });
    }

    // Destructure the update object
    const { startingValue, currentValue, targetValue, isLive } = update;

    // Apply updates if defined
    if (startingValue !== undefined) {
      auction.set("startingValue", startingValue);
    }
    if (currentValue !== undefined) {
      auction.set("currentValue", currentValue);
    }
    if (targetValue !== undefined) {
      auction.set("targetValue", targetValue);
    }
    if (isLive !== undefined) {
      auction.set("isLive", isLive);
    }

    auction.set("lastUpdated", new Date());
    await auction.save();

    const auctionData: AuctionData = {
      startingValue: auction.startingValue,
      currentValue: auction.currentValue,
      targetValue: auction.targetValue,
      isLive: auction.isLive,
      lastUpdated: auction.lastUpdated,
    };

    return NextResponse.json({
      data: auctionData,
      message: "Auction updated successfully",
    });
  } catch (error) {
    console.error("Error updating auction data:", error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update auction data" },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  try {
    await dbConnect();
    const auction = await Auction.getCurrentAuction();

    if (!auction) {
      return NextResponse.json({ isLive: false });
    }

    return NextResponse.json({
      isLive: auction.isLive,
    });
  } catch (error) {
    console.error("Error checking auction status:", error);
    return NextResponse.json(
      { error: "Failed to check auction status" },
      { status: 500 }
    );
  }
}
