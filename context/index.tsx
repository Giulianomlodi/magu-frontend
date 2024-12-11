"use client";

import React, { ReactNode } from 'react';
import { config } from '@/config';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';

// Setup queryClient
const queryClient = new QueryClient();

export function ContextProvider({
    children
}: {
    children: ReactNode;

}) {
    return (
        <WagmiProvider config={config} >
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: '#F5C000',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                    fontStack: 'rounded',
                    overlayBlur: 'small',
                })}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}



