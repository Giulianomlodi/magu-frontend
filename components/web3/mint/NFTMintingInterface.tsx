'use client'

import { useEffect, useRef, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWhitelistStatus } from './useWhitelistStatus';
import { italyABI } from '@/other-italy-abi';
import { Inter } from 'next/font/google';
import { Hash } from 'viem';

const inter = Inter({
    weight: '400',
    subsets: ['latin'],
});

const whitelistConfig = {
    members: [
        "0x6C44aBA1aFEd210C7886095d0780cc9d92D6bd0d", //Dep Test
        "0x129EBc4A440a15abA29978A22F676b2795a851c6",
        "0xc98Cb209f8F6b777d5624D55a366ec1612844305",
        "0xA9b1A919528F1540CBf6FdB395A22501CcB7Df37",//Fra
        "0xb9148E77f616Db263D2B661cC88Bac5aAF7Dfc54",//Dani
        "0xE43563A4c58aE485578597b7Cad0614517152c09",//G
        "0x3722A8bBA8AeEcAcb5ef45208822bf935FBADb75",//BurstLink
        "0x17650763d0cc8e64994e9d61c9f42e414fd1168c",//Luka
        "0xC4c2260310a7AF529108AA46a9b69f3DD1D00284",//Tony
        "0x0E0FfB6A3D7b177137f5d77e26a3b1D668c4DB11",//TestG3
        "0xa2004B13Db88F0f8c5EE71a18D42EC653A61DA05",//Fra 1 
        "0x18c37Aae0A48B2De89F43Ad01655A8afDcDB0B16",//Fra 2 
        "0x6316a7c591E73772C457Db369C475149f55b827e",//Fra 3 
    ] as `0x${string}`[],
    topMembers: [
        "0x6C44aBA1aFEd210C7886095d0780cc9d92D6bd0d",
    ] as `0x${string}`[]
};

export default function NFTMintingInterface({
    contractAddress
}: {
    contractAddress: `0x${string}`
}) {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [pendingTxHash, setPendingTxHash] = useState<Hash>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const memberVideoRef = useRef<HTMLVideoElement>(null);
    const topMemberVideoRef = useRef<HTMLVideoElement>(null);

    // Verify mint is active
    const { data: isMintActive } = useReadContract({
        address: contractAddress,
        abi: italyABI,
        functionName: 'activeMint'
    });

    const {
        isMemberWhitelisted,
        isTopMemberWhitelisted,
        memberMerkleProof,
        topMemberMerkleProof,
        memberMerkleRoot,
        topMemberMerkleRoot
    } = useWhitelistStatus(address, whitelistConfig);

    // Check claim status only when address is connected and whitelisted
    const shouldCheckMemberClaim = !!address && isMemberWhitelisted;
    const shouldCheckTopMemberClaim = !!address && isTopMemberWhitelisted;

    const { data: memberHasClaimed } = useReadContract({
        address: contractAddress,
        abi: italyABI,
        functionName: 'membersClaimed',
        args: shouldCheckMemberClaim ? [address] : undefined,
    });

    const { data: topMemberHasClaimed } = useReadContract({
        address: contractAddress,
        abi: italyABI,
        functionName: 'topMembersClaimed',
        args: shouldCheckTopMemberClaim ? [address] : undefined,
    });

    // Verify contract merkle roots match frontend
    const { data: contractMemberMerkleRoot } = useReadContract({
        address: contractAddress,
        abi: italyABI,
        functionName: 'membersMerkleRoot'
    });

    const { data: contractTopMemberMerkleRoot } = useReadContract({
        address: contractAddress,
        abi: italyABI,
        functionName: 'topMembersMerkleRoot'
    });

    const { writeContractAsync } = useWriteContract();

    // Transaction status monitoring
    const { isSuccess: isTxSuccess, isError: isTxError } = useWaitForTransactionReceipt({
        hash: pendingTxHash,
    });

    // Handle transaction status changes
    useEffect(() => {
        if (!pendingTxHash) return;

        if (isTxSuccess) {
            setIsProcessing(false);
            setErrorMessage(null);
        }

        if (isTxError) {
            setIsProcessing(false);
            setErrorMessage('Transaction failed. Please try again.');
        }
    }, [pendingTxHash, isTxSuccess, isTxError]);

    // Log merkle roots comparison in development
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.group('Merkle Roots Comparison');

            if (contractMemberMerkleRoot && memberMerkleRoot) {
                console.log('Members Merkle Root:');
                console.log('- Frontend:', memberMerkleRoot);
                console.log('- Contract:', contractMemberMerkleRoot);
                console.log('- Match:', contractMemberMerkleRoot === memberMerkleRoot);
            }

            if (contractTopMemberMerkleRoot && topMemberMerkleRoot) {
                console.log('\nTop Members Merkle Root:');
                console.log('- Frontend:', topMemberMerkleRoot);
                console.log('- Contract:', contractTopMemberMerkleRoot);
                console.log('- Match:', contractTopMemberMerkleRoot === topMemberMerkleRoot);
            }

            console.groupEnd();
        }
    }, [contractMemberMerkleRoot, memberMerkleRoot, contractTopMemberMerkleRoot, topMemberMerkleRoot]);

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle video playback
    useEffect(() => {
        const playVideos = async () => {
            try {
                await Promise.all([
                    memberVideoRef.current?.play(),
                    topMemberVideoRef.current?.play()
                ]);
            } catch (error) {
                console.error('Video playback failed:', error);
            }
        };

        if (mounted) {
            playVideos();
        }
    }, [mounted]);

    const handleMint = async (type: 'basic' | 'pro') => {
        if (!address) {
            setErrorMessage('Please connect your wallet first');
            return;
        }

        if (!isMintActive) {
            setErrorMessage('Minting is not currently active');
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi: italyABI,
                functionName: type === 'basic' ? 'mintBasic' : 'mintPro',
                args: [type === 'basic' ? memberMerkleProof : topMemberMerkleProof]
            });

            setPendingTxHash(txHash);
        } catch (error) {
            console.error('Minting error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Minting failed');
            setIsProcessing(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="container mx-auto px-4 py-40 space-y-8">
            {errorMessage && (
                <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                    <AlertDescription className={inter.className}>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Member NFT Card */}
                <Card className="bg-black/50 backdrop-blur border border-white/10">
                    <CardHeader>
                        <CardTitle className={`text-2xl text-white ${inter.className}`}>
                            SILVER ANCIENT ARTIFACT
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Join our exclusive community of Italian culture enthusiasts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <video
                            ref={memberVideoRef}
                            className="w-full rounded-lg shadow-xl"
                            src="/video/memberNFT.mp4"
                            autoPlay
                            playsInline
                            muted
                            loop
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        {!isMintActive ? (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Minting is not currently active
                                </AlertDescription>
                            </Alert>
                        ) : isMemberWhitelisted ? (
                            memberHasClaimed ? (
                                <Button
                                    className="w-full bg-zinc-400 hover:bg-zinc-400 hover:opacity-70 transition-opacity"
                                    disabled={true}
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Already Claimed
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-zinc-400 hover:bg-zinc-400 hover:opacity-70 transition-opacity"
                                    onClick={() => handleMint('basic')}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Minting...
                                        </>
                                    ) : (
                                        'Mint Member NFT'
                                    )}
                                </Button>
                            )
                        ) : (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Your address is not whitelisted for the Member NFT.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardFooter>
                </Card>

                {/* Top Member NFT Card */}
                <Card className="bg-black/50 backdrop-blur border border-white/10">
                    <CardHeader>
                        <CardTitle className={`text-2xl text-white ${inter.className}`}>
                            GOLD ANCIENT ARTIFACT
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Experience the top of Italian culture membership
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <video
                            ref={topMemberVideoRef}
                            className="w-full rounded-lg shadow-xl"
                            src="/video/topmemberNFT.mp4"
                            autoPlay
                            playsInline
                            muted
                            loop
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        {!isMintActive ? (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Minting is not currently active
                                </AlertDescription>
                            </Alert>
                        ) : isTopMemberWhitelisted ? (
                            topMemberHasClaimed ? (
                                <Button
                                    className="w-full bg-yellow-500 hover:bg-yellow-500 hover:opacity-70 transition-opacity"
                                    disabled={true}
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Already Claimed
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-yellow-500 hover:bg-yellow-500 hover:opacity-70 transition-opacity"
                                    onClick={() => handleMint('pro')}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Minting...
                                        </>
                                    ) : (
                                        'Mint Top Member NFT'
                                    )}
                                </Button>
                            )
                        ) : (
                            <Alert variant="destructive" className="bg-black/50 border border-red-500/50">
                                <AlertDescription className={inter.className}>
                                    Your address is not whitelisted for the Top Member NFT.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}