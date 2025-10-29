'use client';

import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import BenefitsSection from '@/components/BenefitsSection';
import FAQSection from '@/components/FAQSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary">
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <FAQSection />
    </div>
  );
}
