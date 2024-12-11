// src/lib/models/referral.ts
import mongoose from "mongoose";

export interface ReferralDocument extends mongoose.Document {
  code: string;
  referrerAddress: string;
  referredAddress?: string;
  used: boolean;
  createdAt: Date;
  usedAt?: Date;
}

interface ReferralModel extends mongoose.Model<ReferralDocument> {
  checkReferralLimit(referrerAddress: string): Promise<boolean>;
}

const referralSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  referrerAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  referredAddress: {
    type: String,
    lowercase: true,
    sparse: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  usedAt: {
    type: Date,
  },
});

// Add method to check if the referrer has reached their limit
referralSchema.statics.checkReferralLimit = async function (
  referrerAddress: string
): Promise<boolean> {
  const count = await this.countDocuments({ referrerAddress });
  return count < 5;
};

const Referral =
  (mongoose.models.Referral as ReferralModel) ||
  mongoose.model<ReferralDocument, ReferralModel>("Referral", referralSchema);

export default Referral;
