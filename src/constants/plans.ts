import { CardTemplate, UserPlan } from '../types';

export interface PlanFeature {
  name: string;
  included: boolean;
  proOnly?: boolean;
}

export interface PlanDefinition {
  id: UserPlan;
  name: string;
  price: string;
  period?: string;
  description: string;
  maxCards: number;
  maxLandingPages: number;
  allowedTemplates: CardTemplate[];
  features: string[];
  cta: string;
  highlight?: boolean;
  footer?: string;
}

export const PLANS: Record<UserPlan, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free Beta',
    price: 'Rs. 0',
    description: 'Perfect for testing the waters during our beta phase.',
    maxCards: 1,
    maxLandingPages: 1,
    allowedTemplates: ['minimal', 'professional'],
    features: [
      '1 Digital Visiting Card',
      '1 Dedicated Landing Page',
      'Basic Analytics (Views)',
      'Standard Templates',
      'CardCraft Watermark',
      'Standard Support'
    ],
    cta: 'Start Free Beta',
    footer: 'No credit card required'
  },
  pro: {
    id: 'pro',
    name: 'Pro Professional',
    price: 'Rs. 1,500',
    period: '/mo',
    description: 'For serious professionals and business owners in Pakistan.',
    maxCards: 10,
    maxLandingPages: 10,
    allowedTemplates: ['minimal', 'professional', 'modern', 'dark', 'creative', 'bold', 'elegant', 'brutalist', 'glass'],
    features: [
      '10 Digital Visiting Cards',
      '10 Dedicated Landing Pages',
      'Advanced Analytics (Clicks & Leads)',
      'All Premium Templates',
      'No CardCraft Watermark',
      'WhatsApp API Integration',
      'Custom Branding & Colors',
      'Priority Support (WhatsApp)'
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
    footer: 'Best for entrepreneurs'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Rs. 5,000',
    period: '/mo',
    description: 'For large teams and corporate offices.',
    maxCards: 100,
    maxLandingPages: 100,
    allowedTemplates: ['minimal', 'professional', 'modern', 'dark', 'creative', 'bold', 'elegant', 'brutalist', 'glass'],
    features: [
      'Up to 100 Digital Cards',
      'Team Management Dashboard',
      'Bulk Card Creation',
      'Custom Domain Support',
      'Dedicated Account Manager',
      'API Access for CRM',
      'White-label Solution'
    ],
    cta: 'Contact Sales',
    footer: 'Custom solutions available'
  }
};

export const isTemplateAllowed = (template: CardTemplate, plan: UserPlan): boolean => {
  return PLANS[plan].allowedTemplates.includes(template);
};

export const canCreateMoreCards = (currentCount: number, plan: UserPlan): boolean => {
  return currentCount < PLANS[plan].maxCards;
};
