import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  BadgeCheck,
  Briefcase,
  Building2,
  Car,
  ClipboardCheck,
  Compass,
  FileText,
  Hotel,
  Landmark,
  Mountain,
  Package,
  Plane,
  Route,
  Scale,
  Search,
  Ship,
  ShoppingBag,
  Snowflake,
  Stamp,
  Store,
  Sun,
  Target,
  Trees,
  Waves,
} from 'lucide-react';

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceCategory {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  services: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'travel-immigration',
    eyebrow: 'Travel & Immigration',
    title: 'Seamless Travel & Immigration Support',
    intro:
      'Navigate visa requirements, secure accommodations, and arrange seamless travel logistics with our comprehensive immigration and travel support services.',
    services: [
      {
        title: 'Visa Services',
        description: 'Expert visa application support with complete documentation and guidance.',
        icon: FileText,
      },
      {
        title: 'Visa Extension',
        description: 'Streamlined visa renewal and extension services to maintain your stay.',
        icon: Stamp,
      },
      {
        title: 'Work Visa',
        description: 'Navigate China work visas and long-term engagement requirements with expertise.',
        icon: Briefcase,
      },
      {
        title: 'Immigration Appointments',
        description: 'Coordinate and manage all immigration-related appointments and procedures.',
        icon: ClipboardCheck,
      },
      {
        title: 'Hotel Bookings',
        description: 'Curated accommodations aligned with your business needs and comfort preferences.',
        icon: Hotel,
      },
      {
        title: 'Airport Pick-up & Transfers',
        description: 'Seamless ground transportation with professional drivers and premium vehicles.',
        icon: Car,
      },
      {
        title: 'Air Tickets',
        description: 'Competitive airfare booking with flexible scheduling and travel support.',
        icon: Plane,
      },
    ],
  },
  {
    id: 'supply-chain',
    eyebrow: 'Supply Chain & Logistics',
    title: 'Streamlined International Operations',
    intro:
      'Optimize your supply chain from sourcing to delivery with our end-to-end logistics solutions, quality assurance, and international shipping expertise.',
    services: [
      {
        title: 'Sourcing',
        description: 'Identify, vet, and shortlist reliable suppliers aligned with your objectives.',
        icon: Search,
      },
      {
        title: 'Cargo',
        description: 'End-to-end cargo handling and coordination for seamless international shipments.',
        icon: Package,
      },
      {
        title: 'Shipping',
        description: 'Comprehensive freight solutions with transparent terms and reliable networks.',
        icon: Ship,
      },
      {
        title: 'Import & Export',
        description: "Strategic guidance on China's export landscape and optimal import channels.",
        icon: Route,
      },
      {
        title: 'Inspection Services',
        description: 'Rigorous quality assurance protocols protecting your brand and compliance.',
        icon: BadgeCheck,
      },
      {
        title: 'Procurement',
        description: 'On-ground procurement representation maximizing efficiency and reducing friction.',
        icon: Store,
      },
      {
        title: 'General Merchandise',
        description: 'Comprehensive handling of diverse product categories and specialized goods.',
        icon: ShoppingBag,
      },
    ],
  },
  {
    id: 'business-financial',
    eyebrow: 'Business & Financial Services',
    title: 'Strategic Business Solutions',
    intro:
      'Establish secure business foundations with expert consulting, legal contract support, and transparent international payment solutions.',
    services: [
      {
        title: 'Business Consulting',
        description: 'Strategic advisory on market dynamics, regulatory landscape, and positioning.',
        icon: Target,
      },
      {
        title: 'Contracts',
        description: 'Legal clarity on business agreements ensuring protection and enforceability.',
        icon: Scale,
      },
      {
        title: 'Money Transfers',
        description: 'Secure, transparent international payment solutions with competitive rates.',
        icon: Banknote,
      },
    ],
  },
  {
    id: 'experience-hospitality',
    eyebrow: 'Experience & Hospitality',
    title: 'Memorable Global Experiences',
    intro:
      'Create memorable business experiences through curated site visits, cultural immersion, and strategic networking opportunities.',
    services: [
      {
        title: 'Tours & Travel',
        description: 'Strategic site visits and curated experiences that strengthen relationships.',
        icon: Compass,
      },
    ],
  },
];

export interface GlobalRegion {
  name: string;
  note: string;
  icon: LucideIcon;
}

export const GLOBAL_REGIONS: GlobalRegion[] = [
  { name: 'Africa', note: 'Trade corridors and sourcing partners', icon: Sun },
  { name: 'Asia', note: 'Manufacturing hubs at the heart of supply', icon: Mountain },
  { name: 'Europe', note: 'Established markets and compliance expertise', icon: Landmark },
  { name: 'North America', note: 'Retail, distribution and import channels', icon: Building2 },
  { name: 'South America', note: 'Growing markets and regional logistics', icon: Trees },
  { name: 'Australia', note: 'Pacific trade routes and partnerships', icon: Waves },
  { name: 'Antarctica & Arctic', note: 'Serving clients across the polar regions', icon: Snowflake },
];
