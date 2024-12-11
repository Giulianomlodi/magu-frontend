import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { useWhitelistStatus } from "./useWhitelistStatus";
import { Hash, keccak256, toBytes } from "viem";
import { Message, UserState } from "./types";
import { WHITELIST_CONFIG } from "./config";
import { abi } from "@/contract-abi";

export function useChat(contractAddress: `0x${string}`) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Magu, your AI companion. I'll help you mint a unique NFT based on our conversation. Tell me about yourself!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isEntrancePaid, setIsEntrancePaid] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState<Hash>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isNFTMinted, setIsNFTMinted] = useState(false);

  const { isWhitelisted, merkleProof } = useWhitelistStatus(
    address,
    WHITELIST_CONFIG
  );

  // Read contract state
  const { data: userState, refetch: refetchUserState } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getUserState",
    args: address ? [address] : undefined,
  });

  const { writeContractAsync } = useWriteContract();

  // Watch transaction status
  const { isSuccess: isTxSuccess, isLoading: isTxLoading } =
    useWaitForTransactionReceipt({
      hash: pendingTxHash,
    });

  // Set up contract event watching
  useEffect(() => {
    if (!publicClient || !address || !contractAddress) return;

    const unwatch = publicClient.watchContractEvent({
      address: contractAddress,
      abi,
      eventName: "EntrancePaid",
      args: {
        user: address,
      } as const,
      onLogs: (logs) => {
        // Check if the event is for the current user
        const relevantLog = logs.find(
          (log) => log.args.user?.toLowerCase() === address.toLowerCase()
        );
        if (relevantLog) {
          refetchUserState();
        }
      },
    });

    return () => {
      unwatch();
    };
  }, [publicClient, address, contractAddress, refetchUserState]);

  // Update states based on contract data
  useEffect(() => {
    if (userState && Array.isArray(userState)) {
      const [hasClaimedDiscount, hasPaidEntrance, hasMinted] = userState;

      // Only update if the state has changed
      if (isEntrancePaid !== hasPaidEntrance) {
        setIsEntrancePaid(hasPaidEntrance);
        if (hasPaidEntrance && messages.length === 1) {
          addMessage(
            "Thank you for joining! How can I assist you today?",
            "ai"
          );
        }
      }

      setIsNFTMinted(hasMinted);
    }
  }, [userState, messages.length, isEntrancePaid]);

  // Handle transaction completion
  useEffect(() => {
    if (isTxSuccess) {
      setIsProcessing(false);
      setError(null);
      refetchUserState();
    }
  }, [isTxSuccess, refetchUserState]);

  // Reset error when transaction is processing
  useEffect(() => {
    if (isTxLoading) {
      setError(null);
    }
  }, [isTxLoading]);

  const analyzeChat = (
    messages: Message[]
  ): { wisdom: number; power: number } => {
    const userMessages = messages.filter((m) => m.sender === "user");
    const totalLength = userMessages.reduce(
      (acc, m) => acc + m.content.length,
      0
    );
    return {
      wisdom: Math.min(100, totalLength),
      power: Math.floor(Math.random() * 100),
    };
  };

  const mintNFT = async () => {
    if (!address || !isEntrancePaid || isNFTMinted) return;

    setIsMinting(true);
    setError(null);

    try {
      const { wisdom, power } = analyzeChat(messages);
      const chatContent = messages.map((m) => m.content).join("");
      const aiRandomNumber = keccak256(toBytes(chatContent));

      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "mintTo",
        args: [address, aiRandomNumber, BigInt(wisdom), BigInt(power)],
      });

      setPendingTxHash(txHash);
    } catch (error) {
      console.error("Minting error:", error);
      setError(error instanceof Error ? error.message : "Minting failed");
      setIsMinting(false);
    }
  };

  const payEntranceFee = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: isWhitelisted
          ? "payEntranceFeeWhitelist"
          : "payEntranceFee",
        args: isWhitelisted ? [merkleProof] : [],
        value: isWhitelisted
          ? BigInt("50000000000000000") // 0.05 ETH
          : BigInt("100000000000000000"), // 0.1 ETH
      });

      setPendingTxHash(txHash);
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  const addMessage = (content: string, sender: "user" | "ai") => {
    if (!isEntrancePaid) {
      setError("Please pay the entrance fee first");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, newMessage];
      if (
        sender === "ai" &&
        newMessages.filter((m) => m.sender === "user").length >= 3
      ) {
        mintNFT();
      }
      return newMessages;
    });
  };

  return {
    messages,
    isEntrancePaid,
    isProcessing,
    error,
    isWhitelisted,
    isMinting,
    isNFTMinted,
    addMessage,
    payEntranceFee,
    userState:
      userState && Array.isArray(userState)
        ? {
            hasClaimedDiscount: userState[0],
            hasPaidEntrance: userState[1],
            hasMinted: userState[2],
          }
        : null,
  };
}
