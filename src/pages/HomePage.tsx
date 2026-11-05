import { ContactCta } from '@/components/home/ContactCta';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { GlobalCoverage } from '@/components/home/GlobalCoverage';
import { HeroSection } from '@/components/home/HeroSection';
import { NairobiHub } from '@/components/home/NairobiHub';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { usePageMeta } from '@/hooks/usePageMeta';

export function HomePage() {
  usePageMeta({ description: 'Global sourcing, logistics, travel and immigration support, and a curated shop of quality goods, managed by one partner from Nairobi and Guangzhou.' });
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
