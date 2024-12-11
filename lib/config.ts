// src/lib/config.ts
import type { CampaignConfig } from "@/types/campaign";

export const DEFAULT_CONFIG: CampaignConfig = {
  TOTAL_TOKENS: 200_000_000,
  CAMPAIGN_DAYS: 10,
  TIER_MULTIPLIERS: {
    Uncommon: 1,
    Rare: 1.25,
    Epic: 1.5,
    Legendary: 1.8,
    OG: 2.0,
  },
  START_DATE: new Date().toISOString(),
};
