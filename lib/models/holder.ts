// src/lib/models/holder.ts
import mongoose from "mongoose";
import type {
  HolderDocument,
  HolderModel,
  HolderMethods,
} from "@/types/mongoose";
import type { Distribution, TierType } from "@/types/holder";

const distributionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  baseAllocation: {
    type: Number,
    required: true,
    default: 0,
  },
  adjustedAllocation: {
    type: Number,
    required: true,
    default: 0,
  },
  breakdown: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  },
});

const tokenTierSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    enum: ["Uncommon", "Rare", "Epic", "Legendary", "OG"],
    default: "Uncommon",
  },
});

const holderSchema = new mongoose.Schema<HolderDocument>({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  tokenCount: {
    type: Number,
    required: true,
    default: 0,
  },
  tokenIds: {
    type: [Number],
    required: true,
    default: [],
  },
  tokenTiers: {
    type: [tokenTierSchema],
    required: true,
    default: [],
  },
  weightedCount: {
    type: Number,
    required: true,
    default: 0,
  },
  breakdown: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
    validate: {
      validator: function (breakdown: any) {
        const validTiers: TierType[] = [
          "Uncommon",
          "Rare",
          "Epic",
          "Legendary",
          "OG",
        ];
        return Object.entries(breakdown).every(
          ([tier, data]: [string, any]) => {
            return (
              validTiers.includes(tier as TierType) &&
              typeof data.count === "number" &&
              typeof data.multiplier === "number" &&
              typeof data.subtotal === "number"
            );
          }
        );
      },
      message: "Invalid breakdown structure",
    },
  },
  distributions: {
    type: [distributionSchema],
    default: [],
    validate: {
      validator: function (distributions: Distribution[]) {
        return distributions.every(
          (dist) =>
            dist.baseAllocation >= 0 &&
            dist.adjustedAllocation >= 0 &&
            dist.date instanceof Date
        );
      },
      message: "Invalid distribution data",
    },
  },
  campaignStats: {
    totalAccumulatedTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastProcessedDay: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Add middleware to update campaignStats before saving
holderSchema.pre("save", function (this: HolderDocument, next) {
  if (this.distributions && Array.isArray(this.distributions)) {
    // Calculate total accumulated from distributions
    const totalAccumulated = this.distributions.reduce((sum, dist) => {
      return sum + (Number(dist.adjustedAllocation) || 0);
    }, 0);

    // Update campaign stats
    this.campaignStats = {
      totalAccumulatedTokens: totalAccumulated,
      lastProcessedDay: this.distributions.length,
    };
  }
  next();
});

// Add method to calculate total accumulated
holderSchema.methods.calculateTotalAccumulated = function (
  this: HolderDocument
): number {
  if (!this.distributions || !Array.isArray(this.distributions)) {
    return 0;
  }

  return this.distributions.reduce((total, dist) => {
    return total + (Number(dist.adjustedAllocation) || 0);
  }, 0);
};

// Add indexes for better query performance
holderSchema.index({ address: 1 }, { unique: true });
holderSchema.index({ tokenCount: -1 });
holderSchema.index({ weightedCount: -1 });
holderSchema.index({ "campaignStats.totalAccumulatedTokens": -1 });

const Holder =
  (mongoose.models.Holder as HolderModel) ||
  mongoose.model<HolderDocument, HolderModel>("Holder", holderSchema);

export default Holder;
