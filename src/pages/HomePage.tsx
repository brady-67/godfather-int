import { ContactCta } from '@/components/home/ContactCta';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { GlobalCoverage } from '@/components/home/GlobalCoverage';
import { HeroSection } from '@/components/home/HeroSection';
import { NairobiHub } from '@/components/home/NairobiHub';
import { ServicesPreview } from '@/components/home/ServicesPreview';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <NairobiHub />
      <GlobalCoverage />
      <FeaturedProducts />
      <ServicesPreview />
      <ContactCta />
    </div>
  );
}
