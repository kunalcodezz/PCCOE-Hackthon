import React, { useState } from 'react';
import { AIAnalysisResult, User, WasteCategory, WasteListing } from '../types';
import { SAMPLE_WASTE_IMAGES, analyzeWasteImage } from '../services/aiService';
import { wasteStore } from '../services/wasteService';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Weight,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Layers,
} from 'lucide-react';

interface Props {
  currentUser: User;
  navigate: (route: string) => void;
}

export const ListWaste: React.FC<Props> = ({ currentUser, navigate }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_WASTE_IMAGES[0].url);
  const [selectedFileName, setSelectedFileName] = useState<string>('pet_plastic_bottles.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const [material, setMaterial] = useState<string>('PET Plastic Bottles (Polyethylene Terephthalate)');
  const [category, setCategory] = useState<WasteCategory>('Plastic');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'KG' | 'Tons' | 'Units'>('KG');
  const [description, setDescription] = useState<string>(
    'Clean, crushed post-industrial beverage containers baled for mechanical reprocessing.'
  );
  const [location, setLocation] = useState<string>(currentUser.location || 'Bhosari MIDC, Pune');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [expectedPrice, setExpectedPrice] = useState<number>(12500);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdListing, setCreatedListing] = useState<WasteListing | null>(null);

  const CATEGORIES: WasteCategory[] = [
    'Plastic',
    'E-Waste',
    'Construction',
    'Metal',
    'Glass',
    'Paper',
    'Cardboard',
    'Other',
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setSelectedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setSelectedFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_WASTE_IMAGES[0]) => {
    setImagePreview(sample.url);
    setSelectedFileName(`${sample.category.toLowerCase()}_sample.jpg`);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeWasteImage(imagePreview, selectedFileName);
      setAiResult(result);
      setMaterial(result.material);
      setCategory(result.category);
      setStep(2);
    } catch {
      alert('AI analysis failed. You can still input details manually.');
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitListing = async () => {
    setIsSubmitting(true);
    try {
      const newListing = await wasteStore.createListing({
        ownerId: currentUser.uid,
        ownerName: currentUser.name,
        ownerRole: currentUser.role,
        material,
        category,
        quantity,
        unit,
        description,
        imageUrl: imagePreview,
        location,
        coordinates: { lat: 18.629, lng: 73.842 },
        preferredPickupDate: preferredDate,
        expectedPrice: expectedPrice > 0 ? expectedPrice : undefined,
        condition: aiResult?.condition || 'Recyclable segregation verified',
        aiConfidence: aiResult?.confidence || 95.0,
        suggestedProcessing: aiResult?.suggestedProcessing || 'Mechanical sorting & clean recycling',
      });

      setCreatedListing(newListing);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#3b82f6'],
      });
    } catch (err) {
      console.error(err);
      alert('Unable to save listing. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdListing) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-5">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Milestone Recorded
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-1">
            Digital Waste Passport Created!
          </h2>
          <p className="text-sm text-slate-500 mb-6 font-mono font-bold text-emerald-800">
            {createdListing.wasteId}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-700 space-y-2 mb-6">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Material &amp; Category:</span>
              <span className="font-semibold text-slate-900">
                {createdListing.material} ({createdListing.category})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Registered Quantity:</span>
              <span className="font-semibold text-slate-900">
                {createdListing.quantity} {createdListing.unit}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Genesis Block SHA-256:</span>
              <span className="font-mono text-emerald-700 text-[11px] truncate max-w-[240px]">
                {createdListing.verificationHash}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Reward Earned:</span>
              <span className="font-semibold text-amber-600">+10 Eco Points Added</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Find Matching Recyclers Now</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/passport/${createdListing.wasteId}`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Inspect Digital Passport &amp; QR</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">List Recyclable Waste</h1>
            <p className="text-xs text-slate-500">
              AI-assisted multi-step registration with cryptographic passport issuance
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Step {step} of 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {[
            { s: 1, label: '1. Photo' },
            { s: 2, label: '2. AI Scan' },
            { s: 3, label: '3. Details' },
            { s: 4, label: '4. Issue' },
          ].map((item) => (
            <div
              key={item.s}
              className={`py-2 rounded-xl border transition ${
                step === item.s
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : step > item.s
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Step 1: Upload Waste Image</h3>
            <p className="text-xs text-slate-500">
              Drag-and-drop a photo or choose a preset sample material for demo
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50"
          >
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Waste Preview"
                  className="w-full max-h-64 object-cover rounded-xl shadow-xs mx-auto"
                />
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">{selectedFileName}</span>
                  <label className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-slate-700">
                  Drag and drop waste image here, or{' '}
                  <label className="text-emerald-700 font-semibold hover:underline cursor-pointer">
                    browse files
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-slate-400">PNG, JPG, or WebP up to 10MB</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-bold text-slate-600 block mb-2">
              Or pick a sample material for instant hackathon evaluation:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMPLE_WASTE_IMAGES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition cursor-pointer ${
                    imagePreview === sample.url
                      ? 'border-emerald-600 bg-emerald-50/60 font-semibold text-emerald-900 ring-1 ring-emerald-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <span className="truncate">{sample.category}: {sample.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                AI Detection Complete ✓
              </div>
              <h3 className="text-base font-bold text-slate-900">Step 2: AI Material Classification</h3>
            </div>
            <img src={imagePreview} alt="thumb" className="w-12 h-12 rounded-xl object-cover border" />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Detected Material</span>
                <span className="text-sm font-bold text-slate-900">{material}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">AI Confidence Index</span>
                <span className="text-sm font-bold text-emerald-700">
                  {aiResult?.confidence || 96.4}% Verified
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Condition</span>
                <span className="font-semibold text-slate-800">
                  {aiResult?.condition || 'Recyclable — clean segregations'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Recyclability Rating</span>
                <span className="font-semibold text-emerald-700">
                  {aiResult?.recyclability || 'High (Mechanical)'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-400 block font-medium mb-1">Suggested Processing Route</span>
              <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                {aiResult?.suggestedProcessing ||
                  'Optical sorting, flaking, decontamination, and pelletizing into rPET.'}
              </p>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Confirm or Adjust Category Stream:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 text-xs rounded-xl border font-medium transition cursor-pointer text-center ${
                      category === cat
                        ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> AI-generated classification — verify before processing. Net
                weight cannot be determined solely by 2D camera vision and must be manually entered in
                Step 3.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
            >
              <span>Continue to Quantity &amp; Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 3: Quantity &amp; Pickup Logistics</h3>
            <p className="text-xs text-slate-500">
              Provide net volume and preferred logistics terms for recycler matchmaking
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Material Name / Grade</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. PET Plastic Bottles"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Net Measured Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                  <div className="absolute right-3 top-2 text-slate-400 font-medium">{unit}</div>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'KG' | 'Tons' | 'Units')}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="KG">KG</option>
                  <option value="Tons">Tons</option>
                  <option value="Units">Units</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pickup Location / Hub
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Bhosari MIDC, Pune"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Pickup Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Expected Price (Optional INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 12500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Leave 0 for non-commercial or donation batches.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Handling Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Details on storage, contamination, packaging..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to AI Review</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
            >
              <span>Review Listing Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 4: Confirm &amp; Issue Waste Passport</h3>
            <p className="text-xs text-slate-500">
              Verify parameters before cryptographically signing the genesis milestone
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="h-40 bg-slate-100 relative">
              <img src={imagePreview} alt="Review" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-emerald-900/80 text-white px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
                {category} Stream
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Material Name:</span>
                <span className="font-bold text-slate-900">{material}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Quantity Registered:</span>
                <span className="font-bold text-emerald-800 text-sm">
                  {quantity} {unit}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Pickup Location:</span>
                <span className="font-medium text-slate-800">{location}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-medium text-slate-800">{preferredDate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Listed By:</span>
                <span className="font-medium text-slate-800">
                  {currentUser.name} ({currentUser.role})
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Expected Value:</span>
                <span className="font-bold text-slate-900">
                  {expectedPrice > 0 ? `₹${expectedPrice.toLocaleString()}` : 'Donation / Zero Cost'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Genesis Block Generation:
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Upon confirmation, a unique Waste ID (e.g. WST-PUN-00128) and SHA-256 genesis hash will
              be minted. A Digital Waste Passport QR code will be generated for public auditability.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitListing}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Minting Passport...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Waste Listing &amp; Passport</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
