
import { Coordinates, MatchScoreResult, Recycler, WasteCategory, WasteListing } from '../types';

export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  if (!coord1 || !coord2) return 5.0;
  const R = 6371;
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

export function calculateMatchScore(listing: WasteListing, recycler: Recycler): MatchScoreResult {
  const acceptsCategory = recycler.materialsAccepted.includes(listing.category);
  const materialScore = acceptsCategory ? 40 : 5;

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

  let capacityScore = 10;
  const listingQtyKg = listing.unit === 'Tons' ? listing.quantity * 1000 : listing.quantity;
  if (recycler.availableCapacity >= listingQtyKg * 2) {
    capacityScore = 20;
  } else if (recycler.availableCapacity >= listingQtyKg) {
    capacityScore = 16;
  } else {
    capacityScore = 4;
  }

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

export function findMatches(listing: WasteListing, recyclers: Recycler[]): MatchScoreResult[] {
  const scored = recyclers.map((r) => calculateMatchScore(listing, r));

  return scored.sort((a, b) => {
    const aAccepts = a.recycler.materialsAccepted.includes(listing.category);
    const bAccepts = b.recycler.materialsAccepted.includes(listing.category);
    if (aAccepts && !bAccepts) return -1;
    if (!aAccepts && bAccepts) return 1;
    return b.score - a.score;
  });
}
