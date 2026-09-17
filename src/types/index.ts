export type UserRole = 'citizen' | 'business' | 'recycler' | 'ngo' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  companyName?: string;
  rewardPoints?: number;
  createdAt: string;
}

export type WasteCategory =
  | 'Plastic'
  | 'E-Waste'
  | 'Construction'
  | 'Metal'
  | 'Glass'
  | 'Paper'
  | 'Cardboard'
  | 'Other';

export type WasteLifecycleStatus =
  | 'GENERATED'
  | 'MATCHED'
  | 'COLLECTED'
  | 'TRANSPORTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'RECYCLED'
  | 'REUSED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WasteListing {
  id: string;
  wasteId: string;
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  material: string;
  category: WasteCategory;
  quantity: number;
  unit: 'KG' | 'Tons' | 'Units';
  description: string;
  imageUrl: string;
  location: string;
  coordinates: Coordinates;
  status: WasteLifecycleStatus;
  recyclerId?: string;
  recyclerName?: string;
  preferredPickupDate?: string;
  expectedPrice?: number;
  createdAt: string;
  updatedAt: string;
  verificationHash: string;
  condition?: string;
  aiConfidence?: number;
  suggestedProcessing?: string;
}

export interface WasteLifecycleEvent {
  eventId: string;
  wasteId: string;
  status: WasteLifecycleStatus;
  actorId: string;
  actorName: string;
  actorRole: string;
  location: string;
  timestamp: string;
  description: string;
  hash: string;
  previousHash: string;
  verified: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface Recycler {
  recyclerId: string;
  name: string;
  email: string;
  materialsAccepted: WasteCategory[];
  capacity: number;
  availableCapacity: number;
  location: string;
  coordinates: Coordinates;
  verified: boolean;
  rating: number;
  phone?: string;
  address?: string;
  demandHigh?: boolean;
}

export interface Reward {
  rewardId: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  createdAt: string;
}

export interface Transaction {
  transactionId: string;
  wasteId: string;
  eventId: string;
  hash: string;
  timestamp: string;
  type: WasteLifecycleStatus;
  verified: boolean;
  actorName: string;
}

export interface FraudAlert {
  alertId: string;
  wasteId: string;
  type: 'Quantity Mismatch' | 'Duplicate Claim' | 'Sequence Anomaly' | 'Capacity Exceeded';
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  claimedQuantity?: number;
  verifiedQuantity?: number;
}

export interface AIAnalysisResult {
  material: string;
  category: WasteCategory;
  confidence: number;
  condition: string;
  recyclability: 'High' | 'Medium' | 'Low' | 'Specialized';
  suggestedProcessing: string;
  estimatedDensityKgPerM3?: number;
  notes: string;
}

export interface MatchScoreResult {
  recycler: Recycler;
  score: number;
  breakdown: {
    materialMatch: number;
    distanceScore: number;
    capacityScore: number;
    demandBonus: number;
  };
  distanceKm: number;
}
