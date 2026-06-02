export interface Track {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "12:00"
  frequency: string; // e.g. "4.0 Hz" or "432 Hz"
  category: 'theta' | 'alpha' | 'delta' | 'solfeggio' | 'gamma' | 'other';
  premium: boolean;
  locked?: boolean; // Dynamic status based on user authorization
  synthType?: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'binaural' | 'audio';
  synthHz?: number;
  binauralCarrier?: number; // e.g. 200 Hz
  binauralBeat?: number; // e.g. 4 Hz (Theta)
  audioData?: string; // base64 encoded audio string if uploaded
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'none' | 'day_pass' | 'monthly';
  subscriptionExpiresAt: string | null; // ISO Date String or null
  createdAt: string;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'reviewed' | 'contacted';
  createdAt: string;
}

export interface PaymentSimulation {
  success: boolean;
  type: 'day_pass' | 'monthly';
  amount: number;
}
