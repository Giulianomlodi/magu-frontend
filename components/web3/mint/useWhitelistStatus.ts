"use client";

import { useMemo } from "react";
import { keccak256, encodePacked } from "viem";
import { MerkleTree } from "merkletreejs";

interface WhitelistConfig {
  members: `0x${string}`[];
  topMembers: `0x${string}`[];
}

export function useWhitelistStatus(
  address: `0x${string}` | undefined,
  whitelistConfig: WhitelistConfig
) {
  return useMemo(() => {
    // Initialize default return values
    const defaultReturn = {
      isMemberWhitelisted: false,
      isTopMemberWhitelisted: false,
      memberMerkleProof: [] as `0x${string}`[],
      topMemberMerkleProof: [] as `0x${string}`[],
      memberMerkleRoot: "0x" as `0x${string}`,
      topMemberMerkleRoot: "0x" as `0x${string}`,
    };

    // If no address is connected, return default values
    if (!address) return defaultReturn;

    // Helper function to create Merkle tree and get root/proof
    const createMerkleTreeAndGetDetails = (addresses: `0x${string}`[]) => {
      // Sort addresses to ensure consistent root
      const sortedAddresses = [...addresses].sort();

      // Create leaf nodes by hashing addresses with proper encoding
      const leaves = sortedAddresses.map((addr) =>
        keccak256(encodePacked(["address"], [addr]))
      );

      // Create Merkle Tree with sorted pairs for consistency
      const merkleTree = new MerkleTree(leaves, keccak256, {
        sortPairs: true,
      });

      // Get the Merkle root
      const root = merkleTree.getHexRoot() as `0x${string}`;

      // Create leaf for the current address
      const leaf = keccak256(encodePacked(["address"], [address]));

      // Get proof for current address
      const proof = merkleTree.getHexProof(leaf) as `0x${string}`[];

      // Verify if address is in whitelist
      const isWhitelisted = merkleTree.verify(proof, leaf, root);

      // Log verification details in development
      if (process.env.NODE_ENV === "development") {
        console.log(`Verification for ${addresses.length} addresses:`);
        console.log("- Address:", address);
        console.log("- Leaf:", leaf);
        console.log("- Root:", root);
        console.log("- Proof:", proof);
        console.log("- Is Whitelisted:", isWhitelisted);
      }

      return {
        isWhitelisted,
        proof,
        root,
      };
    };

    // Process member whitelist
    const {
      isWhitelisted: isMemberWhitelisted,
      proof: memberMerkleProof,
      root: memberMerkleRoot,
    } = createMerkleTreeAndGetDetails(whitelistConfig.members);

    // Process top member whitelist
    const {
      isWhitelisted: isTopMemberWhitelisted,
      proof: topMemberMerkleProof,
      root: topMemberMerkleRoot,
    } = createMerkleTreeAndGetDetails(whitelistConfig.topMembers);

    // Log overall results in development
    if (process.env.NODE_ENV === "development") {
      console.group("Whitelist Status Details");
      console.log("Connected Address:", address);
      console.log("\nMember Status:");
      console.log("- Is Whitelisted:", isMemberWhitelisted);
      console.log("- Root:", memberMerkleRoot);
      console.log("\nTop Member Status:");
      console.log("- Is Whitelisted:", isTopMemberWhitelisted);
      console.log("- Root:", topMemberMerkleRoot);
      console.groupEnd();
    }

    return {
      isMemberWhitelisted,
      isTopMemberWhitelisted,
      memberMerkleProof,
      topMemberMerkleProof,
      memberMerkleRoot,
      topMemberMerkleRoot,
    };
  }, [address, whitelistConfig]);
}
