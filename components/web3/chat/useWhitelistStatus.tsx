// hooks/useWhitelistStatus.ts
import { useMemo } from "react";
import { keccak256, encodePacked } from "viem";
import { MerkleTree } from "merkletreejs";
import { WhitelistConfig } from "./types";

export function useWhitelistStatus(
  address: `0x${string}` | undefined,
  whitelistConfig: WhitelistConfig
) {
  return useMemo(() => {
    const defaultReturn = {
      isWhitelisted: false,
      merkleProof: [] as `0x${string}`[],
      merkleRoot: "0x" as `0x${string}`,
    };

    if (!address) return defaultReturn;

    // Sort addresses to ensure consistent root
    const sortedAddresses = [...whitelistConfig.members].sort();

    // Create leaf nodes
    const leaves = sortedAddresses.map((addr) =>
      keccak256(encodePacked(["address"], [addr]))
    );

    // Create Merkle Tree
    const merkleTree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });

    // Get the root
    const merkleRoot = merkleTree.getHexRoot() as `0x${string}`;

    // Create leaf for the current address
    const leaf = keccak256(encodePacked(["address"], [address]));

    // Get proof for current address
    const merkleProof = merkleTree.getHexProof(leaf) as `0x${string}`[];

    // Verify if address is in whitelist
    const isWhitelisted = merkleTree.verify(merkleProof, leaf, merkleRoot);

    // Log verification details in development
    if (process.env.NODE_ENV === "development") {
      console.group("Whitelist Verification");
      console.log("Address:", address);
      console.log("Is Whitelisted:", isWhitelisted);
      console.log("Merkle Root:", merkleRoot);
      console.log("Merkle Proof:", merkleProof);
      console.groupEnd();
    }

    return {
      isWhitelisted,
      merkleProof,
      merkleRoot,
    };
  }, [address, whitelistConfig]);
}