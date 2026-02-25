export type CardTemplate = 'modern' | 'minimal' | 'professional' | 'creative' | 'dark';

export interface CardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontSize: number;
  logoSize: number;
  template: CardTemplate;
  logo?: string;
  whatsapp?: string;
  customCallLink?: string;
  customMailLink?: string;
  customLocationLink?: string;
  customWebLink?: string;
  customWhatsappLink?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export const DEFAULT_CARD_DATA: CardData = {
  name: 'John Doe',
  title: 'Senior Product Designer',
  company: 'TechFlow Solutions',
  phone: '+1 (555) 000-0000',
  email: 'john.doe@techflow.com',
  website: 'www.techflow.com',
  address: '123 Innovation Way, San Francisco, CA',
  whatsapp: '',
  customCallLink: '',
  customMailLink: '',
  customLocationLink: '',
  customWebLink: '',
  customWhatsappLink: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  ctaLabel: 'View Portfolio',
  ctaUrl: '',
  primaryColor: '#6366f1', // Indigo 500
  secondaryColor: '#f8fafc', // Slate 50
  textColor: '#1e293b', // Slate 800
  fontSize: 16,
  logoSize: 48,
  template: 'modern',
};
