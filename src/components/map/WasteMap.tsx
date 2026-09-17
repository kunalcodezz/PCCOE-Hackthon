import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapMarkerData, MapWasteSource, MapRecycler, MapIndustry } from '../../data/mapData';
import { LocationPopup } from './LocationPopup';

// ─── Fix Leaflet default icon issue ─────────────────────────────────────────
// Leaflet's default icon references broken image paths in bundled builds.
// We use custom divIcon SVG markers instead.

function createSvgIcon(color: string, symbol: string, size = 32): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="${color}" stroke="white" stroke-width="1.5"/>
        <text x="16" y="15" text-anchor="middle" font-size="11" fill="white" font-weight="bold" dy=".35em">${symbol}</text>
      </svg>
    `,
  });
}

const wasteIcon = createSvgIcon('#E67E22', 'W');
const recyclerIcon = createSvgIcon('#238B57', 'R');
const industryIcon = createSvgIcon('#3B82F6', 'I');

const userLocationIcon = L.divIcon({
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#3B82F6;opacity:0.25;animation:pulse-ring 1.5s infinite;"></div>
      <div style="position:absolute;top:4px;left:4px;width:12px;height:12px;border-radius:50%;background:#3B82F6;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.3; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `,
});

function getIconForType(type: string): L.DivIcon {
  switch (type) {
    case 'waste': return wasteIcon;
    case 'recycler': return recyclerIcon;
    case 'industry': return industryIcon;
    default: return wasteIcon;
  }
}

// ─── Map controller that responds to center/zoom changes ────────────────────

interface MapControllerProps {
  center: [number, number] | null;
  zoom?: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// ─── Main WasteMap Component ────────────────────────────────────────────────

interface Props {
  markers: MapMarkerData[];
  userLocation: [number, number] | null;
  flyToCenter: [number, number] | null;
  flyToZoom?: number;
  selectedWaste: MapWasteSource | null;
  selectedRecycler: MapRecycler | null;
  onFindRecycler: (waste: MapWasteSource) => void;
  onViewRecycler: (recycler: MapRecycler) => void;
  onViewIndustry: (industry: MapIndustry) => void;
}

// Pune center coordinates
const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567];
const DEFAULT_ZOOM = 12;

export const WasteMap: React.FC<Props> = ({
  markers,
  userLocation,
  flyToCenter,
  flyToZoom,
  selectedWaste,
  selectedRecycler,
  onFindRecycler,
  onViewRecycler,
  onViewIndustry,
}) => {
  // Route polyline between waste source and selected recycler
  const routePositions: [number, number][] | null =
    selectedWaste && selectedRecycler
      ? [
          [selectedWaste.latitude, selectedWaste.longitude],
          [selectedRecycler.latitude, selectedRecycler.longitude],
        ]
      : null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[#D9DDD5] shadow-xs">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fly-to controller */}
        <MapController center={flyToCenter} zoom={flyToZoom} />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="text-xs font-semibold text-[#3B82F6] font-sans">
                📍 Your Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Data markers */}
        {markers.map((marker) => {
          const position: [number, number] = [marker.latitude, marker.longitude];
          return (
            <Marker key={marker.id} position={position} icon={getIconForType(marker.type)}>
              <Popup maxWidth={280} className="custom-leaflet-popup">
                <LocationPopup
                  marker={marker}
                  onFindRecycler={onFindRecycler}
                  onViewRecycler={onViewRecycler}
                  onViewIndustry={onViewIndustry}
                />
              </Popup>
            </Marker>
          );
        })}

        {/* Route polyline */}
        {routePositions && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#238B57',
              weight: 4,
              opacity: 0.8,
              dashArray: '12, 8',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
