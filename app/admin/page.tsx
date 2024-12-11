'use client'
import React from 'react';
import BananaMatrixBackground from '@/components/layout/BananaMatrixBackground';
import { Delius_Swash_Caps } from 'next/font/google';

import AdminMint from '@/components/web3/AdminMint';
import AdminToggleMint from '@/components/web3/AdminToggleMint';
import AdminWithdraw from '@/components/web3/AdminWithdraw';
import WhitelistDashboard from '@/components/admin/whitelistDashboard';
import Admin from '@/components/web3/Admin/Admin';


const contractAddress = process.env.NEXT_PUBLIC_TEST_ADDRESS as `0x${string}`;

const deliusSwashCaps = Delius_Swash_Caps({
    weight: '400',
    subsets: ['latin'],
});

const Hero = () => {
    return (
        <>

            <section className="min-h-screen w-full overflow-scroll flex flex-col items-center justify-start">
                <div className="flex flex-col md:flex-row w-full h-full mt-[10px] md:mt-0 md:py-[75px]">
                    <div className="w-full flex flex-col justify-center items-center p-6 md:p-12 mt-0 md:mt-0 space-y-8 z-10">
                        <div className="text-center max-w-md space-y-4">
                            <p className={`text-lg ${deliusSwashCaps.className}`}>

                            </p>
                        </div>
                        <div className="w-full max-w-xs space-y-4">
                            <Admin contractAddress={contractAddress} />
                            {/* <WhitelistDashboard />
                            <AdminMint />
                            <AdminToggleMint />

                            <AdminWithdraw /> */}
                        </div>
                    </div>
                </div>
            </section>

            <BananaMatrixBackground />
        </>
    );
};

export default Hero;