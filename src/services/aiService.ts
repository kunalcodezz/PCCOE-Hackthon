import { AIAnalysisResult, WasteCategory } from '../types';

export const SAMPLE_WASTE_IMAGES = [
  {
    name: 'PET Plastic Bottles',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60',
    category: 'Plastic' as WasteCategory,
    material: 'PET Plastic (Polyethylene Terephthalate)',
    confidence: 96.4,
    condition: 'Clean, crushed beverage containers',
    recyclability: 'High' as const,
    suggestedProcessing: 'Flaking, hot washing, and mechanical pelletizing into rPET.',
    notes: 'Commonly recycled into textiles, polyester fiber, or new bottle-to-bottle preforms.',
  },
  {
    name: 'Obsolete Computer Motherboards & PCBs',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    category: 'E-Waste' as WasteCategory,
    material: 'FR-4 Printed Circuit Boards with Precious Metal Pins',
    confidence: 94.8,
    condition: 'Depleted electronics, non-corroded',
    recyclability: 'Specialized' as const,
    suggestedProcessing: 'Hydrometallurgical extraction and pyrometallurgical precious metal refining.',
    notes: 'Contains recoverable copper, tin, gold, and palladium. Requires certified e-waste recycler.',
  },
  {
    name: 'Corrugated Cardboard Packaging',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
    category: 'Cardboard' as WasteCategory,
    material: 'Unbleached Corrugated Cardboard (OCC)',
    confidence: 97.2,
    condition: 'Dry, flattened cartons, tape intact',
    recyclability: 'High' as const,
    suggestedProcessing: 'Hydropulping, de-inking screening, and paperboard sheet pressing.',
    notes: 'Can be re-pulped 5-7 times before fibers become too degraded.',
  },
  {
    name: 'Aluminum Cans & Scrap',
    url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=60',
    category: 'Metal' as WasteCategory,
    material: 'Alloy 3004 Aluminum Containers',
    confidence: 98.1,
    condition: 'Empty, rinsed beverage cans',
    recyclability: 'High' as const,
    suggestedProcessing: 'De-coating decoating, smelting at 660°C, and ingot casting.',
    notes: 'Infinite recyclability without degradation of tensile strength. 95% energy savings vs bauxite.',
  },
  {
    name: 'Concrete & Demolition Rubble',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=60',
    category: 'Construction' as WasteCategory,
    material: 'Crushed Concrete Aggregate & Masonry',
    confidence: 91.5,
    condition: 'Dry rubble, unreinforced',
    recyclability: 'Medium' as const,
    suggestedProcessing: 'Mobile jaw crushing, magnetic rebar separation, and vibrating sieve grading.',
    notes: 'Processed into sub-base for roadway infrastructure and non-structural backfill.',
  },
  {
    name: 'Clear Amber & Flint Glass Bottles',
    url: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=60',
    category: 'Glass' as WasteCategory,
    material: 'Soda-Lime Glass Cullet',
    confidence: 95.0,
    condition: 'Intact bottles, labels present',
    recyclability: 'High' as const,
    suggestedProcessing: 'Optical color sorting, crushing into cullet, and furnace re-melting.',
    notes: 'Cullet melts at lower temperature than raw silica sand, significantly lowering carbon emissions.',
  },
];

/**
 * API Key helpers maintained for compatibility.
 * Checks localStorage and import.meta.env, allowing optional client-provided key
 * forwarded securely to the /api/analyze-waste server endpoint if server env is unconfigured.
 */
export function getGeminiApiKey(): string {
  const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env || {};
  return (
    localStorage.getItem('VITE_GEMINI_API_KEY') ||
    localStorage.getItem('GEMINI_API_KEY') ||
    metaEnv.VITE_GEMINI_API_KEY ||
    metaEnv.GEMINI_API_KEY ||
    ''
  ).trim();
}

export function setGeminiApiKey(key: string): void {
  const trimmed = key.trim();
  if (trimmed) {
    localStorage.setItem('GEMINI_API_KEY', trimmed);
    localStorage.setItem('VITE_GEMINI_API_KEY', trimmed);
  } else {
    localStorage.removeItem('GEMINI_API_KEY');
    localStorage.removeItem('VITE_GEMINI_API_KEY');
  }
}

/**
 * Normalizes input image (data URL, blob URL, or remote URL) into base64 payload and MIME type
 */
async function prepareImagePayload(
  imageDataOrUrl: string
): Promise<{ base64: string; mimeType: string }> {
  // 1. Data URL
  if (imageDataOrUrl.startsWith('data:')) {
    const match = imageDataOrUrl.match(/^data:([a-zA-Z0-9\+\-\.\/]+);base64,(.+)$/);
    if (match) {
      return {
        mimeType: match[1],
        base64: match[2],
      };
    }
  }

  // 2. Remote URL or Blob URL
  if (imageDataOrUrl.startsWith('http') || imageDataOrUrl.startsWith('blob:')) {
    const response = await fetch(imageDataOrUrl);
    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return {
      mimeType,
      base64,
    };
  }

  // 3. Assume raw base64 string
  return {
    mimeType: 'image/jpeg',
    base64: imageDataOrUrl,
  };
}

/**
 * Analyzes waste image by querying the secure server-side /api/analyze-waste endpoint.
 * Does NOT call Gemini directly from browser client code.
 */
export async function analyzeWasteImage(
  imageDataOrUrl: string,
  fileName?: string
): Promise<AIAnalysisResult> {
  let serverErrorMessage = '';

  try {
    const { base64, mimeType } = await prepareImagePayload(imageDataOrUrl);
    const clientKey = getGeminiApiKey();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (clientKey) {
      headers['x-gemini-api-key'] = clientKey;
    }

    const response = await fetch('/api/analyze-waste', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image: base64,
        mimeType,
        fileName,
        ...(clientKey ? { apiKey: clientKey } : {}),
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as AIAnalysisResult;
      return {
        ...data,
        isFallback: false,
      };
    }

    const errorJson = await response.json().catch(() => ({}));
    serverErrorMessage = errorJson.error || `Server responded with status ${response.status}`;
    console.warn('[RE:LOOP AI] Server AI endpoint returned non-OK status:', response.status, errorJson);
  } catch (networkErr: any) {
    serverErrorMessage = networkErr?.message || 'Network connection to AI endpoint failed';
    console.warn('[RE:LOOP AI] Request to /api/analyze-waste failed:', networkErr);
  }

  // When the server endpoint is unavailable (e.g. GEMINI_API_KEY missing in server env or network offline),
  // return an explicit fallback result with isFallback: true so the user can continue listing while
  // remaining fully transparent about the fallback nature.
  return fallbackWasteAnalysis(imageDataOrUrl, fileName, serverErrorMessage);
}

/**
 * Explicit deterministic fallback classifier used when Gemini AI server is unconfigured or unreachable.
 * Clearly marked with isFallback: true.
 */
function fallbackWasteAnalysis(
  imageDataOrUrl: string,
  fileName?: string,
  serverReason?: string
): AIAnalysisResult {
  const lowerName = (fileName || '').toLowerCase();
  const lowerUrl = (imageDataOrUrl || '').toLowerCase();

  const noticeSuffix = serverReason
    ? `\n[Notice: Local heuristic fallback active — ${serverReason}]`
    : '\n[Notice: Local heuristic fallback active — Gemini API key not configured on server]';

  if (
    lowerName.includes('plastic') ||
    lowerName.includes('bottle') ||
    lowerName.includes('pet') ||
    lowerUrl.includes('photo-1530587191325')
  ) {
    return {
      material: 'PET Plastic (Polyethylene Terephthalate)',
      category: 'Plastic',
      confidence: 88.5,
      condition: 'Clean post-consumer beverage containers (Local Pattern Match)',
      recyclability: 'High',
      suggestedProcessing: 'Mechanical granulation, caustic bath cleaning, drying, and extruding into rPET pellets.',
      estimatedDensityKgPerM3: 35,
      notes: `Matched known PET container pattern.${noticeSuffix}`,
      isFallback: true,
    };
  }

  if (
    lowerName.includes('circuit') ||
    lowerName.includes('pcb') ||
    lowerName.includes('ewaste') ||
    lowerName.includes('motherboard') ||
    lowerUrl.includes('4636190af475')
  ) {
    return {
      material: 'E-Waste: Printed Circuit Boards (PCB)',
      category: 'E-Waste',
      confidence: 87.0,
      condition: 'Depleted electronics with soldered pin arrays (Local Pattern Match)',
      recyclability: 'Specialized',
      suggestedProcessing: 'Component desoldering, mechanical shredding, and hydrometallurgical precious metal recovery.',
      estimatedDensityKgPerM3: 180,
      notes: `Matched electronic circuit board profile.${noticeSuffix}`,
      isFallback: true,
    };
  }

  if (
    lowerName.includes('cardboard') ||
    lowerName.includes('box') ||
    lowerName.includes('carton') ||
    lowerUrl.includes('5185137a7f0f')
  ) {
    return {
      material: 'Corrugated Cardboard (Grade OCC-11)',
      category: 'Cardboard',
      confidence: 89.0,
      condition: 'Dry, unbleached flattened packaging cartons (Local Pattern Match)',
      recyclability: 'High',
      suggestedProcessing: 'Centrifugal hydropulping, contaminant screening, and sheet pressing.',
      estimatedDensityKgPerM3: 110,
      notes: `Matched OCC corrugated packaging profile.${noticeSuffix}`,
      isFallback: true,
    };
  }

  if (
    lowerName.includes('can') ||
    lowerName.includes('aluminum') ||
    lowerName.includes('metal') ||
    lowerUrl.includes('28f0efdc88ce')
  ) {
    return {
      material: 'UBC Aluminum (Used Beverage Cans)',
      category: 'Metal',
      confidence: 91.0,
      condition: 'Rinsed non-ferrous beverage cans (Local Pattern Match)',
      recyclability: 'High',
      suggestedProcessing: 'Thermal decoating, magnetic ferrous separation, and induction smelting into rolling ingots.',
      estimatedDensityKgPerM3: 85,
      notes: `Matched UBC aluminum scrap profile.${noticeSuffix}`,
      isFallback: true,
    };
  }

  if (
    lowerName.includes('concrete') ||
    lowerName.includes('rubble') ||
    lowerName.includes('brick') ||
    lowerUrl.includes('d0fbb186c5f7')
  ) {
    return {
      material: 'Recycled Concrete Aggregate (RCA)',
      category: 'Construction',
      confidence: 85.0,
      condition: 'Unreinforced stone and masonry rubble (Local Pattern Match)',
      recyclability: 'Medium',
      suggestedProcessing: 'Mobile jaw crushing, magnetic rebar separation, and multi-deck screening into 10-20mm aggregate.',
      estimatedDensityKgPerM3: 1350,
      notes: `Matched concrete demolition aggregate profile.${noticeSuffix}`,
      isFallback: true,
    };
  }

  if (lowerName.includes('glass') || lowerUrl.includes('e65505dbb29d')) {
    return {
      material: 'Flint and Amber Soda-Lime Glass',
      category: 'Glass',
      confidence: 88.0,
      condition: 'Clean glass cullet containers (Local Pattern Match)',
      recyclability: 'High',
      suggestedProcessing: 'Optical color sorting, hammer milling into 12mm cullet, magnetic cap extraction, and furnace re-melting.',
      estimatedDensityKgPerM3: 350,
      notes: `Matched soda-lime container glass profile.${noticeSuffix}`,
      isFallback: true,
    };
  }

  // Deterministic fallback based on input hash
  let seed = 0;
  const str = (imageDataOrUrl || '') + (fileName || '');
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) % 1000;
  }

  const fallbackVariants: AIAnalysisResult[] = [
    {
      material: 'Mixed High-Density Polyethylene (HDPE) Containers',
      category: 'Plastic',
      confidence: 86.5,
      condition: 'Post-consumer rigid plastic bottles',
      recyclability: 'High',
      suggestedProcessing: 'Granulation, friction wash, thermal drying, and extrusion into recycled HDPE pellets.',
      estimatedDensityKgPerM3: 50,
      notes: `Heuristic assessment.${noticeSuffix}`,
      isFallback: true,
    },
    {
      material: 'Industrial Corrugated Cardboard (OCC)',
      category: 'Cardboard',
      confidence: 87.2,
      condition: 'Dry, unbleached fiber cartons',
      recyclability: 'High',
      suggestedProcessing: 'Hydropulping, de-inking, and paperboard sheet pressing.',
      estimatedDensityKgPerM3: 120,
      notes: `Heuristic assessment.${noticeSuffix}`,
      isFallback: true,
    },
    {
      material: 'Scrap Aluminum Beverage Cans & Foils',
      category: 'Metal',
      confidence: 89.4,
      condition: 'Used non-ferrous beverage cans',
      recyclability: 'High',
      suggestedProcessing: 'Decoating, induction smelting, and ingot casting.',
      estimatedDensityKgPerM3: 90,
      notes: `Heuristic assessment.${noticeSuffix}`,
      isFallback: true,
    },
    {
      material: 'E-Waste Printed Circuit Board Scrap',
      category: 'E-Waste',
      confidence: 85.0,
      condition: 'Depleted electronics & PCBs',
      recyclability: 'Specialized',
      suggestedProcessing: 'Mechanical dismantling and hydrometallurgical metal recovery.',
      estimatedDensityKgPerM3: 210,
      notes: `Heuristic assessment.${noticeSuffix}`,
      isFallback: true,
    },
    {
      material: 'Soda-Lime Container Cullet Glass',
      category: 'Glass',
      confidence: 86.0,
      condition: 'Clean sorted cullet containers',
      recyclability: 'High',
      suggestedProcessing: 'Optical color sorting, milling, and furnace re-melting.',
      estimatedDensityKgPerM3: 380,
      notes: `Heuristic assessment.${noticeSuffix}`,
      isFallback: true,
    },
  ];

  return fallbackVariants[seed % fallbackVariants.length];
}
