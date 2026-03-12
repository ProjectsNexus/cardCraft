export interface Lead {
  id: string;
  cardId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: any;
}

export type CardTemplate = 'modern' | 'minimal' | 'professional' | 'creative' | 'dark' | 'bold' | 'elegant' | 'brutalist' | 'glass';

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
  qrColor: string;
  whatsappApiEnabled?: boolean;
}

export type UserRole = 'admin' | 'owner' | 'customer';
export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  plan: UserPlan;
  planExpiry?: any;
  status: 'active' | 'inactive';
  createdAt: any;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

export interface SupportTicket {
  id: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  timestamp: any;
}

export interface CardLog {
  id: string;
  cardId: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'click' | 'share';
  timestamp: any;
  details?: string;
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
  qrColor: '#000000',
};
