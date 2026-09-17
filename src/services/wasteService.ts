
import {
  FraudAlert,
  Recycler,
  User,
  WasteCategory,
  WasteLifecycleEvent,
  WasteLifecycleStatus,
  WasteListing,
} from '../types';
import { createTransactionHash } from './blockchainService';
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  LISTINGS: 'circutrace_listings_v1',
  LIFECYCLE: 'circutrace_lifecycle_v1',
  RECYCLERS: 'circutrace_recyclers_v1',
  ALERTS: 'circutrace_alerts_v1',
  CURRENT_USER: 'circutrace_current_user_v1',
};

export const DEMO_USERS: Record<string, User> = {
  citizen: {
    uid: 'usr_citizen_01',
    name: 'Aarav Sharma',
    email: 'citizen@demo.com',
    role: 'citizen',
    phone: '+91 98234 11022',
    location: 'Kothrud, Pune',
    rewardPoints: 2450,
    createdAt: '2026-08-10T10:00:00Z',
  },
  business: {
    uid: 'usr_biz_01',
    name: 'ABC Industrial Corp',
    companyName: 'ABC Manufacturing Ltd.',
    email: 'business@demo.com',
    role: 'business',
    phone: '+91 20 2712 4499',
    location: 'Bhosari MIDC, Pune',
    rewardPoints: 5800,
    createdAt: '2026-07-15T09:00:00Z',
  },
  recycler: {
    uid: 'usr_rec_01',
    name: 'GreenCycle Processing Plant',
    companyName: 'GreenCycle Recycling India Pvt Ltd',
    email: 'recycler@demo.com',
    role: 'recycler',
    phone: '+91 20 6688 9900',
    location: 'Chakan Industrial Corridor, Pune',
    rewardPoints: 9200,
    createdAt: '2026-06-01T08:30:00Z',
  },
  admin: {
    uid: 'usr_adm_01',
    name: 'Kunal Maidkar',
    companyName: 'CircuTrace Regulatory Board',
    email: 'admin@demo.com',
    role: 'admin',
    phone: '+91 20 4455 6677',
    location: 'Pune Municipal HQ',
    rewardPoints: 15000,
    createdAt: '2026-01-01T00:00:00Z',
  },
};

export const SEED_RECYCLERS: Recycler[] = [
  {
    recyclerId: 'REC-PUN-01',
    name: 'GreenCycle Recycling Facility',
    email: 'contact@greencycle.in',
    materialsAccepted: ['Plastic', 'Cardboard', 'Paper'],
    capacity: 15000,
    availableCapacity: 8200,
    location: 'Chakan Phase II, Pune',
    coordinates: { lat: 18.756, lng: 73.857 },
    verified: true,
    rating: 4.9,
    phone: '+91 20 6688 9900',
    address: 'Plot 42, Chakan Industrial Area, Pune 410501',
    demandHigh: true,
  },
  {
    recyclerId: 'REC-PUN-02',
    name: 'EcoLoop Advanced Materials',
    email: 'ops@ecoloop.in',
    materialsAccepted: ['E-Waste', 'Metal'],
    capacity: 8000,
    availableCapacity: 4500,
    location: 'Hadapsar Industrial Estate, Pune',
    coordinates: { lat: 18.508, lng: 73.925 },
    verified: true,
    rating: 4.8,
    phone: '+91 20 4123 7788',
    address: 'Survey 14, Hadapsar, Pune 411013',
    demandHigh: true,
  },
  {
    recyclerId: 'REC-PUN-03',
    name: 'ReNew Plastics & Polymer Reclaim',
    email: 'procure@renewplastics.com',
    materialsAccepted: ['Plastic', 'Glass'],
    capacity: 20000,
    availableCapacity: 12400,
    location: 'Pimpri-Chinchwad, Pune',
    coordinates: { lat: 18.627, lng: 73.813 },
    verified: true,
    rating: 4.7,
    phone: '+91 20 2745 6622',
    address: 'Sector 10, MIDC Bhosari, Pune 411026',
    demandHigh: false,
  },
  {
    recyclerId: 'REC-PUN-04',
    name: 'Pune E-Waste Clean Recovery',
    email: 'support@punecleanewaste.org',
    materialsAccepted: ['E-Waste', 'Metal'],
    capacity: 5000,
    availableCapacity: 1800,
    location: 'Shivajinagar, Pune',
    coordinates: { lat: 18.531, lng: 73.844 },
    verified: true,
    rating: 4.9,
    phone: '+91 20 2553 1120',
    address: 'Model Colony, Shivajinagar, Pune 411016',
    demandHigh: false,
  },
  {
    recyclerId: 'REC-PUN-05',
    name: 'MahaBuild Circular Aggregate Ltd',
    email: 'rubble@mahabuild.com',
    materialsAccepted: ['Construction', 'Glass'],
    capacity: 50000,
    availableCapacity: 31000,
    location: 'Wagholi Highway, Pune',
    coordinates: { lat: 18.581, lng: 73.978 },
    verified: true,
    rating: 4.6,
    phone: '+91 20 6712 9944',
    address: 'Km 14 Nagar Road, Wagholi, Pune 412207',
    demandHigh: true,
  },
];

export const SEED_LISTINGS: WasteListing[] = [
  {
    id: 'wst-1',
    wasteId: 'WST-PUN-00124',
    ownerId: 'usr_biz_01',
    ownerName: 'ABC Industrial Corp',
    ownerRole: 'business',
    material: 'PET Plastic Bottles & Preforms',
    category: 'Plastic',
    quantity: 500,
    unit: 'KG',
    description: 'Baled clean post-industrial beverage bottle cutoffs and rejected preforms.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60',
    location: 'Bhosari MIDC, Pune',
    coordinates: { lat: 18.629, lng: 73.842 },
    status: 'RECYCLED',
    recyclerId: 'REC-PUN-01',
    recyclerName: 'GreenCycle Recycling Facility',
    preferredPickupDate: '2026-09-12',
    expectedPrice: 12500,
    createdAt: '2026-09-12T08:30:00Z',
    updatedAt: '2026-09-15T16:00:00Z',
    verificationHash: '0x8f72a4d91b32ec4810795c6b610c14bdf88134ea277884144365d70f91ac',
    condition: 'Clean, crushed, baled',
    aiConfidence: 96.4,
    suggestedProcessing: 'Flaking, hot washing, decontamination and pelletizing to rPET food-grade pellets.',
  },
  {
    id: 'wst-2',
    wasteId: 'WST-PUN-00125',
    ownerId: 'usr_biz_01',
    ownerName: 'ABC Industrial Corp',
    ownerRole: 'business',
    material: 'Computer Motherboards & Server PCBs',
    category: 'E-Waste',
    quantity: 120,
    unit: 'KG',
    description: 'Decommissioned server components with copper busbars and gold plated connectors.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    location: 'Hinjawadi Phase 1, Pune',
    coordinates: { lat: 18.591, lng: 73.738 },
    status: 'PROCESSED',
    recyclerId: 'REC-PUN-02',
    recyclerName: 'EcoLoop Advanced Materials',
    preferredPickupDate: '2026-09-13',
    expectedPrice: 28000,
    createdAt: '2026-09-13T09:15:00Z',
    updatedAt: '2026-09-15T11:20:00Z',
    verificationHash: '0x3c21db9a8e0f11476b72a089d7fa918bca440182390a19e59d9a741300994f21',
    condition: 'Intact boards, depopulated batteries',
    aiConfidence: 94.8,
    suggestedProcessing: 'Precious metal hydrometallurgical leaching and copper electrolysis.',
  },
  {
    id: 'wst-3',
    wasteId: 'WST-PUN-00126',
    ownerId: 'usr_citizen_01',
    ownerName: 'Aarav Sharma',
    ownerRole: 'citizen',
    material: 'Demolition Concrete Rubble & Masonry',
    category: 'Construction',
    quantity: 2.4,
    unit: 'Tons',
    description: 'Renovation debris from residential floor tiling and masonry partitions.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=60',
    location: 'Kothrud, Pune',
    coordinates: { lat: 18.507, lng: 73.807 },
    status: 'COLLECTED',
    recyclerId: 'REC-PUN-05',
    recyclerName: 'MahaBuild Circular Aggregate Ltd',
    preferredPickupDate: '2026-09-14',
    createdAt: '2026-09-14T10:00:00Z',
    updatedAt: '2026-09-14T14:40:00Z',
    verificationHash: '0x992b4fa55c9103e83917d23ea405bc9120feaa44901831ab009148dceea48231',
    condition: 'Dry masonry rubble',
    aiConfidence: 91.5,
    suggestedProcessing: 'Jaw crusher processing to 20mm road aggregate.',
  },
  {
    id: 'wst-4',
    wasteId: 'WST-PUN-00127',
    ownerId: 'usr_citizen_01',
    ownerName: 'Aarav Sharma',
    ownerRole: 'citizen',
    material: 'Double-Wall Corrugated Cardboard',
    category: 'Cardboard',
    quantity: 300,
    unit: 'KG',
    description: 'Flat packed delivery boxes from logistics depot clearance.',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
    location: 'Viman Nagar, Pune',
    coordinates: { lat: 18.567, lng: 73.914 },
    status: 'MATCHED',
    recyclerId: 'REC-PUN-01',
    recyclerName: 'GreenCycle Recycling Facility',
    preferredPickupDate: '2026-09-16',
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-09-15T15:30:00Z',
    verificationHash: '0x17fa44b82c91807eab39017255daea791c10928e461a877b091fca992178ad52',
    condition: 'Clean, dry cartons',
    aiConfidence: 97.2,
    suggestedProcessing: 'Hydropulping and corrugating medium production.',
  },
];

export const SEED_LIFECYCLE_EVENTS: WasteLifecycleEvent[] = [
  {
    eventId: 'EVT-1001',
    wasteId: 'WST-PUN-00124',
    status: 'GENERATED',
    actorId: 'usr_biz_01',
    actorName: 'ABC Industrial Corp',
    actorRole: 'Waste Generator',
    location: 'Bhosari MIDC, Pune',
    timestamp: '2026-09-12T08:30:00Z',
    description: '500 KG PET Plastic cataloged and listed with AI verified classification.',
    hash: '0x0114aef729910c81923058b7610c14bdf88134ea277884144365d70f91a001',
    previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    verified: true,
  },
  {
    eventId: 'EVT-1002',
    wasteId: 'WST-PUN-00124',
    status: 'MATCHED',
    actorId: 'usr_rec_01',
    actorName: 'GreenCycle Facility',
    actorRole: 'Certified Recycler',
    location: 'Chakan Industrial Belt, Pune',
    timestamp: '2026-09-12T14:15:00Z',
    description: 'Pickup match confirmed by GreenCycle with 96% compatibility index.',
    hash: '0x4981bc20a17498c08173499fa6089d7fa918bca440182390a19e59d9a7413009',
    previousHash: '0x0114aef729910c81923058b7610c14bdf88134ea277884144365d70f91a001',
    verified: true,
  },
  {
    eventId: 'EVT-1003',
    wasteId: 'WST-PUN-00124',
    status: 'COLLECTED',
    actorId: 'AGT-881',
    actorName: 'EcoLogistics Van #MH14-EN-4492',
    actorRole: 'Logistics Courier',
    location: 'Bhosari MIDC Warehouse B-4',
    timestamp: '2026-09-13T10:00:00Z',
    description: 'Bales weighed on-site (500 KG net) and loaded into sealed transport unit.',
    hash: '0x712fa910cb4510839a8820f182c14bdf88134ea277884144365d70f91ac774',
    previousHash: '0x4981bc20a17498c08173499fa6089d7fa918bca440182390a19e59d9a7413009',
    verified: true,
  },
  {
    eventId: 'EVT-1004',
    wasteId: 'WST-PUN-00124',
    status: 'TRANSPORTED',
    actorId: 'AGT-881',
    actorName: 'EcoLogistics Corridor Express',
    actorRole: 'Transit Telematics',
    location: 'Nashik-Pune Expressway Corridor',
    timestamp: '2026-09-13T12:45:00Z',
    description: 'Transit completed without route deviation. GPS geofence cleared.',
    hash: '0x889a710b14c3309a48f7129ca089d7fa918bca440182390a19e59d9a7413001',
    previousHash: '0x712fa910cb4510839a8820f182c14bdf88134ea277884144365d70f91ac774',
    verified: true,
  },
  {
    eventId: 'EVT-1005',
    wasteId: 'WST-PUN-00124',
    status: 'RECEIVED',
    actorId: 'usr_rec_01',
    actorName: 'GreenCycle Inbound Gate',
    actorRole: 'Receiving Dock',
    location: 'Chakan Inbound Weighbridge',
    timestamp: '2026-09-13T14:30:00Z',
    description: 'Inbound weighbridge recorded 498.5 KG (0.3% moisture variation). Approved.',
    hash: '0x19ca440182390a19e59d9a74130098f72a4d91b32ec4810795c6b610c14bdf88',
    previousHash: '0x889a710b14c3309a48f7129ca089d7fa918bca440182390a19e59d9a7413001',
    verified: true,
  },
  {
    eventId: 'EVT-1006',
    wasteId: 'WST-PUN-00124',
    status: 'PROCESSED',
    actorId: 'usr_rec_01',
    actorName: 'GreenCycle Flaking Line #3',
    actorRole: 'Facility Operator',
    location: 'Chakan Processing Unit',
    timestamp: '2026-09-14T11:00:00Z',
    description: 'Bales de-strapped, optical sorted by color, chopped into 8mm flakes and hot caustic washed.',
    hash: '0x99201844fa78832a819c991a0c7104bdf88134ea277884144365d70f91ab810',
    previousHash: '0x19ca440182390a19e59d9a74130098f72a4d91b32ec4810795c6b610c14bdf88',
    verified: true,
  },
  {
    eventId: 'EVT-1007',
    wasteId: 'WST-PUN-00124',
    status: 'RECYCLED',
    actorId: 'usr_rec_01',
    actorName: 'GreenCycle Extrusion Dept',
    actorRole: 'Quality Inspector',
    location: 'Chakan Final Outbound Unit',
    timestamp: '2026-09-15T16:00:00Z',
    description: 'Flakes melted and extruded into 482 KG of certified food-contact rPET resin pellets.',
    hash: '0x8f72a4d91b32ec4810795c6b610c14bdf88134ea277884144365d70f91ac',
    previousHash: '0x99201844fa78832a819c991a0c7104bdf88134ea277884144365d70f91ab810',
    verified: true,
  },
];

export const SEED_ALERTS: FraudAlert[] = [
  {
    alertId: 'ALT-PUN-001',
    wasteId: 'WST-PUN-00124',
    type: 'Quantity Mismatch',
    description: 'Recycler inbound weighbridge recorded 498.5 KG vs 500 KG claimed. Verified within 0.3% moisture evaporation tolerance.',
    severity: 'low',
    status: 'resolved',
    createdAt: '2026-09-13T14:35:00Z',
    claimedQuantity: 500,
    verifiedQuantity: 498.5,
  },
  {
    alertId: 'ALT-PUN-002',
    wasteId: 'WST-PUN-00128',
    type: 'Quantity Mismatch',
    description: 'Flagged Anomaly: Recycler claims 500 KG recycled, but verified digital weighbridge ticket confirms 320 KG (Variance 180 KG).',
    severity: 'high',
    status: 'open',
    createdAt: '2026-09-15T09:20:00Z',
    claimedQuantity: 500,
    verifiedQuantity: 320,
  },
  {
    alertId: 'ALT-PUN-003',
    wasteId: 'WST-PUN-00119',
    type: 'Duplicate Claim',
    description: 'Attempted duplicate certificate registration: Batch ID #WST-PUN-00119 already issued carbon avoidance offset credits.',
    severity: 'medium',
    status: 'investigating',
    createdAt: '2026-09-14T17:40:00Z',
  },
];

class WasteStore {
  private listings: WasteListing[] = [];
  private lifecycleEvents: WasteLifecycleEvent[] = [];
  private recyclers: Recycler[] = [];
  private alerts: FraudAlert[] = [];
  private currentUser: User = DEMO_USERS.business;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      this.listings = storedListings ? JSON.parse(storedListings) : [...SEED_LISTINGS];

      const storedEvents = localStorage.getItem(STORAGE_KEYS.LIFECYCLE);
      this.lifecycleEvents = storedEvents ? JSON.parse(storedEvents) : [...SEED_LIFECYCLE_EVENTS];

      const storedRecyclers = localStorage.getItem(STORAGE_KEYS.RECYCLERS);
      this.recyclers = storedRecyclers ? JSON.parse(storedRecyclers) : [...SEED_RECYCLERS];

      const storedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : [...SEED_ALERTS];

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      this.currentUser = storedUser ? JSON.parse(storedUser) : DEMO_USERS.business;
    } catch {
      this.listings = [...SEED_LISTINGS];
      this.lifecycleEvents = [...SEED_LIFECYCLE_EVENTS];
      this.recyclers = [...SEED_RECYCLERS];
      this.alerts = [...SEED_ALERTS];
      this.currentUser = DEMO_USERS.business;
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(this.listings));
      localStorage.setItem(STORAGE_KEYS.LIFECYCLE, JSON.stringify(this.lifecycleEvents));
      localStorage.setItem(STORAGE_KEYS.RECYCLERS, JSON.stringify(this.recyclers));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(this.alerts));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('Storage save warning', e);
    }
  }

  public resetAll() {
    this.listings = [...SEED_LISTINGS];
    this.lifecycleEvents = [...SEED_LIFECYCLE_EVENTS];
    this.recyclers = [...SEED_RECYCLERS];
    this.alerts = [...SEED_ALERTS];
    this.currentUser = DEMO_USERS.business;
    this.save();
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.save();
  }

  public getListings(): WasteListing[] {
    return [...this.listings];
  }

  public getListingByWasteId(wasteId: string): WasteListing | undefined {
    return this.listings.find((l) => l.wasteId.toUpperCase() === wasteId.toUpperCase());
  }

  public getLifecycleEvents(wasteId: string): WasteLifecycleEvent[] {
    return this.lifecycleEvents
      .filter((e) => e.wasteId.toUpperCase() === wasteId.toUpperCase())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getRecyclers(): Recycler[] {
    return [...this.recyclers];
  }

  public getAlerts(): FraudAlert[] {
    return [...this.alerts];
  }

  public async createListing(
    params: Omit<WasteListing, 'id' | 'wasteId' | 'status' | 'createdAt' | 'updatedAt' | 'verificationHash'>
  ): Promise<WasteListing> {
    const nextNum = 124 + this.listings.length;
    const wasteId = `WST-PUN-${String(nextNum).padStart(5, '0')}`;
    const timestamp = new Date().toISOString();

    const genesisEvent: Omit<WasteLifecycleEvent, 'hash' | 'verified'> = {
      eventId: `EVT-${Date.now()}`,
      wasteId,
      status: 'GENERATED',
      actorId: params.ownerId,
      actorName: params.ownerName,
      actorRole: params.ownerRole === 'business' ? 'Commercial Generator' : 'Household Citizen',
      location: params.location,
      timestamp,
      description: `${params.quantity} ${params.unit} of ${params.material} cataloged and registered.`,
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const initialHash = await createTransactionHash(genesisEvent);

    const fullEvent: WasteLifecycleEvent = {
      ...genesisEvent,
      hash: initialHash,
      verified: true,
    };

    const newListing: WasteListing = {
      ...params,
      id: `wst-${Date.now()}`,
      wasteId,
      status: 'GENERATED',
      createdAt: timestamp,
      updatedAt: timestamp,
      verificationHash: initialHash,
    };

    this.listings.unshift(newListing);
    this.lifecycleEvents.push(fullEvent);

    this.currentUser.rewardPoints = (this.currentUser.rewardPoints || 0) + 10;

    this.save();

    if (db) {
      try {
        await setDoc(doc(db, 'wasteListings', newListing.id), newListing);
        await setDoc(doc(db, 'wasteLifecycle', fullEvent.eventId), fullEvent);
      } catch (err) {
        console.warn('Firestore optional sync notice:', err);
      }
    }

    return newListing;
  }

  public async advanceLifecycle(
    wasteId: string,
    targetStatus: WasteLifecycleStatus,
    actor: { id: string; name: string; role: string; location: string },
    description?: string
  ): Promise<WasteLifecycleEvent> {
    const listingIndex = this.listings.findIndex((l) => l.wasteId.toUpperCase() === wasteId.toUpperCase());
    if (listingIndex === -1) {
      throw new Error(`Waste listing with ID ${wasteId} not found.`);
    }

    const currentListing = this.listings[listingIndex];
    const existingEvents = this.getLifecycleEvents(wasteId);
    const lastEvent = existingEvents[existingEvents.length - 1];
    const previousHash = lastEvent ? lastEvent.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date().toISOString();
    const defaultDesc = description || `Status advanced to ${targetStatus} by ${actor.name}.`;

    const eventToHash: Omit<WasteLifecycleEvent, 'hash' | 'verified'> = {
      eventId: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      wasteId,
      status: targetStatus,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      location: actor.location || currentListing.location,
      timestamp,
      description: defaultDesc,
      previousHash,
    };

    const newHash = await createTransactionHash(eventToHash);

    const fullEvent: WasteLifecycleEvent = {
      ...eventToHash,
      hash: newHash,
      verified: true,
    };

    this.lifecycleEvents.push(fullEvent);

    this.listings[listingIndex] = {
      ...currentListing,
      status: targetStatus,
      updatedAt: timestamp,
      verificationHash: newHash,
      ...(actor.role.toLowerCase().includes('recycler') ? { recyclerName: actor.name } : {}),
    };

    this.save();

    if (db) {
      try {
        await updateDoc(doc(db, 'wasteListings', currentListing.id), {
          status: targetStatus,
          updatedAt: timestamp,
          verificationHash: newHash,
        });
        await setDoc(doc(db, 'wasteLifecycle', fullEvent.eventId), fullEvent);
      } catch (err) {
        console.warn('Firestore optional sync notice:', err);
      }
    }

    return fullEvent;
  }

  public async requestPickup(wasteId: string, recycler: Recycler): Promise<void> {
    const listing = this.getListingByWasteId(wasteId);
    if (!listing) throw new Error('Listing not found');

    const listingIndex = this.listings.findIndex((l) => l.wasteId === listing.wasteId);
    this.listings[listingIndex] = {
      ...listing,
      recyclerId: recycler.recyclerId,
      recyclerName: recycler.name,
      status: 'MATCHED',
      updatedAt: new Date().toISOString(),
    };

    await this.advanceLifecycle(
      wasteId,
      'MATCHED',
      {
        id: recycler.recyclerId,
        name: recycler.name,
        role: 'Verified Recycler Partner',
        location: recycler.location,
      },
      `Smart match pickup accepted by ${recycler.name}. Routing assigned.`
    );

    this.save();
  }

  public resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.alertId === alertId);
    if (alert) {
      alert.status = 'resolved';
      this.save();
    }
  }

  public resetToInitialSeed() {
    this.listings = JSON.parse(JSON.stringify(SEED_LISTINGS));
    this.lifecycleEvents = JSON.parse(JSON.stringify(SEED_LIFECYCLE_EVENTS));
    this.recyclers = JSON.parse(JSON.stringify(SEED_RECYCLERS));
    this.currentUser = JSON.parse(JSON.stringify(DEMO_USERS.business));
    this.save();
  }

  public getPlatformStats() {
    const totalListings = this.listings.length;
    let totalKg = 0;
    let recycledKg = 0;
    let divertedKg = 0;

    for (const l of this.listings) {
      const kg = l.unit === 'Tons' ? l.quantity * 1000 : l.quantity;
      totalKg += kg;
      if (l.status === 'RECYCLED' || l.status === 'REUSED') {
        recycledKg += kg;
        divertedKg += kg;
      } else if (l.status === 'COLLECTED' || l.status === 'TRANSPORTED' || l.status === 'RECEIVED' || l.status === 'PROCESSED') {
        divertedKg += kg;
      }
    }

    return {
      totalWasteKg: totalKg,
      recycledKg,
      divertedKg,
      listingsCount: totalListings,
      verifiedTransactions: this.lifecycleEvents.length,
      activeRecyclers: this.recyclers.length,
    };
  }
}

export const wasteStore = new WasteStore();
