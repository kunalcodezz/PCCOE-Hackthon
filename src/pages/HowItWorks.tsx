import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Lock,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Truck,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Building2,
  Factory,
  Cpu,
  Scan,
  Activity,
  Check,
  AlertTriangle,
  Sliders,
  Database,
  Navigation,
  Scale,
  ArrowUpRight,
  Zap,
  ChevronRight,
  Info,
  ShieldAlert,
  MapPin,
  RotateCcw,
  UserCheck,
  FileCheck,
  Globe,
} from 'lucide-react';

interface Props {
  navigate: (route: string) => void;
}

interface MaterialStream {
  id: string;
  name: string;
  icon: string;
  code: string;
  origin: string;
  destination: string;
  outputGrade: string;
  recoveryRate: string;
  cycleTime: string;
  stages: {
    sources: string[];
    collection: string;
    recyclers: string;
    processing: string;
    manufacturers: string;
  };
}

const MATERIAL_STREAMS: MaterialStream[] = [
  {
    id: 'plastic',
    name: 'PLASTIC',
    icon: '♳',
    code: 'POLYMER #1-#7',
    origin: 'Packaging & FMCG Fabricators',
    destination: 'Circular Preform Injection',
    outputGrade: 'Food-Grade rPET / HDPE Flakes',
    recoveryRate: '94.2%',
    cycleTime: '36 Hours',
    stages: {
      sources: ['Commercial Retailers', 'Industrial Packaging', 'Urban Households'],
      collection: 'Smart Logistics Hub Alpha (Pune West)',
      recyclers: 'GreenLoop Mechanical Cleansing Corp',
      processing: 'Hot Wash & Decontamination Extrusion',
      manufacturers: 'Circular Preform Packaging Ltd',
    },
  },
  {
    id: 'e-waste',
    name: 'E-WASTE',
    icon: '🔌',
    code: 'WEEE CAT 1-5',
    origin: 'IT Parks & Consumer Tech Returns',
    destination: 'Hydrometallurgical Refining',
    outputGrade: 'Precious & Critical Rare Metals',
    recoveryRate: '91.8%',
    cycleTime: '72 Hours',
    stages: {
      sources: ['Enterprise Tech Parks', 'Data Centers', 'Repair Facilities'],
      collection: 'Hazardous Materials Secure Depository',
      recyclers: 'EcoRefine Circuit Disassembly Plant',
      processing: 'Pyrolysis & Acid Leaching Recovery',
      manufacturers: 'Precision Printed Circuit Fabricators',
    },
  },
  {
    id: 'metal',
    name: 'SCRAP METAL',
    icon: '⚙️',
    code: 'FERROUS / NON-FERROUS',
    origin: 'Automotive & Heavy Stamping',
    destination: 'Electric Arc Furnaces',
    outputGrade: 'High-Tensile Billet Stock',
    recoveryRate: '98.5%',
    cycleTime: '24 Hours',
    stages: {
      sources: ['Automotive Stamping Lines', 'Scrap Yards', 'Demolition Sites'],
      collection: 'Heavy Haul Weighbridge Depot',
      recyclers: 'Apex Ferrous Smelters & Foundry',
      processing: 'Magnetic Sorting & Induction Melting',
      manufacturers: 'Automotive Component Die Casters',
    },
  },
  {
    id: 'glass',
    name: 'GLASS CULLET',
    icon: '🍾',
    code: 'CONTAINER CULLET',
    origin: 'Beverage Bottlers & Hospitality',
    destination: 'Container Remelt Kilns',
    outputGrade: 'Color-Sorted Cullet Glass',
    recoveryRate: '99.0%',
    cycleTime: '18 Hours',
    stages: {
      sources: ['Beverage Bottling Plants', 'Hospitality Hubs', 'Curbside'],
      collection: 'Color-Segregated Glass Bunker',
      recyclers: 'PureVitrum Cullet Refining',
      processing: 'Optical Ceramic-Stone Extraction',
      manufacturers: 'National Container Glass Works',
    },
  },
  {
    id: 'paper',
    name: 'PAPER & CARD',
    icon: '📦',
    code: 'OCC / DEINKING',
    origin: 'Warehouses & Print Operations',
    destination: 'Kraft Liner Mills',
    outputGrade: 'Recycled Corrugated Medium',
    recoveryRate: '88.4%',
    cycleTime: '48 Hours',
    stages: {
      sources: ['Logistics Warehouses', 'Publishers', 'Retail Cartons'],
      collection: 'High-Density Baler Terminal',
      recyclers: 'Deccan Pulp & Paper Reclaim',
      processing: 'Hydropulping & Ink De-bonding',
      manufacturers: 'Sustainable Box Packaging Corp',
    },
  },
];

export const HowItWorks: React.FC<Props> = ({ navigate }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedStream, setSelectedStream] = useState<MaterialStream>(MATERIAL_STREAMS[0]);
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [haulDistance, setHaulDistance] = useState<number>(14); // in km
  const [activePersona, setActivePersona] = useState<'generator' | 'recycler' | 'logistics' | 'regulator'>('generator');

  // Calculation for composite match index demo
  const distancePenalty = Math.max(0, Math.round(25 - haulDistance * 0.5));
  const materialScore = 40;
  const capacityScore = 18;
  const surgeScore = 14;
  const totalMatchScore = materialScore + distancePenalty + capacityScore + surgeScore;

  const steps = [
    {
      id: 1,
      tag: 'STEP 01',
      title: 'AI Identification',
      subtitle: 'NIR Spectrometry & Computer Vision',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    },
    {
      id: 2,
      tag: 'STEP 02',
      title: 'Algorithmic Match',
      subtitle: 'Multi-Factor Recycler Matrix',
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-300',
    },
    {
      id: 3,
      tag: 'STEP 03',
      title: 'SHA-256 Ledger',
      subtitle: 'Cryptographic Chain of Custody',
      icon: <Lock className="w-5 h-5 text-purple-500" />,
      badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-300',
    },
    {
      id: 4,
      tag: 'STEP 04',
      title: 'Waste Passport',
      subtitle: 'Public Verified QR Identity',
      icon: <QrCode className="w-5 h-5 text-amber-500" />,
      badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-300',
    },
    {
      id: 5,
      tag: 'STEP 05',
      title: 'Anti-Fraud Radar',
      subtitle: 'Telematics & Mass Audit',
      icon: <TrendingUp className="w-5 h-5 text-teal-500" />,
      badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-300',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* HEADER SECTION */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12372A]/10 border border-[#12372A]/20 text-[#12372A] text-xs font-mono font-bold tracking-wider uppercase shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-[#238B57]" />
          <span>CIRCULARECONOMY OS ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
          How RE:LOOP Operates
        </h1>
        <p className="text-sm sm:text-base text-[#32483E] leading-relaxed">
          An interactive visual blueprint demonstrating how physical waste streams transform into
          tamper-proof, auditable, and high-value circular raw materials using AI spectrometry,
          cryptographic ledgers, and telematics.
        </p>

        {/* Top Key Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono">
          <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs text-left shadow-2xs">
            <div className="text-[10px] text-[#7D9187] uppercase font-semibold">Verification Standard</div>
            <div className="text-sm font-bold text-[#12372A] mt-0.5">SHA-256 Merkle Chain</div>
          </div>
          <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs text-left shadow-2xs">
            <div className="text-[10px] text-[#7D9187] uppercase font-semibold">AI Scan Accuracy</div>
            <div className="text-sm font-bold text-[#238B57] mt-0.5">96.4% Classification</div>
          </div>
          <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs text-left shadow-2xs">
            <div className="text-[10px] text-[#7D9187] uppercase font-semibold">Match Efficiency</div>
            <div className="text-sm font-bold text-[#12372A] mt-0.5">&lt; 15 Sec Automated</div>
          </div>
          <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs text-left shadow-2xs">
            <div className="text-[10px] text-[#7D9187] uppercase font-semibold">Audit Standard</div>
            <div className="text-sm font-bold text-[#238B57] mt-0.5">ISO/TC 323 Ready</div>
          </div>
        </div>
      </div>

      {/* GRAPHIC 1: INTERACTIVE SYSTEM PIPELINE GRAPHIC */}
      <div className="bg-white border border-[#D9DDD5] rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#D9DDD5] gap-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-[#238B57] tracking-wider">
              01 / END-TO-END PIPELINE DIAGRAM
            </div>
            <h2 className="text-2xl font-bold text-[#12372A]">Interactive 5-Stage System Flow</h2>
          </div>
          <p className="text-xs text-[#556960] font-mono max-w-sm">
            Click on any stage node below to activate its live architectural simulation diagram.
          </p>
        </div>

        {/* Stepper Node Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {/* Connector line for desktop */}
          <div className="hidden sm:block absolute top-1/2 left-8 right-8 h-0.5 bg-[#D9DDD5] -translate-y-1/2 z-0" />

          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`relative z-10 flex flex-col items-center p-3.5 rounded-xs border transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#12372A] border-[#12372A] text-white shadow-md scale-[1.02]'
                    : 'bg-[#F6F5EF]/80 border-[#D9DDD5] text-[#14221D] hover:border-[#238B57] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs ${
                      isActive ? 'bg-[#53B978] text-[#12372A]' : 'bg-[#D9DDD5] text-[#32483E]'
                    }`}
                  >
                    {step.tag}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-[#238B57] text-white' : 'bg-white border border-[#D9DDD5]'
                    }`}
                  >
                    {step.icon}
                  </div>
                </div>
                <div className="w-full">
                  <div className="text-xs font-bold font-sans line-clamp-1">{step.title}</div>
                  <div
                    className={`text-[11px] line-clamp-1 ${
                      isActive ? 'text-[#A8C5B2]' : 'text-[#7D9187]'
                    }`}
                  >
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE STAGE GRAPHICAL DISPLAY PANEL */}
        <div className="bg-[#14221D] border border-[#32483E] rounded-xs p-6 text-[#F6F5EF] relative overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-grid-stone opacity-10 pointer-events-none" />

          {/* Stage 1: AI Identification Graphic */}
          {activeStep === 1 && (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-[#53B978] animate-pulse" />
                  <span className="font-bold text-white">AI SPECTROMETRY SCANNER (SPECTRO-NIR v4.2)</span>
                </div>
                <div className="text-[11px] text-[#53B978] font-bold">MODE: REAL-TIME INGESTION</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 bg-[#12372A] border border-[#32483E] rounded-xs p-6 relative min-h-[260px] flex flex-col justify-between">
                  <div className="flex justify-between items-center font-mono text-xs text-[#53B978]">
                    <span>[SPECTRAL NIR ARRAY ACTIVE]</span>
                    <span className="bg-[#14221D] px-2 py-0.5 border border-[#32483E] text-[10px]">
                      WAVELENGTH: 900-1700nm
                    </span>
                  </div>

                  {/* Visual laser scanner line */}
                  <div className="relative my-6 py-8 border border-dashed border-[#53B978]/40 rounded-xs bg-[#14221D]/70 p-4 text-center">
                    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#53B978] to-transparent shadow-[0_0_10px_#53B978] animate-pulse top-1/2 -translate-y-1/2" />
                    <div className="text-2xl font-black text-white tracking-widest uppercase">
                      PET POLYMER BALES
                    </div>
                    <div className="text-xs text-[#53B978] font-mono mt-1">
                      CLASSIFICATION: 96.4% RECYCLED PETE (GRADE A)
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-mono text-[11px] text-[#A8C5B2]">
                    <span className="flex items-center gap-1 text-[#53B978]">
                      <Check className="w-3.5 h-3.5" /> CONTAMINATION: 1.4% (APPROVED)
                    </span>
                    <span>WEIGHT REQUIREMENT: MANUAL WEIGHBRIDGE</span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xl font-bold text-white">How AI Inspection Works</h3>
                  <p className="text-xs text-[#A8C5B2] leading-relaxed">
                    When a generator snaps a photo, deep neural networks analyze visual polymer surface
                    density and near-infrared spectral patterns. It automatically classifies scrap grade,
                    detects hazardous contaminants, and recommends optimal recycling pathways.
                  </p>
                  <div className="p-3 bg-[#12372A] border border-[#32483E] rounded-xs text-xs font-mono space-y-2">
                    <div className="text-[#53B978] font-bold">Scientific Guardrail Protocol:</div>
                    <div className="text-[#A8C5B2]">
                      2D visual AI provides reliable material categorization. Net load mass is mandatory via
                      certified digital weighbridges to eliminate volumetric estimation errors.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Algorithmic Matching Graphic */}
          {activeStep === 2 && (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">DYNAMIC RECYCLER MATCHING CALCULATOR</span>
                </div>
                <div className="text-[11px] text-blue-400 font-bold">ALGORITHM: MULTI-WEIGHT INDEX</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 bg-[#12372A] border border-[#32483E] rounded-xs p-6 space-y-5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#A8C5B2]">SIMULATE HAUL DISTANCE:</span>
                    <span className="text-[#53B978] font-bold">{haulDistance} KM (PUNE METRO)</span>
                  </div>

                  {/* Interactive Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={haulDistance}
                      onChange={(e) => setHaulDistance(Number(e.target.value))}
                      className="w-full accent-[#53B978] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#7D9187]">
                      <span>2 km (Local)</span>
                      <span>25 km (Regional)</span>
                      <span>50 km (Intercity)</span>
                    </div>
                  </div>

                  {/* Score Breakdown Graphic */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-xs text-center">
                    <div className="p-2.5 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <div className="text-[10px] text-[#7D9187]">MATERIAL MATCH</div>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{materialScore}%</div>
                      <div className="text-[9px] text-[#A8C5B2]">Weight: 40% Max</div>
                    </div>
                    <div className="p-2.5 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <div className="text-[10px] text-[#7D9187]">DISTANCE SCORE</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{distancePenalty}%</div>
                      <div className="text-[9px] text-[#A8C5B2]">Carbon Penalty</div>
                    </div>
                    <div className="p-2.5 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <div className="text-[10px] text-[#7D9187]">CAPACITY HEADROOM</div>
                      <div className="text-base font-bold text-[#53B978] mt-0.5">{capacityScore}%</div>
                      <div className="text-[9px] text-[#A8C5B2]">Intake Availability</div>
                    </div>
                    <div className="p-2.5 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <div className="text-[10px] text-[#7D9187]">DEMAND SURGE</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{surgeScore}%</div>
                      <div className="text-[9px] text-[#A8C5B2]">Market Multiplier</div>
                    </div>
                  </div>

                  {/* Composite Score Result */}
                  <div className="flex items-center justify-between p-3 bg-[#14221D] border border-[#53B978]/40 rounded-xs font-mono">
                    <span className="text-xs text-[#A8C5B2]">COMPOSITE MATCH SCORE:</span>
                    <span className="text-lg font-black text-[#53B978]">{totalMatchScore} / 100 MATCH INDEX</span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xl font-bold text-white">Automated Economic Routing</h3>
                  <p className="text-xs text-[#A8C5B2] leading-relaxed">
                    Instead of slow phone quotes, our algorithm matches sellers with verified recyclers in
                    seconds based on material compatibility, facility capacity, carbon haul distance, and real-time
                    market scrap demand.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/matches')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#53B978] text-[#12372A] font-mono text-xs font-bold rounded-xs hover:bg-[#238B57] hover:text-white transition cursor-pointer"
                  >
                    <span>Inspect Recycler Marketplace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: SHA-256 Ledger Graphic */}
          {activeStep === 3 && (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">MERKLE TREE SHA-256 CUSTODY CHAIN</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTampered(!isTampered)}
                  className={`px-3 py-1 rounded-xs border text-xs font-bold cursor-pointer transition ${
                    isTampered
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  }`}
                >
                  {isTampered ? '⚠️ TAMPERING SIMULATED (CLICK TO RESET)' : '⚡ TEST TAMPER INTEGRITY'}
                </button>
              </div>

              {/* Graphic Merkle Block Chain Visualizer */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
                  <div
                    className={`p-3 border rounded-xs transition-colors ${
                      isTampered
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#12372A] border-[#32483E] text-white'
                    }`}
                  >
                    <div className="text-[10px] text-[#53B978] font-bold">BLOCK #001 (GENESIS)</div>
                    <div className="font-bold text-xs mt-1">Listing Created</div>
                    <div className="text-[10px] text-[#7D9187] mt-1">Mass: {isTampered ? '420 KG ❌' : '500 KG ✓'}</div>
                    <div className="text-[9px] break-all font-mono text-purple-300 mt-2">
                      Hash: {isTampered ? 'e9a4f21... [INVALID]' : '8f92a1...49b2'}
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded-xs transition-colors ${
                      isTampered
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#12372A] border-[#32483E] text-white'
                    }`}
                  >
                    <div className="text-[10px] text-[#53B978] font-bold">BLOCK #002 (PICKUP)</div>
                    <div className="font-bold text-xs mt-1">EV Truck Dispatch</div>
                    <div className="text-[10px] text-[#7D9187] mt-1">Seal: SEAL-ABC-89021</div>
                    <div className="text-[9px] break-all font-mono text-purple-300 mt-2">
                      Hash: {isTampered ? 'c3b102... [BROKEN]' : '3a18e7...881a'}
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded-xs transition-colors ${
                      isTampered
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#12372A] border-[#32483E] text-white'
                    }`}
                  >
                    <div className="text-[10px] text-[#53B978] font-bold">BLOCK #003 (TRANSIT)</div>
                    <div className="font-bold text-xs mt-1">Geofence Telemetry</div>
                    <div className="text-[10px] text-[#7D9187] mt-1">Variance: 0.0%</div>
                    <div className="text-[9px] break-all font-mono text-purple-300 mt-2">
                      Hash: {isTampered ? 'f87a02... [BROKEN]' : '6c41b9...120f'}
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded-xs transition-colors ${
                      isTampered
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#12372A] border-[#32483E] text-white'
                    }`}
                  >
                    <div className="text-[10px] text-[#53B978] font-bold">BLOCK #004 (RECYCLED)</div>
                    <div className="font-bold text-xs mt-1">Pellet Output Certificate</div>
                    <div className="text-[10px] text-[#7D9187] mt-1">Yield: 96.4% rPET</div>
                    <div className="text-[9px] break-all font-mono text-purple-300 mt-2">
                      Hash: {isTampered ? 'CHECKSUM_FAILED' : '9d02e4...aa91'}
                    </div>
                  </div>
                </div>

                {/* Status Notice Banner */}
                {isTampered ? (
                  <div className="p-3 bg-red-900/30 border border-red-500 rounded-xs flex items-center gap-3 text-xs text-red-200 font-mono">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <span className="font-bold">FRAUD DETECTED: </span>
                      Weight alteration from 500kg to 420kg broke block hashes downstream. The Merkle ledger automatically rejects unverified discrepancies.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#12372A] border border-[#53B978]/40 rounded-xs flex items-center gap-3 text-xs text-[#53B978] font-mono">
                    <CheckCircle2 className="w-5 h-5 text-[#53B978] shrink-0" />
                    <div>
                      <span className="font-bold">CRYPTOGRAPHIC INTEGRITY CONFIRMED: </span>
                      All block hashes match parent links. Zero weight variance detected along the entire custody corridor.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 4: Digital Waste Passport Graphic */}
          {activeStep === 4 && (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">DIGITAL WASTE PASSPORT &amp; VERIFICATION</span>
                </div>
                <div className="text-[11px] text-amber-400 font-bold">PUBLIC ID: WST-PUN-00124</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 bg-[#12372A] border border-[#32483E] rounded-xs p-6 flex flex-col sm:flex-row gap-6 items-center">
                  {/* Mock Visual Passport Card */}
                  <div className="bg-[#FFFFFF] text-[#14221D] p-4 rounded-xs shadow-md border border-[#D9DDD5] w-48 text-center shrink-0 font-mono">
                    <div className="text-[9px] font-bold text-[#238B57] uppercase tracking-wider mb-1">
                      RE:LOOP PASSPORT
                    </div>
                    <div className="w-24 h-24 bg-slate-950 mx-auto my-2 p-1.5 rounded-xs flex items-center justify-center">
                      <QrCode className="w-full h-full text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-[#12372A]">WST-PUN-00124</div>
                    <div className="text-[9px] text-[#7D9187] mt-0.5">500.0 KG • rPET Flakes</div>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> ISO/TC 323 Circular Economy Compliant
                    </div>
                    <div className="text-xs text-[#A8C5B2] leading-relaxed">
                      Every batch generates a public QR passport. Anyone—from factory managers to municipal regulators and eco-conscious consumers—can scan to inspect its origin, haul telematics, and recycling facility certification.
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/verify/WST-PUN-00124')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-[#12372A] font-bold rounded-xs hover:bg-amber-300 transition cursor-pointer text-xs"
                    >
                      <span>Open Sample Passport View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xl font-bold text-white">Transparent Green Claims</h3>
                  <p className="text-xs text-[#A8C5B2] leading-relaxed">
                    Eliminate greenwashing. The passport proves genuine recycled origin for ESG compliance and Extended Producer Responsibility (EPR) reporting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Anti-Fraud Radar & Circular Re-integration */}
          {activeStep === 5 && (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#32483E] font-mono text-xs text-[#A8C5B2]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white">REAL-TIME TELEMATICS &amp; FRAUD RADAR</span>
                </div>
                <div className="text-[11px] text-teal-400 font-bold">RADAR STATUS: ACTIVE AUDITING</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 bg-[#12372A] border border-[#32483E] rounded-xs p-6 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs border-b border-[#32483E] pb-2">
                    <span className="text-[#A8C5B2]">MASS BALANCE CHECK:</span>
                    <span className="text-[#53B978] font-bold">500.0 KG IN → 482.0 KG PELLET OUT (96.4%)</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between p-2 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <span className="text-[#A8C5B2]">GEOFENCE ROUTE DEVIATION:</span>
                      <span className="text-[#53B978] font-bold">0.0 METERS (STRICT CORRIDOR)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <span className="text-[#A8C5B2]">WEIGHBRIDGE TOLERANCE:</span>
                      <span className="text-[#53B978] font-bold">± 0.2% (PERMITTED FLUID LOSS)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#14221D] border border-[#32483E] rounded-xs">
                      <span className="text-[#A8C5B2]">DUPLICATE CERTIFICATE RADAR:</span>
                      <span className="text-[#53B978] font-bold">CLEAN (0 CONFLICTS)</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xl font-bold text-white">Closed-Loop Re-integration</h3>
                  <p className="text-xs text-[#A8C5B2] leading-relaxed">
                    Once processed into certified secondary raw materials, the pellets are shipped back to FMCG manufacturers to make new packaging, closing the loop permanently.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/map')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400 text-[#12372A] font-mono text-xs font-bold rounded-xs hover:bg-teal-300 transition cursor-pointer"
                  >
                    <span>View Live Map Radar</span>
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GRAPHIC 2: MATERIALS IN MOTION STREAM EXPLORER */}
      <div className="bg-white border border-[#D9DDD5] rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#D9DDD5] gap-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-[#238B57] tracking-wider">
              02 / MATERIAL STREAMS ARCHITECTURE
            </div>
            <h2 className="text-2xl font-bold text-[#12372A]">Material Flow Pipelines</h2>
          </div>
          <p className="text-xs text-[#556960] font-mono max-w-sm">
            Select a specific waste category to view its recovery yields and processing nodes.
          </p>
        </div>

        {/* Stream Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar font-mono text-xs">
          {MATERIAL_STREAMS.map((stream) => {
            const isSelected = selectedStream.id === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => setSelectedStream(stream)}
                className={`px-3.5 py-2 rounded-xs tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#12372A] text-white font-bold shadow-xs'
                    : 'bg-[#F6F5EF] border border-[#D9DDD5] text-[#32483E] hover:border-[#238B57]'
                }`}
              >
                <span>{stream.icon}</span>
                <span>{stream.name}</span>
              </button>
            );
          })}
        </div>

        {/* Material Stream Card Graphic */}
        <div className="bg-[#F6F5EF] border border-[#D9DDD5] p-6 rounded-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D9DDD5] font-mono text-xs">
            <div>
              <span className="text-[#7D9187]">STREAM CODE:</span>{' '}
              <span className="font-bold text-[#12372A]">{selectedStream.code}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[#7D9187]">RECOVERY RATE:</span>{' '}
                <span className="font-bold text-[#238B57]">{selectedStream.recoveryRate}</span>
              </div>
              <div>
                <span className="text-[#7D9187]">AVG CYCLE TIME:</span>{' '}
                <span className="font-bold text-[#12372A]">{selectedStream.cycleTime}</span>
              </div>
            </div>
          </div>

          {/* Horizontal Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs space-y-1">
              <div className="text-[10px] text-[#238B57] font-bold">1. SOURCES</div>
              <div className="text-xs font-bold text-[#12372A] line-clamp-2">
                {selectedStream.stages.sources.join(', ')}
              </div>
              <div className="text-[10px] text-[#7D9187] pt-2">Origin: {selectedStream.origin}</div>
            </div>

            <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs space-y-1">
              <div className="text-[10px] text-[#238B57] font-bold">2. COLLECTION</div>
              <div className="text-xs font-bold text-[#12372A] line-clamp-2">
                {selectedStream.stages.collection}
              </div>
              <div className="text-[10px] text-[#7D9187] pt-2">GPS Sealed Logistics</div>
            </div>

            <div className="bg-white border border-[#238B57] bg-[#E5EFE8]/30 p-3 rounded-xs space-y-1">
              <div className="text-[10px] text-[#238B57] font-bold">3. RECYCLER</div>
              <div className="text-xs font-bold text-[#12372A] line-clamp-2">
                {selectedStream.stages.recyclers}
              </div>
              <div className="text-[10px] text-[#238B57] pt-2">✓ Verified Intake</div>
            </div>

            <div className="bg-white border border-[#D9DDD5] p-3 rounded-xs space-y-1">
              <div className="text-[10px] text-[#238B57] font-bold">4. PROCESSING</div>
              <div className="text-xs font-bold text-[#12372A] line-clamp-2">
                {selectedStream.stages.processing}
              </div>
              <div className="text-[10px] text-[#7D9187] pt-2">Spectro-Sorting</div>
            </div>

            <div className="bg-[#12372A] text-white p-3 rounded-xs space-y-1">
              <div className="text-[10px] text-[#53B978] font-bold">5. REUSE</div>
              <div className="text-xs font-bold text-white line-clamp-2">
                {selectedStream.stages.manufacturers}
              </div>
              <div className="text-[10px] text-[#A8C5B2] pt-2">{selectedStream.outputGrade}</div>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHIC 3: STAKEHOLDER PERSONA JOURNEY */}
      <div className="bg-white border border-[#D9DDD5] rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#D9DDD5] gap-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-[#238B57] tracking-wider">
              03 / SYSTEM PERSPECTIVE
            </div>
            <h2 className="text-2xl font-bold text-[#12372A]">Tailored Persona Workflows</h2>
          </div>
          <p className="text-xs text-[#556960] font-mono max-w-sm">
            Discover how RE:LOOP serves distinct circular economy actors.
          </p>
        </div>

        {/* Persona Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActivePersona('generator')}
            className={`p-3 border rounded-xs cursor-pointer transition text-left ${
              activePersona === 'generator'
                ? 'bg-[#12372A] text-white border-[#12372A] font-bold'
                : 'bg-[#F6F5EF] text-[#32483E] border-[#D9DDD5] hover:border-[#238B57]'
            }`}
          >
            <Building2 className="w-4 h-4 mb-1 text-[#53B978]" />
            <div>Waste Generators</div>
            <div className="text-[10px] font-normal text-[#7D9187]">Factories & Retailers</div>
          </button>

          <button
            type="button"
            onClick={() => setActivePersona('recycler')}
            className={`p-3 border rounded-xs cursor-pointer transition text-left ${
              activePersona === 'recycler'
                ? 'bg-[#12372A] text-white border-[#12372A] font-bold'
                : 'bg-[#F6F5EF] text-[#32483E] border-[#D9DDD5] hover:border-[#238B57]'
            }`}
          >
            <Factory className="w-4 h-4 mb-1 text-blue-400" />
            <div>Recyclers &amp; Smelters</div>
            <div className="text-[10px] font-normal text-[#7D9187]">Processing Facilities</div>
          </button>

          <button
            type="button"
            onClick={() => setActivePersona('logistics')}
            className={`p-3 border rounded-xs cursor-pointer transition text-left ${
              activePersona === 'logistics'
                ? 'bg-[#12372A] text-white border-[#12372A] font-bold'
                : 'bg-[#F6F5EF] text-[#32483E] border-[#D9DDD5] hover:border-[#238B57]'
            }`}
          >
            <Truck className="w-4 h-4 mb-1 text-amber-400" />
            <div>Logistics Carriers</div>
            <div className="text-[10px] font-normal text-[#7D9187]">Telematics EV Fleets</div>
          </button>

          <button
            type="button"
            onClick={() => setActivePersona('regulator')}
            className={`p-3 border rounded-xs cursor-pointer transition text-left ${
              activePersona === 'regulator'
                ? 'bg-[#12372A] text-white border-[#12372A] font-bold'
                : 'bg-[#F6F5EF] text-[#32483E] border-[#D9DDD5] hover:border-[#238B57]'
            }`}
          >
            <Globe className="w-4 h-4 mb-1 text-purple-400" />
            <div>Regulators &amp; ESG Auditors</div>
            <div className="text-[10px] font-normal text-[#7D9187]">EPR Compliance</div>
          </button>
        </div>

        {/* Persona Details Card */}
        <div className="p-6 bg-[#F6F5EF] border border-[#D9DDD5] rounded-xs font-mono text-xs space-y-4">
          {activePersona === 'generator' && (
            <div className="space-y-3">
              <div className="text-sm font-bold text-[#12372A]">FOR INDUSTRIAL GENERATORS &amp; BUSINESSES</div>
              <p className="text-[#556960] font-sans text-xs leading-relaxed">
                Snap a photo of your scrap pile to receive immediate AI grade classification. Publish verified listings to local recyclers, monetize industrial waste, and download automated ESG carbon savings certificates for corporate sustainability reports.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/list-waste')}
                  className="px-4 py-2 bg-[#12372A] text-white font-bold rounded-xs hover:bg-[#238B57] transition cursor-pointer"
                >
                  List Waste Batch Now →
                </button>
              </div>
            </div>
          )}

          {activePersona === 'recycler' && (
            <div className="space-y-3">
              <div className="text-sm font-bold text-[#12372A]">FOR RECYCLING FACILITIES &amp; PROCESSORS</div>
              <p className="text-[#556960] font-sans text-xs leading-relaxed">
                Secure steady, pre-sorted raw scrap intake. Review automated match offers, verify incoming weighbridge loads digitally, and issue certified secondary raw material pellets with immutable digital passports.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/recycler/marketplace')}
                  className="px-4 py-2 bg-[#238B57] text-white font-bold rounded-xs hover:bg-[#12372A] transition cursor-pointer"
                >
                  Open Recycler Marketplace →
                </button>
              </div>
            </div>
          )}

          {activePersona === 'logistics' && (
            <div className="space-y-3">
              <div className="text-sm font-bold text-[#12372A]">FOR LOGISTICS FLEETS &amp; WEIGHBRIDGES</div>
              <p className="text-[#556960] font-sans text-xs leading-relaxed">
                Receive geofenced haul dispatch routes. Tamper-evident seals and continuous telemetry track real-time load weights to eliminate dumping and unauthorized offloading.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/map')}
                  className="px-4 py-2 bg-[#12372A] text-white font-bold rounded-xs hover:bg-[#238B57] transition cursor-pointer"
                >
                  Inspect Telemetry Map →
                </button>
              </div>
            </div>
          )}

          {activePersona === 'regulator' && (
            <div className="space-y-3">
              <div className="text-sm font-bold text-[#12372A]">FOR MUNICIPAL REGULATORS &amp; EPR AUDITORS</div>
              <p className="text-[#556960] font-sans text-xs leading-relaxed">
                Audit complete municipal waste streams effortlessly. Access SHA-256 Merkle proofs, audit weighbridge discrepancies, and verify EPR compliance records in seconds.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/impact')}
                  className="px-4 py-2 bg-[#12372A] text-white font-bold rounded-xs hover:bg-[#238B57] transition cursor-pointer"
                >
                  View ESG &amp; Impact Ledger →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FINAL ACTION BANNER */}
      <div className="bg-[#12372A] text-[#F6F5EF] rounded-xs p-8 text-center space-y-4 shadow-lg border border-[#32483E]">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to Experience the Circular Economy OS?
        </h2>
        <p className="text-xs sm:text-sm text-[#A8C5B2] max-w-xl mx-auto">
          Test live waste listing creation, explore real-time matching algorithms, or verify sample digital passports in the sandbox demo environment.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/list-waste')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-[#53B978] hover:bg-[#238B57] text-[#12372A] hover:text-white font-mono font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <span>LIST WASTE DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/verify/WST-PUN-00124')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-[#14221D] border border-[#32483E] hover:border-[#53B978] text-[#F6F5EF] font-mono font-bold text-xs transition cursor-pointer"
          >
            <span>VERIFY PASSPORT</span>
            <QrCode className="w-4 h-4 text-[#53B978]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

