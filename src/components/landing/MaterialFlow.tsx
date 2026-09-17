import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Factory, Truck, Building2, Home, RefreshCw, Cpu, Layers } from 'lucide-react';

interface MaterialStream {
  id: string;
  name: string;
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
    name: 'METAL',
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
    name: 'GLASS',
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
    name: 'PAPER',
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
  {
    id: 'construction',
    name: 'CONSTRUCTION',
    code: 'C&D INERT',
    origin: 'Urban Demolition & Infrastructure',
    destination: 'Aggregate Re-compaction',
    outputGrade: 'Recycled Concrete Aggregates',
    recoveryRate: '82.0%',
    cycleTime: '96 Hours',
    stages: {
      sources: ['Urban Infrastructure', 'Building Demolitions', 'Civil Works'],
      collection: 'Regional C&D Processing Yard',
      recyclers: 'Inert Matrix Resource Recovery',
      processing: 'Impact Crusher & Vibratory Screening',
      manufacturers: 'Paver & Sub-base Concrete Works',
    },
  },
];

export const MaterialFlow: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<MaterialStream>(MATERIAL_STREAMS[0]);

  return (
    <section id="flow" className="py-20 sm:py-28 bg-[#F6F5EF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              02 / LOGISTICS ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              MATERIALS IN MOTION
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#32483E] font-medium max-w-md">
            Waste doesn't disappear. It moves.
            <span className="block text-sm text-[#556960] mt-1 font-normal">
              Follow physical resource flows through verified nodes across the regional logistics web.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-[11px] font-mono text-[#556960] uppercase tracking-wider mr-2 hidden sm:inline">
            Material:
          </span>
          {MATERIAL_STREAMS.map((stream) => {
            const isSelected = selectedStream.id === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => setSelectedStream(stream)}
                className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#12372A] text-[#F6F5EF] font-bold shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#D9DDD5] text-[#32483E] hover:border-[#238B57] hover:text-[#12372A]'
                }`}
              >
                {stream.name}
              </button>
            );
          })}
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded-sm p-6 sm:p-10 shadow-xs relative">
          <div className="absolute inset-0 bg-dots-stone pointer-events-none opacity-40 rounded-sm" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D9DDD5] font-mono text-xs">
            <div>
              <span className="text-[#7D9187]">STREAM DESIGNATION:</span>{' '}
              <span className="font-bold text-[#12372A]">{selectedStream.code}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[#7D9187]">RECOVERY YIELD:</span>{' '}
                <span className="font-bold text-[#238B57]">{selectedStream.recoveryRate}</span>
              </div>
              <div>
                <span className="text-[#7D9187]">AVG DWELL TIME:</span>{' '}
                <span className="font-bold text-[#12372A]">{selectedStream.cycleTime}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 items-stretch">
            <div className="flex flex-col justify-between border border-[#D9DDD5] bg-[#F6F5EF]/60 p-5 rounded-sm relative">
              <div className="absolute -top-3 left-4 bg-[#12372A] text-[#F6F5EF] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                STAGE 01
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#12372A] font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <Home className="w-3.5 h-3.5 text-[#238B57]" />
                  SOURCES
                </div>
                <div className="space-y-2 text-xs text-[#32483E]">
                  {selectedStream.stages.sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#FFFFFF] px-2.5 py-1.5 border border-[#D9DDD5]/80 rounded-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#53B978]" />
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#7D9187] mt-4 pt-3 border-t border-[#D9DDD5]">
                AGGREGATION: REGIONAL
              </div>
            </div>

            <div className="flex flex-col justify-between border border-[#D9DDD5] bg-[#F6F5EF]/60 p-5 rounded-sm relative">
              <div className="absolute -top-3 left-4 bg-[#12372A] text-[#F6F5EF] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                STAGE 02
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#12372A] font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <Truck className="w-3.5 h-3.5 text-[#238B57]" />
                  COLLECTION
                </div>
                <div className="bg-[#FFFFFF] p-3 border border-[#D9DDD5]/80 rounded-xs">
                  <div className="text-xs font-semibold text-[#12372A] mb-1">
                    {selectedStream.stages.collection}
                  </div>
                  <div className="text-[11px] text-[#556960] font-mono">
                    GPS Geofenced Transit • Weighbridge Sealed
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#238B57] font-semibold mt-4 pt-3 border-t border-[#D9DDD5] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>LOAD WEIGHED & AUDITED</span>
              </div>
            </div>

            <div className="flex flex-col justify-between border border-[#238B57]/40 bg-[#E5EFE8]/40 p-5 rounded-sm relative ring-1 ring-[#238B57]/20">
              <div className="absolute -top-3 left-4 bg-[#238B57] text-[#F6F5EF] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                STAGE 03 / MATCH
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#12372A] font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <Building2 className="w-3.5 h-3.5 text-[#238B57]" />
                  RECYCLERS
                </div>
                <div className="bg-[#FFFFFF] p-3 border border-[#D9DDD5] rounded-xs shadow-2xs">
                  <div className="text-xs font-bold text-[#12372A] mb-1">
                    {selectedStream.stages.recyclers}
                  </div>
                  <div className="text-[11px] text-[#238B57] font-mono font-semibold">
                    ✓ Verified Facility • ISO 14001
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#7D9187] mt-4 pt-3 border-t border-[#D9DDD5]">
                CAPACITY: 45 TONS / DAY
              </div>
            </div>

            <div className="flex flex-col justify-between border border-[#D9DDD5] bg-[#F6F5EF]/60 p-5 rounded-sm relative">
              <div className="absolute -top-3 left-4 bg-[#12372A] text-[#F6F5EF] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                STAGE 04
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#12372A] font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <Factory className="w-3.5 h-3.5 text-[#238B57]" />
                  PROCESSING
                </div>
                <div className="bg-[#FFFFFF] p-3 border border-[#D9DDD5]/80 rounded-xs">
                  <div className="text-xs font-semibold text-[#12372A] mb-1">
                    {selectedStream.stages.processing}
                  </div>
                  <div className="text-[11px] text-[#556960] font-mono">
                    Spectro-Sorting • Pelletizing
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#7D9187] mt-4 pt-3 border-t border-[#D9DDD5]">
                PURITY THRESHOLD: 99.4%
              </div>
            </div>

            <div className="flex flex-col justify-between border border-[#12372A] bg-[#12372A] text-[#F6F5EF] p-5 rounded-sm relative shadow-sm">
              <div className="absolute -top-3 left-4 bg-[#53B978] text-[#12372A] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                STAGE 05 / REUSE
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#53B978] font-mono font-bold text-xs uppercase tracking-wider mb-3">
                  <RefreshCw className="w-3.5 h-3.5 text-[#53B978]" />
                  MANUFACTURERS
                </div>
                <div className="bg-[#14221D] p-3 border border-[#32483E] rounded-xs">
                  <div className="text-xs font-bold text-[#F6F5EF] mb-1">
                    {selectedStream.stages.manufacturers}
                  </div>
                  <div className="text-[11px] text-[#A8C5B2] font-mono">
                    Output: {selectedStream.outputGrade}
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#53B978] font-semibold mt-4 pt-3 border-t border-[#32483E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#53B978]" />
                <span>CIRCULAR RE-INTEGRATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
