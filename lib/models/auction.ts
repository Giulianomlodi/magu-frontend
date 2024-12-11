// src/lib/models/auction.ts
import mongoose, { Model } from "mongoose";
import type { AuctionDocument, AuctionModelInterface } from "@/types/auction";

const auctionSchema = new mongoose.Schema<
  AuctionDocument,
  AuctionModelInterface
>(
  {
    startingValue: {
      type: Number,
      required: true,
      default: 1500000,
      min: 0,
    },
    currentValue: {
      type: Number,
      required: true,
      default: 1500000,
      min: 0,
    },
    targetValue: {
      type: Number,
      required: true,
      default: 3000000,
      min: 0,
    },
    isLive: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

// Static method to get current auction
auctionSchema.statics.getCurrentAuction = async function () {
  let auction = await this.findOne();
  if (!auction) {
    auction = await this.create({
      startingValue: 1500000,
      currentValue: 1500000,
      targetValue: 3000000,
      isLive: false,
      lastUpdated: new Date(),
    });
  }
  return auction;
};

// Static method to find auction by status
auctionSchema.statics.findByIsLive = async function (isLive: boolean) {
  return this.findOne({ isLive });
};

// Add validation
auctionSchema.pre("save", function (next) {
  if (this.currentValue < this.startingValue) {
    next(new Error("Current value cannot be less than starting value"));
  }
  if (this.currentValue > this.targetValue) {
    next(new Error("Current value cannot exceed target value"));
  }
  if (this.startingValue >= this.targetValue) {
    next(new Error("Starting value must be less than target value"));
  }
  if (this.startingValue < 0 || this.currentValue < 0 || this.targetValue < 0) {
    next(new Error("Values cannot be negative"));
  }
  next();
});

// Only allow one auction document
auctionSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Fix the typing issue by explicitly typing the constructor
    const Model = this.constructor as Model<AuctionDocument>;
    const count = await Model.countDocuments();
    if (count > 0) {
      next(new Error("Only one auction document can exist"));
      return;
    }
  }
  next();
});

const Auction =
  (mongoose.models.Auction as AuctionModelInterface) ||
  mongoose.model<AuctionDocument, AuctionModelInterface>(
    "Auction",
    auctionSchema
  );

export default Auction;
