
import type { WasteCategory } from '../types';


export interface MapWasteSource {
  id: string;
  type: 'waste';
  name: string;
  wasteType: WasteCategory;
  quantity: number;
  unit: string;
  latitude: number;
  longitude: number;
  location: string;
  status: 'Available' | 'Scheduled' | 'Collected';
}

export interface MapRecycler {
  id: string;
  type: 'recycler';
  name: string;
  materialsAccepted: WasteCategory[];
  processingCapacity: number;
  capacityUnit: string;
  rating: number;
  latitude: number;
  longitude: number;
  location: string;
  verified: boolean;
}

export interface MapIndustry {
  id: string;
  type: 'industry';
  name: string;
  requiredMaterial: string;
  requiredQuantity: number;
  quantityUnit: string;
  latitude: number;
  longitude: number;
  location: string;
}

export type MapMarkerData = MapWasteSource | MapRecycler | MapIndustry;


export const wasteSourcesData: MapWasteSource[] = [
  {
    id: 'waste-001',
    type: 'waste',
    name: 'Kothrud Community Collection',
    wasteType: 'Plastic',
    quantity: 120,
    unit: 'kg',
    latitude: 18.5074,
    longitude: 73.8077,
    location: 'Kothrud, Pune',
    status: 'Available',
  },
  {
    id: 'waste-002',
    type: 'waste',
    name: 'Hinjewadi IT Park E-Waste',
    wasteType: 'E-Waste',
    quantity: 85,
    unit: 'kg',
    latitude: 18.5912,
    longitude: 73.7390,
    location: 'Hinjewadi, Pune',
    status: 'Available',
  },
  {
    id: 'waste-003',
    type: 'waste',
    name: 'Baner Construction Site',
    wasteType: 'Construction',
    quantity: 2.5,
    unit: 'tons',
    latitude: 18.5590,
    longitude: 73.7868,
    location: 'Baner, Pune',
    status: 'Available',
  },
  {
    id: 'waste-004',
    type: 'waste',
    name: 'Deccan Gymkhana Paper Drive',
    wasteType: 'Paper',
    quantity: 200,
    unit: 'kg',
    latitude: 18.5165,
    longitude: 73.8410,
    location: 'Deccan, Pune',
    status: 'Scheduled',
  },
  {
    id: 'waste-005',
    type: 'waste',
    name: 'Hadapsar Industrial Metal Scrap',
    wasteType: 'Metal',
    quantity: 340,
    unit: 'kg',
    latitude: 18.5089,
    longitude: 73.9260,
    location: 'Hadapsar, Pune',
    status: 'Available',
  },
  {
    id: 'waste-006',
    type: 'waste',
    name: 'Aundh Glass Collection',
    wasteType: 'Glass',
    quantity: 90,
    unit: 'kg',
    latitude: 18.5580,
    longitude: 73.8077,
    location: 'Aundh, Pune',
    status: 'Available',
  },
];


export const recyclersData: MapRecycler[] = [
  {
    id: 'recycler-001',
    type: 'recycler',
    name: 'GreenCycle Recyclers',
    materialsAccepted: ['Plastic', 'Paper'],
    processingCapacity: 500,
    capacityUnit: 'kg/day',
    rating: 4.8,
    latitude: 18.5200,
    longitude: 73.8200,
    location: 'Shivajinagar, Pune',
    verified: true,
  },
  {
    id: 'recycler-002',
    type: 'recycler',
    name: 'EcoTech E-Waste Solutions',
    materialsAccepted: ['E-Waste', 'Metal'],
    processingCapacity: 300,
    capacityUnit: 'kg/day',
    rating: 4.6,
    latitude: 18.5700,
    longitude: 73.7600,
    location: 'Wakad, Pune',
    verified: true,
  },
  {
    id: 'recycler-003',
    type: 'recycler',
    name: 'BuildGreen Materials',
    materialsAccepted: ['Construction', 'Metal'],
    processingCapacity: 5000,
    capacityUnit: 'kg/day',
    rating: 4.3,
    latitude: 18.5400,
    longitude: 73.7950,
    location: 'Pashan, Pune',
    verified: true,
  },
  {
    id: 'recycler-004',
    type: 'recycler',
    name: 'PaperLoop Industries',
    materialsAccepted: ['Paper', 'Cardboard'],
    processingCapacity: 800,
    capacityUnit: 'kg/day',
    rating: 4.5,
    latitude: 18.4950,
    longitude: 73.8650,
    location: 'Swargate, Pune',
    verified: false,
  },
  {
    id: 'recycler-005',
    type: 'recycler',
    name: 'MetalWorks Recycling',
    materialsAccepted: ['Metal', 'E-Waste'],
    processingCapacity: 1200,
    capacityUnit: 'kg/day',
    rating: 4.7,
    latitude: 18.5300,
    longitude: 73.9100,
    location: 'Kharadi, Pune',
    verified: true,
  },
  {
    id: 'recycler-006',
    type: 'recycler',
    name: 'ClearGlass Pune',
    materialsAccepted: ['Glass'],
    processingCapacity: 400,
    capacityUnit: 'kg/day',
    rating: 4.2,
    latitude: 18.5450,
    longitude: 73.8250,
    location: 'Model Colony, Pune',
    verified: true,
  },
];


export const industriesData: MapIndustry[] = [
  {
    id: 'industry-001',
    type: 'industry',
    name: 'ABC Manufacturing',
    requiredMaterial: 'Recycled Plastic',
    requiredQuantity: 500,
    quantityUnit: 'kg/month',
    latitude: 18.4800,
    longitude: 73.8550,
    location: 'Katraj, Pune',
  },
  {
    id: 'industry-002',
    type: 'industry',
    name: 'Pune Paper Mills',
    requiredMaterial: 'Recycled Paper',
    requiredQuantity: 2000,
    quantityUnit: 'kg/month',
    latitude: 18.4700,
    longitude: 73.8900,
    location: 'Kondhwa, Pune',
  },
  {
    id: 'industry-003',
    type: 'industry',
    name: 'TechMetal Foundry',
    requiredMaterial: 'Scrap Metal',
    requiredQuantity: 1500,
    quantityUnit: 'kg/month',
    latitude: 18.5600,
    longitude: 73.9300,
    location: 'Viman Nagar, Pune',
  },
  {
    id: 'industry-004',
    type: 'industry',
    name: 'GlassCraft Studio',
    requiredMaterial: 'Recycled Glass',
    requiredQuantity: 300,
    quantityUnit: 'kg/month',
    latitude: 18.5350,
    longitude: 73.7700,
    location: 'Bavdhan, Pune',
  },
];


export function getAllMapMarkers(): MapMarkerData[] {
  return [
    ...wasteSourcesData,
    ...recyclersData,
    ...industriesData,
  ];
}
