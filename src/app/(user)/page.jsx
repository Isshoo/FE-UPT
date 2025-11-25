'use client';

import HeroSection from '@/components/features/user/landing/HeroSection';
import FeaturesSection from '@/components/features/user/landing/FeaturesSection';
import StatsSection from '@/components/features/user/landing/StatsSection';
import CTASection from '@/components/features/user/landing/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
