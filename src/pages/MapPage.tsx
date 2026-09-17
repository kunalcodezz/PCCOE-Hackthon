import React, { useState, useMemo, useCallback } from 'react';
import { Map as MapIcon } from 'lucide-react';
import {
  wasteSourcesData,
  recyclersData,
  industriesData,
  type MapMarkerData,
  type MapWasteSource,
  type MapRecycler,
  type MapIndustry,
} from '../data/mapData';
import { calculateDistanceKm } from '../services/matchingService';
import { MapSearch } from '../components/map/MapSearch';
import { MapFilters, type CategoryFilter } from '../components/map/MapFilters';
import { WasteMap } from '../components/map/WasteMap';
import { AIMatchPanel } from '../components/map/AIMatchPanel';
import { TraceabilityTimeline } from '../components/map/TraceabilityTimeline';

interface Props {
  navigate: (route: string) => void;
}

export const MapPage: React.FC<Props> = ({ navigate }) => {
  // ─── Filter & search state ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeWasteTypes, setActiveWasteTypes] = useState<string[]>([]);

  // ─── Map interaction state ──────────────────────────────────────────────
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [flyToCenter, setFlyToCenter] = useState<[number, number] | null>(null);
  const [flyToZoom, setFlyToZoom] = useState<number | undefined>(undefined);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // ─── Selection state ────────────────────────────────────────────────────
  const [selectedWaste, setSelectedWaste] = useState<MapWasteSource | null>(null);
  const [selectedRecycler, setSelectedRecycler] = useState<MapRecycler | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ─── Waste type toggle ──────────────────────────────────────────────────
  const handleWasteTypeToggle = useCallback((type: string) => {
    setActiveWasteTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  // ─── Filter markers ────────────────────────────────────────────────────
  const filteredMarkers: MapMarkerData[] = useMemo(() => {
    let all: MapMarkerData[] = [];

    // Category filter
    if (activeCategory === 'all' || activeCategory === 'waste') {
      all = [...all, ...wasteSourcesData];
    }
    if (activeCategory === 'all' || activeCategory === 'recycler') {
      all = [...all, ...recyclersData];
    }
    if (activeCategory === 'all' || activeCategory === 'industry') {
      all = [...all, ...industriesData];
    }

    // Waste type filter
    if (activeWasteTypes.length > 0) {
      all = all.filter((m) => {
        if (m.type === 'waste') {
          return activeWasteTypes.includes((m as MapWasteSource).wasteType);
        }
        if (m.type === 'recycler') {
          return (m as MapRecycler).materialsAccepted.some((mat) =>
            activeWasteTypes.includes(mat)
          );
        }
        if (m.type === 'industry') {
          // Match industry by checking if required material contains any active waste type keyword
          return activeWasteTypes.some((wt) =>
            (m as MapIndustry).requiredMaterial.toLowerCase().includes(wt.toLowerCase())
          );
        }
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      all = all.filter((m) => {
        const searchFields: string[] = [m.name.toLowerCase()];
        if (m.type === 'waste') {
          searchFields.push((m as MapWasteSource).wasteType.toLowerCase());
          searchFields.push((m as MapWasteSource).location.toLowerCase());
        }
        if (m.type === 'recycler') {
          searchFields.push(...(m as MapRecycler).materialsAccepted.map((x) => x.toLowerCase()));
          searchFields.push((m as MapRecycler).location.toLowerCase());
        }
        if (m.type === 'industry') {
          searchFields.push((m as MapIndustry).requiredMaterial.toLowerCase());
          searchFields.push((m as MapIndustry).location.toLowerCase());
        }
        return searchFields.some((f) => f.includes(q));
      });
    }

    return all;
  }, [activeCategory, activeWasteTypes, searchQuery]);

  // ─── Geolocation ───────────────────────────────────────────────────────
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setFlyToCenter(loc);
        setFlyToZoom(14);
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to retrieve your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ─── Marker interactions ───────────────────────────────────────────────
  const handleFindRecycler = useCallback((waste: MapWasteSource) => {
    setSelectedWaste(waste);
    setSelectedRecycler(null);
    setShowTimeline(false);
    setShowAIPanel(true);
    setFlyToCenter([waste.latitude, waste.longitude]);
    setFlyToZoom(13);
  }, []);

  const handleSelectRecycler = useCallback(
    (recycler: MapRecycler) => {
      setSelectedRecycler(recycler);
      setShowAIPanel(false);
      setShowTimeline(false);

      // Center the map to show both points
      if (selectedWaste) {
        const midLat = (selectedWaste.latitude + recycler.latitude) / 2;
        const midLng = (selectedWaste.longitude + recycler.longitude) / 2;
        setFlyToCenter([midLat, midLng]);
        setFlyToZoom(13);
      }
    },
    [selectedWaste]
  );

  const handleViewRecycler = useCallback((recycler: MapRecycler) => {
    setFlyToCenter([recycler.latitude, recycler.longitude]);
    setFlyToZoom(15);
  }, []);

  const handleViewIndustry = useCallback((industry: MapIndustry) => {
    setFlyToCenter([industry.latitude, industry.longitude]);
    setFlyToZoom(15);
  }, []);

  const handleCloseAIPanel = useCallback(() => {
    setShowAIPanel(false);
  }, []);

  const handleCloseTimeline = useCallback(() => {
    setShowTimeline(false);
  }, []);

  const handleShowTimeline = useCallback(() => {
    setShowTimeline(true);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedWaste(null);
    setSelectedRecycler(null);
    setShowAIPanel(false);
    setShowTimeline(false);
  }, []);

  // Computed distance for route summary
  const routeDistanceKm =
    selectedWaste && selectedRecycler
      ? calculateDistanceKm(
          { lat: selectedWaste.latitude, lng: selectedWaste.longitude },
          { lat: selectedRecycler.latitude, lng: selectedRecycler.longitude }
        )
      : 0;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E5EFE8] flex items-center justify-center">
            <MapIcon className="w-5 h-5 text-[#238B57]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#12372A]">Waste Management Map</h1>
            <p className="text-xs text-[#7D9187]">
              Connect waste generators with recyclers and industries
            </p>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden px-3 py-2 text-xs font-semibold font-mono bg-white border border-[#D9DDD5] rounded-xl hover:bg-[#F6F5EF] text-[#12372A] transition cursor-pointer"
        >
          {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Bar */}
      <MapSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Layout: Sidebar + Map + Panels */}
      <div className="flex gap-4 items-start">
        {/* Left Filters Sidebar — hidden on mobile unless toggled */}
        <div className={`w-52 shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
          <MapFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activeWasteTypes={activeWasteTypes}
            onWasteTypeToggle={handleWasteTypeToggle}
            onUseMyLocation={handleUseMyLocation}
            locationLoading={locationLoading}
            locationError={locationError}
          />
        </div>

        {/* Center Map */}
        <div className="flex-1 min-w-0">
          <div className="h-[calc(100vh-16rem)] min-h-[400px]">
            <WasteMap
              markers={filteredMarkers}
              userLocation={userLocation}
              flyToCenter={flyToCenter}
              flyToZoom={flyToZoom}
              selectedWaste={selectedWaste}
              selectedRecycler={selectedRecycler}
              onFindRecycler={handleFindRecycler}
              onViewRecycler={handleViewRecycler}
              onViewIndustry={handleViewIndustry}
            />
          </div>

          {/* Route info bar — shown when a recycler is selected */}
          {selectedWaste && selectedRecycler && (
            <div className="mt-3 bg-white rounded-xl border border-[#D9DDD5] shadow-xs px-4 py-3 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="font-semibold text-[#E67E22]">📍 {selectedWaste.name}</span>
                <span className="text-[#D9DDD5]">→</span>
                <span className="font-mono font-bold text-[#12372A]">{routeDistanceKm} km</span>
                <span className="text-[#D9DDD5]">→</span>
                <span className="font-semibold text-[#238B57]">♻️ {selectedRecycler.name}</span>
                <span className="text-[#7D9187]">
                  (~{Math.max(5, Math.round(routeDistanceKm * 5))} min)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShowTimeline}
                  className="px-3 py-1.5 text-[11px] font-bold font-mono bg-[#12372A] hover:bg-[#238B57] text-white rounded-lg transition cursor-pointer"
                >
                  Track Waste
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 text-[11px] font-mono text-[#7D9187] hover:text-[#C2413B] border border-[#D9DDD5] rounded-lg hover:bg-red-50 transition cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — AI Match or Traceability */}
        {(showAIPanel || showTimeline) && (
          <div className="w-80 shrink-0 hidden xl:block">
            {showAIPanel && selectedWaste && (
              <AIMatchPanel
                selectedWaste={selectedWaste}
                recyclers={recyclersData}
                onSelectRecycler={handleSelectRecycler}
                onClose={handleCloseAIPanel}
              />
            )}
            {showTimeline && selectedWaste && selectedRecycler && (
              <TraceabilityTimeline
                waste={selectedWaste}
                recycler={selectedRecycler}
                distanceKm={routeDistanceKm}
                onClose={handleCloseTimeline}
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile panels — shown below map on smaller screens */}
      <div className="xl:hidden space-y-4">
        {showAIPanel && selectedWaste && (
          <AIMatchPanel
            selectedWaste={selectedWaste}
            recyclers={recyclersData}
            onSelectRecycler={handleSelectRecycler}
            onClose={handleCloseAIPanel}
          />
        )}
        {showTimeline && selectedWaste && selectedRecycler && (
          <TraceabilityTimeline
            waste={selectedWaste}
            recycler={selectedRecycler}
            distanceKm={routeDistanceKm}
            onClose={handleCloseTimeline}
          />
        )}
      </div>
    </div>
  );
};
