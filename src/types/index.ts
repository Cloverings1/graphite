export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  parentId: string | null;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  storage: string;
  transfer: string;
  speed: string;
  users: string;
  support: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
