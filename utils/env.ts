// utils/env.ts
export function getContractAddress(): `0x${string}` {
  const address = process.env.NEXT_PUBLIC_ADDRESS;
  if (!address) {
    throw new Error("Contract address not configured");
  }

  if (!address.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid contract address format");
  }

  return address as `0x${string}`;
}
