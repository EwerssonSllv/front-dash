import { Navbar } from "../components/landing/navbar";
import { HeroSection } from "../components/landing/hero-section";
import { BenefitsSection } from "../components/landing/benefits-section";
import { AnalyticsSection } from "../components/landing/analytics-section";
import { SecuritySection } from "../components/landing/security-section";
import { PricingSection } from "../components/landing/pricing-section";
import { Footer } from "../components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <AnalyticsSection />
      <SecuritySection />
      <PricingSection />
      <Footer />
    </main>
  )
}
