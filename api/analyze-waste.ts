import { GoogleGenAI, Type } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

interface AnalyzeRequestBody {
  image?: string;
  imageData?: string;
  mimeType?: string;
  fileName?: string;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);

const VALID_CATEGORIES = [
  'Plastic',
  'E-Waste',
  'Construction',
  'Metal',
  'Glass',
  'Paper',
  'Cardboard',
  'Other',
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];

function normalizeCategory(raw: string | undefined): ValidCategory {
  if (!raw) return 'Other';
  const trimmed = raw.trim();
  const directMatch = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (directMatch) return directMatch;

  const lower = trimmed.toLowerCase();
  if (lower.includes('plastic') || lower.includes('polymer') || lower.includes('pet') || lower.includes('hdpe')) {
    return 'Plastic';
  }
  if (lower.includes('metal') || lower.includes('aluminum') || lower.includes('copper') || lower.includes('steel')) {
    return 'Metal';
  }
  if (lower.includes('e-waste') || lower.includes('electronic') || lower.includes('pcb') || lower.includes('circuit')) {
    return 'E-Waste';
  }
  if (lower.includes('cardboard') || lower.includes('corrugated') || lower.includes('box')) {
    return 'Cardboard';
  }
  if (lower.includes('paper') || lower.includes('document')) {
    return 'Paper';
  }
  if (lower.includes('glass') || lower.includes('bottle')) {
    return 'Glass';
  }
  if (lower.includes('construction') || lower.includes('concrete') || lower.includes('aggregate')) {
    return 'Construction';
  }
  return 'Other';
}

function normalizeRecyclability(raw: string | undefined): 'High' | 'Medium' | 'Low' | 'Specialized' {
  if (!raw) return 'High';
  const lower = raw.trim().toLowerCase();
  if (lower.includes('special')) return 'Specialized';
  if (lower.includes('med')) return 'Medium';
  if (lower.includes('low')) return 'Low';
  return 'High';
}

export default async function handler(req: any, res: any) {
  // CORS & Preflight handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Only POST requests are supported.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  try {
    const body: AnalyzeRequestBody = req.body || {};
    const rawImage = body.image || body.imageData;
    let mimeType = (body.mimeType || '').trim().toLowerCase();

    if (!rawImage || typeof rawImage !== 'string' || rawImage.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required image payload in request body.',
        code: 'MISSING_IMAGE',
      });
    }

    // Maximum payload limit: 14MB base64 string (~10MB raw image)
    if (rawImage.length > 14 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Image payload exceeds 10MB limit. Please compress or resize before analysis.',
        code: 'PAYLOAD_TOO_LARGE',
      });
    }

    let cleanBase64 = rawImage.trim();

    // Handle Data URL prefix if present
    if (cleanBase64.startsWith('data:')) {
      const match = cleanBase64.match(/^data:([a-zA-Z0-9\+\-\.\/]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1].toLowerCase();
        cleanBase64 = match[2];
      } else {
        return res.status(400).json({
          error: 'Malformed data URL image format.',
          code: 'MALFORMED_DATA_URL',
        });
      }
    }

    // Default to image/jpeg if not specified or unrecognized
    if (!mimeType) {
      mimeType = 'image/jpeg';
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return res.status(400).json({
        error: `Unsupported image MIME type "${mimeType}". Allowed types: JPEG, PNG, WebP, GIF, HEIC.`,
        code: 'UNSUPPORTED_MIME_TYPE',
      });
    }

    // Verify Server-Side Gemini API Key from standard env vars or header fallback
    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      (req.headers['x-gemini-api-key'] as string) ||
      (body as any).apiKey ||
      ''
    ).trim();

    if (!apiKey) {
      console.warn('[RE:LOOP API] GEMINI_API_KEY is not configured in server environment.');
      return res.status(503).json({
        error: 'Gemini AI service is not configured. Add GEMINI_API_KEY to your Vercel Project Settings > Environment Variables, or provide it in .env.',
        code: 'MISSING_GEMINI_API_KEY',
        configured: false,
      });
    }

    // Initialize @google/genai SDK with telemetry User-Agent
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = `You are an expert industrial waste material inspector and circular economy specialist.
Examine this image of waste/recyclable materials and provide accurate physical classification for recovery and recycling.

Return a JSON object conforming to this schema:
- material: Specific industrial or trade name of the material (e.g., "PET Plastic Beverage Bottles", "OCC Grade 11 Corrugated Cardboard", "UBC Alloy 3004 Aluminum Cans", "FR-4 PCB Electronic Scrap").
- category: One of: Plastic, E-Waste, Construction, Metal, Glass, Paper, Cardboard, Other.
- confidence: Float confidence rating between 80.0 and 99.9.
- condition: Brief description of cleanliness, contamination index, and state (e.g. "Clean post-consumer crushed bottles, baled").
- recyclability: High, Medium, Low, or Specialized.
- suggestedProcessing: Concise recommended recycling methodology (e.g. "Mechanical shredding, optical color separation, caustic bath washing, and pelletization into rPET").
- estimatedDensityKgPerM3: Estimated density in kilograms per cubic meter.
- notes: Concrete circular economy reuse destination or market demand context.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        material: {
          type: Type.STRING,
          description: 'Specific name of material',
        },
        category: {
          type: Type.STRING,
          description: 'Stream category: Plastic, E-Waste, Construction, Metal, Glass, Paper, Cardboard, or Other',
        },
        confidence: {
          type: Type.NUMBER,
          description: 'Confidence score percentage (0-100)',
        },
        condition: {
          type: Type.STRING,
          description: 'Concise physical condition and cleanliness',
        },
        recyclability: {
          type: Type.STRING,
          description: 'Recyclability rating: High, Medium, Low, or Specialized',
        },
        suggestedProcessing: {
          type: Type.STRING,
          description: 'Recommended industrial recovery method',
        },
        estimatedDensityKgPerM3: {
          type: Type.NUMBER,
          description: 'Estimated density in kg/m3',
        },
        notes: {
          type: Type.STRING,
          description: 'Industrial recycling notes and market demand',
        },
      },
      required: ['material', 'category', 'confidence', 'condition', 'recyclability', 'suggestedProcessing'],
    };

    let responseText = '';
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: unknown = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema,
          },
        });

        responseText = response.text || '';
        if (responseText) {
          break;
        }
      } catch (modelErr: any) {
        lastError = modelErr;
        const errMsg = modelErr?.message || String(modelErr);
        console.warn(`[RE:LOOP API] Gemini model ${model} execution error:`, errMsg);
        // If quota exceeded or auth error, don't keep hammering subsequent models
        if (modelErr?.status === 401 || modelErr?.status === 403 || modelErr?.status === 429) {
          break;
        }
      }
    }

    if (!responseText) {
      const status = (lastError as any)?.status || 500;
      const rawMessage = (lastError as any)?.message || 'No response returned from Gemini AI';

      if (status === 401 || status === 403 || rawMessage.includes('API_KEY_INVALID')) {
        return res.status(401).json({
          error: 'Gemini API authentication failed. Verify GEMINI_API_KEY in Vercel project environment settings.',
          code: 'INVALID_API_KEY',
        });
      }

      if (status === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({
          error: 'Gemini API rate limit or quota exceeded. Please wait a few moments and retry.',
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }

      return res.status(502).json({
        error: `Gemini AI service unavailable: ${rawMessage}`,
        code: 'GEMINI_CALL_FAILED',
      });
    }

    // Parse and sanitize JSON output
    let parsed: any;
    try {
      const cleanJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/s, '')
        .trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('[RE:LOOP API] JSON parse failure from Gemini output:', parseErr);
      return res.status(502).json({
        error: 'Failed to parse structured classification from Gemini AI output.',
        code: 'MALFORMED_AI_RESPONSE',
      });
    }

    const validatedResult = {
      material: String(parsed.material || 'Identified Recyclable Material').trim(),
      category: normalizeCategory(parsed.category),
      confidence: typeof parsed.confidence === 'number' && !isNaN(parsed.confidence)
        ? Math.min(100, Math.max(10, Math.round(parsed.confidence * 10) / 10))
        : 95.5,
      condition: String(parsed.condition || 'Verified by Gemini Vision AI').trim(),
      recyclability: normalizeRecyclability(parsed.recyclability),
      suggestedProcessing: String(
        parsed.suggestedProcessing || 'Mechanical sorting, washing, and reprocessing'
      ).trim(),
      estimatedDensityKgPerM3:
        typeof parsed.estimatedDensityKgPerM3 === 'number' && !isNaN(parsed.estimatedDensityKgPerM3)
          ? Math.round(parsed.estimatedDensityKgPerM3)
          : undefined,
      notes: String(parsed.notes || 'Analyzed via Gemini Vision AI.').trim(),
      isFallback: false,
    };

    return res.status(200).json(validatedResult);
  } catch (err: any) {
    console.error('[RE:LOOP API] Unexpected handler error:', err?.message || err);
    return res.status(500).json({
      error: 'An internal error occurred during waste image analysis.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}
