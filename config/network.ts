// config/network.ts
import { useConfig, type Config } from "wagmi";

export const useChainConfig = () => {
  const config = useConfig();

  const getAddresses = () => {
    const chainId = config.chains[0]?.id ?? 33111; // Default to testnet if no chain

    // ApeChain (Live Network)
    if (chainId === 33139) {
      return {
        STAKING_ADDRESS: process.env
          .NEXT_PUBLIC_BANANA_STAKING_ADDRESS as `0x${string}`,
        NFT_ADDRESS: process.env
          .NEXT_PUBLIC_BANANA_NFT_ADDRESS as `0x${string}`,
        TOKEN_ADDRESS: process.env
          .NEXT_PUBLIC_BANANA_TOKEN_ADDRESS as `0x${string}`,
        GRAPHQL_ENDPOINT:
          "https://subgraph.satsuma-prod.com/1fbdab357f8a/giuliano--794168/banana-graph/api",
        BORED_ITALY_ADDRESS: process.env.NEXT_PUBLIC_ADDRESS as `0x${string}`,
      };
    }
    // Curtis (Test Network)
    else if (chainId === 33111) {
      return {
        STAKING_ADDRESS: process.env
          .NEXT_PUBLIC_TEST_BANANA_STAKING_ADDRESS as `0x${string}`,
        NFT_ADDRESS: process.env
          .NEXT_PUBLIC_TEST_BANANA_NFT_ADDRESS as `0x${string}`,
        TOKEN_ADDRESS: process.env
          .NEXT_PUBLIC_TEST_BANANA_TOKEN_ADDRESS as `0x${string}`,
        GRAPHQL_ENDPOINT:
          "https://subgraph.satsuma-prod.com/1fbdab357f8a/giuliano--794168/test-banana-graph/api",
        BORED_ITALY_ADDRESS: process.env
          .NEXT_PUBLIC_TEST_ADDRESS as `0x${string}`,
      };
    }

    // Default to test addresses for other networks
    return {
      STAKING_ADDRESS: process.env
        .NEXT_PUBLIC_TEST_BANANA_STAKING_ADDRESS as `0x${string}`,
      NFT_ADDRESS: process.env
        .NEXT_PUBLIC_TEST_BANANA_NFT_ADDRESS as `0x${string}`,
      TOKEN_ADDRESS: process.env
        .NEXT_PUBLIC_TEST_BANANA_TOKEN_ADDRESS as `0x${string}`,
      GRAPHQL_ENDPOINT:
        "https://subgraph.satsuma-prod.com/1fbdab357f8a/giuliano--794168/banana-graph/api",
      BORED_ITALY_ADDRESS:
        "0x28097aeC239a39B82756064fF2EE132dA4c4bBAb" as `0x${string}`,
    };
  };

  const addresses = getAddresses();
  const chainId = config.chains[0]?.id ?? 33111;

  return {
    addresses,
    isTestnet: chainId !== 33139, // anything not ApeChain is considered testnet
    chainId,
  };
};

export type ChainConfig = ReturnType<typeof useChainConfig>;
