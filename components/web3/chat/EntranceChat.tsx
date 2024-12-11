// components/web3/chat/EntranceChat.tsx
'use client'
import { useChat } from './useChat';
import { Chat } from './Chat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, MessageSquare, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { getContractAddress } from '@/utils/env';
import { Progress } from '@/components/ui/progress';

export const EntranceChat = () => {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);

    const contractAddress = getContractAddress();

    const {
        isEntrancePaid,
        isProcessing,
        error,
        isWhitelisted,
        payEntranceFee,
        userState,
        messages,
        isMinting,
        isNFTMinted
    } = useChat(contractAddress);

    // Count user messages for progress bar
    const userMessageCount = messages.filter(m => m.sender === 'user').length;
    const progress = (userMessageCount / 3) * 100;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!address) {
        return (
            <Card className="w-full max-w-2xl bg-blue bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <Wallet className="h-12 w-12 text-white/60" />
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                            <p className="text-sm text-gray-400">
                                Please connect your wallet to access the Magu AI Chat
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!isEntrancePaid) {
        const entranceFee = isWhitelisted
            ? BigInt("50000000000000000") // 0.05 ETH
            : BigInt("100000000000000000"); // 0.1 ETH

        return (
            <Card className="w-full max-w-2xl bg-blue bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Welcome seeker</CardTitle>
                    <CardDescription className="text-gray-300">
                        To start chatting with Magu and mint your unique NFT, you need to pay a one-time entrance fee
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-white bg-opacity-5 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {isWhitelisted ? 'Whitelisted Fee' : 'Regular Fee'}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {isWhitelisted
                                        ? 'You are whitelisted! Special fee applied'
                                        : 'Standard entrance fee for all users'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {formatEther(entranceFee)} APE
                                </p>
                                {isWhitelisted && (
                                    <span className="text-sm text-green-400">50% Discount Applied</span>
                                )}
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={payEntranceFee}
                            disabled={isProcessing || userState?.hasClaimedDiscount}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : userState?.hasClaimedDiscount ? (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Already Claimed
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Pay {formatEther(entranceFee)} APE to Enter
                                </>
                            )}
                        </Button>

                        <div className="flex items-start gap-2 text-sm text-gray-400 bg-black/20 p-4 rounded-lg">
                            <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                            <div className="space-y-2">
                                <p>By waking Magu you'll:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Unlock the chat with him</li>
                                    <li>Be evaluated</li>
                                    <li>Obtain your NFT</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Chat />
            {!isNFTMinted && (
                <div className="w-full max-w-2xl">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Progress to NFT Minting</span>
                        <span>{userMessageCount}/3 messages</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {isMinting && (
                        <Alert className="mt-4 bg-blue-900/20 border-blue-500/50">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <AlertDescription>
                                Minting your unique NFT based on our conversation...
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
        </div>
    );
};