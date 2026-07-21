export type CityId = 'barcelona' | 'madrid' | 'valencia';

export interface CityInfo {
  id: CityId;
  name: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  regionLabel: string;
  description: string;
}

export type ServiceId = 'fontaneria' | 'electricidad' | 'calentadores' | 'aire' | 'gas' | 'manitas';

export interface ServiceIssue {
  id: string;
  name: string;
  avgPrice: string;
  duration: string;
  description: string;
}

export interface ServiceDetail {
  id: ServiceId;
  name: string;
  iconName: string;
  tagline: string;
  longDescription: string;
  imageUrl: string;
  commonIssues: ServiceIssue[];
}

export interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  city: CityId;
  service: ServiceId;
  issueId?: string;
  customIssue?: string;
  address: string;
  urgency: 'normal' | 'urgente';
  status: 'received' | 'assigning' | 'dispatched' | 'completed';
  createdAt: string;
  assignedTech?: Technician;
}

export interface Technician {
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  etaMinutes: number;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}
