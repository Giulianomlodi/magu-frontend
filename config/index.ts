import { cookieStorage, createStorage } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { Chain } from "viem";

// Define your new chains
const apeChain = {
  id: 33139,
  name: "ApeChain",
  nativeCurrency: {
    name: "APE",
    symbol: "APE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://apechain.calderachain.xyz/http"],
    },
    public: {
      http: ["https://apechain.calderachain.xyz/http"],
    },
  },
  blockExplorers: {
    default: {
      name: "CalderaExplorer",
      url: "https://apechain.calderaexplorer.xyz/",
    },
  },
} as const satisfies Chain;

const curtisChain = {
  id: 33111,
  name: "Curtis",
  nativeCurrency: {
    name: "APE",
    symbol: "APE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://curtis.rpc.caldera.xyz/http"],
    },
    public: {
      http: ["https://curtis.rpc.caldera.xyz/http"],
    },
  },
  blockExplorers: {
    default: {
      name: "CalderaExplorer",
      url: "https://curtis.explorer.caldera.xyz/",
    },
  },
  testnet: true,
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "Banana Web app",
  projectId: "13e4f8639f1394481fc735b67e0133b6",
  chains: [
    apeChain, // Add ApeChain as main chain
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [curtisChain, sepolia]
      : []),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
