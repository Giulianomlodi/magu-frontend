// components/HeroSection.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { EntranceChat } from '@/components/web3/chat/EntranceChat';
import Image from 'next/image';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="hero flex flex-col md:flex-row gap-2 md:gap-40 items-center justify-center px-5 md:px-[195px] pt-20 md:pt-40">
      <div className="md:w-1/2 flex items-center justify-center">
        <EntranceChat />
      </div>
      <div className={`md:w-1/2 ${isMobile ? 'h-[50vh] w-full overflow-hidden' : 'h-screen'} mt-8 md:mt-0 flex items-center justify-center`}>
        <div className={isMobile ? 'scale-[0.7] origin-center' : ''}>
          <Image src="/images/YG.png" alt="Logo" width={800} height={800} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;