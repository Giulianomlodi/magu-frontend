import type { Metadata } from "next";
import { ContextProvider } from '@/context';
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


// app/layout.tsx
import { Inter } from 'next/font/google';

const deliusSwashCaps = Inter({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Other Italy Membership',
  description: 'Other Italy Membership Mint',
  // metadataBase: new URL(''),
  openGraph: {
    title: 'Other Italy Mint Page',
    description: 'Other Italy',
    url: '',
    siteName: 'Other Italy',
    images: [
      {
        url: '/OtherIta.jpg',  // Path relative to the public directory
        width: 1200,
        height: 630,
        alt: 'Other Italy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Other Italy',
    description: 'Other Italy Mint Page',
    images: ['/OtherIta.jpg'],
    creator: '@otakun_0x',
  },
}

type LayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en" className={deliusSwashCaps.className}>
      <body>
        <ContextProvider>

          <Header />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;