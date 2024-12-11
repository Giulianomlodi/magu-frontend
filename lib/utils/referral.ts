// src/lib/utils/referral.ts
import Referral from "@/lib/models/referral";

export async function generateReferralCode(
  length: number = 8
): Promise<string> {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding similar looking characters
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code already exists
    const existing = await Referral.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code!;
}

export function formatReferralLink(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  return `${baseUrl}/referral/${code}`;
}
