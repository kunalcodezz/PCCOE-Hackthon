/**
 * RE:LOOP Gemini AI Service
 * Exports the analysis methods and sample data, querying the server-side /api/analyze-waste endpoint.
 */
export * from './aiService';
export { analyzeWasteImage, SAMPLE_WASTE_IMAGES, getGeminiApiKey, setGeminiApiKey } from './aiService';
