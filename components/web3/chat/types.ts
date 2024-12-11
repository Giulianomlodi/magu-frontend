// types/index.ts
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface UserState {
  hasClaimedDiscount: boolean;
  hasPaidEntrance: boolean;
  hasMinted: boolean;
}

export interface WhitelistConfig {
  members: `0x${string}`[];
}
