/**
 * Smart Matching Engine
 *
 * Computes multi-factor match scores between waste listings and certified recyclers.
 * Factors: Material Compatibility (40%), Distance & Proximity (25%), Capacity Headroom (20%), Demand & Rating (15%).
 */

import { Coordinates, MatchScoreResult, Recycler, WasteCategory, WasteListing } from '../types';

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  if (!coord1 || !coord2) return 5.0; // fallback default
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Calculates match score between a waste listing and a recycler
 */
export function calculateMatchScore(listing: WasteListing, recycler: Recycler): MatchScoreResult {
  // 1. Material Compatibility (0 - 40 points)
  const acceptsCategory = recycler.materialsAccepted.includes(listing.category);
  const materialScore = acceptsCategory ? 40 : 5;

  // 2. Distance Score (0 - 25 points)
  // Closer is better. < 5km = 25pts, 10km = 20pts, 20km = 12pts, >40km = 5pts
  const distanceKm = calculateDistanceKm(listing.coordinates, recycler.coordinates);
  let distanceScore = 25;
  if (distanceKm > 40) {
    distanceScore = 5;
  } else if (distanceKm > 20) {
    distanceScore = 12;
  } else if (distanceKm > 10) {
    distanceScore = 18;
  } else if (distanceKm > 5) {
    distanceScore = 22;
  }

  // 3. Capacity Headroom Score (0 - 20 points)
  // Check if recycler can accommodate the requested quantity
  let capacityScore = 10;
  const listingQtyKg = listing.unit === 'Tons' ? listing.quantity * 1000 : listing.quantity;
  if (recycler.availableCapacity >= listingQtyKg * 2) {
    capacityScore = 20; // ample capacity
  } else if (recycler.availableCapacity >= listingQtyKg) {
    capacityScore = 16; // sufficient capacity
  } else {
    capacityScore = 4; // near capacity limit
  }

  // 4. Demand & Quality Bonus (0 - 15 points)
  let demandBonus = 0;
  if (recycler.demandHigh) demandBonus += 7;
  if (recycler.verified) demandBonus += 4;
  demandBonus += Math.min(4, Math.round((recycler.rating / 5) * 4));

  const totalScore = Math.min(99, Math.max(20, materialScore + distanceScore + capacityScore + demandBonus));

  return {
    recycler,
    score: totalScore,
    breakdown: {
      materialMatch: materialScore,
      distanceScore,
      capacityScore,
      demandBonus,
    },
    distanceKm,
  };
}

/**
 * Finds and ranks suitable recyclers for a waste listing
 */
export function findMatches(listing: WasteListing, recyclers: Recycler[]): MatchScoreResult[] {
  const scored = recyclers.map((r) => calculateMatchScore(listing, r));

  // Sort descending by match score, prioritizing recyclers that accept the material
  return scored.sort((a, b) => {
    const aAccepts = a.recycler.materialsAccepted.includes(listing.category);
    const bAccepts = b.recycler.materialsAccepted.includes(listing.category);
    if (aAccepts && !bAccepts) return -1;
    if (!aAccepts && bAccepts) return 1;
    return b.score - a.score;
  });
}
