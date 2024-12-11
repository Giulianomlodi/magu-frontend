// src/app/api/referrals/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Referral from "@/lib/models/referral";
import { generateReferralCode } from "@/lib/utils/referral";
import type { ReferralDocument } from "@/lib/models/referral";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Check if user has reached their referral limit
    const canCreateMore = await Referral.checkReferralLimit(address);
    if (!canCreateMore) {
      return NextResponse.json(
        { error: "Maximum referral links reached" },
        { status: 400 }
      );
    }

    // Generate a unique referral code
    const code = await generateReferralCode();

    const referral = await Referral.create({
      code,
      referrerAddress: address.toLowerCase(),
    });

    return NextResponse.json({ data: referral });
  } catch (error) {
    console.error("Error creating referral:", error);
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const code = searchParams.get("code");

    if (code) {
      // Fetch specific referral by code
      const referral = await Referral.findOne({ code });
      if (!referral) {
        return NextResponse.json(
          { error: "Referral not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: referral });
    }

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Fetch all referrals for an address
    const referrals = await Referral.find({
      referrerAddress: address.toLowerCase(),
    }).sort({ createdAt: -1 });

    // Get statistics
    const totalReferred = await Referral.countDocuments({
      referrerAddress: address.toLowerCase(),
      used: true,
    });

    // Get rank (number of referrers with more successful referrals)
    const rank = await Referral.aggregate([
      { $match: { used: true } },
      {
        $group: {
          _id: "$referrerAddress",
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: totalReferred } } },
      { $count: "rank" },
    ]);

    const rankPosition = rank.length > 0 ? rank[0].rank + 1 : 1;

    return NextResponse.json({
      data: {
        referrals,
        stats: {
          totalGenerated: referrals.length,
          totalReferred,
          rank: rankPosition,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { code, address } = await request.json();

    if (!code || !address) {
      return NextResponse.json(
        { error: "Code and address are required" },
        { status: 400 }
      );
    }

    // Check if referral exists and is unused
    const referral = await Referral.findOne({ code, used: false });
    if (!referral) {
      return NextResponse.json(
        { error: "Invalid or used referral code" },
        { status: 400 }
      );
    }

    // Prevent self-referral
    if (referral.referrerAddress.toLowerCase() === address.toLowerCase()) {
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Check if the address has already used a referral
    const existingReferral = await Referral.findOne({
      referredAddress: address.toLowerCase(),
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: "Address has already used a referral" },
        { status: 400 }
      );
    }

    // Update referral as used
    referral.referredAddress = address.toLowerCase();
    referral.used = true;
    referral.usedAt = new Date();
    await referral.save();

    // Get updated statistics for the referrer
    const totalReferred = await Referral.countDocuments({
      referrerAddress: referral.referrerAddress,
      used: true,
    });

    // Get rank after this referral
    const rank = await Referral.aggregate([
      { $match: { used: true } },
      {
        $group: {
          _id: "$referrerAddress",
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: totalReferred } } },
      { $count: "rank" },
    ]);

    const rankPosition = rank.length > 0 ? rank[0].rank + 1 : 1;

    return NextResponse.json({
      data: {
        referral,
        stats: {
          totalReferred,
          rank: rankPosition,
        },
      },
    });
  } catch (error) {
    console.error("Error claiming referral:", error);
    return NextResponse.json(
      { error: "Failed to claim referral" },
      { status: 500 }
    );
  }
}

// Additional endpoint to get leaderboard
export async function HEAD(request: Request) {
  try {
    await dbConnect();

    // Get top referrers
    const leaderboard = await Referral.aggregate([
      { $match: { used: true } },
      {
        $group: {
          _id: "$referrerAddress",
          totalReferred: { $sum: 1 },
          lastReferral: { $max: "$usedAt" },
        },
      },
      { $sort: { totalReferred: -1, lastReferral: -1 } },
      { $limit: 100 }, // Get top 100 referrers
    ]);

    return NextResponse.json({
      data: {
        leaderboard: leaderboard.map((entry, index) => ({
          rank: index + 1,
          address: entry._id,
          totalReferred: entry.totalReferred,
          lastReferral: entry.lastReferral,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
