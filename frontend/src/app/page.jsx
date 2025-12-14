'use client';

import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary">
      <HeroSection />
      <AboutSection />
      <FAQ />
      <Footer />
    </div>
  );
}
