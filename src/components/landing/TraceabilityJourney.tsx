import React, { useState } from 'react';
import { Navigation, ShieldCheck, MapPin, Truck, CheckCircle2, Clock, UserCheck, Layers } from 'lucide-react';

interface Waypoint {
  id: string;
  stage: string;
  name: string;
  coordinates: string;
  timestamp: string;
  handler: string;
  sealId: string;
  weightDelta: string;
  status: 'completed' | 'in-progress' | 'pending';
}

const ROUTE_WAYPOINTS: Waypoint[] = [
  {
    id: 'wp-1',
    stage: 'SOURCE',
    name: 'ABC Industries Loading Dock 3',
    coordinates: '18.6298° N, 73.7997° E (Bhosari MIDC)',
    timestamp: '2026-03-14 09:15:00 IST',
    handler: 'ABC Custody Officer #19',
    sealId: 'SEAL-ABC-89021',
    weightDelta: '500.0 KG (Baseline)',
    status: 'completed',
  },
  {
    id: 'wp-2',
    stage: 'COLLECTED',
    name: 'CleanFleet EV #14 Depository',
    coordinates: '18.6312° N, 73.8050° E',
    timestamp: '2026-03-14 11:42:15 IST',
    handler: 'Driver: Rajesh M. (ID #402)',
    sealId: 'SEAL-ABC-89021 (Intact)',
    weightDelta: '500.0 KG (Variance 0.0%)',
    status: 'completed',
  },
  {
    id: 'wp-3',
    stage: 'IN TRANSIT',
    name: 'NH-48 Corridor Waypoint Bravo',
    coordinates: '18.7052° N, 73.8211° E',
    timestamp: '2026-03-14 13:05:40 IST',
    handler: 'Automated Geofence Gateway #04',
    sealId: 'RF Telematics Active',
    weightDelta: 'Telemetry Locked (500.0 KG)',
    status: 'completed',
  },
  {
    id: 'wp-4',
    stage: 'RECYCLING FACILITY',
    name: 'GreenCycle Chakan MIDC Receiving',
    coordinates: '18.7561° N, 73.8540° E',
    timestamp: '2026-03-14 14:10:22 IST',
    handler: 'Intake Inspector: Priya S.',
    sealId: 'SEAL BROKEN UNDER CAMERA',
    weightDelta: '500.0 KG Received',
    status: 'completed',
  },
  {
    id: 'wp-5',
    stage: 'NEW MATERIAL',
    name: 'Extrusion Line #2 Pelletizing',
    coordinates: '18.7564° N, 73.8545° E',
    timestamp: '2026-03-15 10:20:00 IST',
    handler: 'Process Supervisor: Alok K.',
    sealId: 'BATCH-rPET-2026-PUN-99',
    weightDelta: '482.0 KG rPET Pellets (96.4% Yield)',
    status: 'completed',
  },
];

export const TraceabilityJourney: React.FC = () => {
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint>(ROUTE_WAYPOINTS[2]);

  return (
    <section className="py-20 sm:py-28 bg-[#F6F5EF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              06 / LIVE TELEMETRY & ROUTING
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              FOLLOW EVERY KILOGRAM.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#32483E] font-medium max-w-md">
            Tamper-proof telematics eliminate en-route dumping and diversion.
            <span className="block text-sm text-[#556960] mt-1 font-normal">
              Continuous weight cell polling, geofenced custody milestones, and optical inspection seals.
            </span>
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded-sm shadow-sm p-6 sm:p-10 relative">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D9DDD5] font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#238B57]" />
              <span className="font-bold text-[#12372A]">CORRIDOR: PUNE INDUSTRIAL EXPRESSWAY (NH-48)</span>
            </div>
            <div className="flex items-center gap-6 text-[#556960]">
              <span>TOTAL TRANSIT DIST: 22.4 KM</span>
              <span className="text-[#238B57] font-bold">LOSS VARIANCE: 0.0%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#14221D] border border-[#32483E] rounded-xs p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div className="absolute inset-0 bg-grid-stone pointer-events-none opacity-10" />

              <div className="relative z-10 flex items-center justify-between font-mono text-xs text-[#53B978]">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 animate-spin" />
                  <span>ACTIVE AUDIT ROUTE</span>
                </div>
                <div className="bg-[#12372A] border border-[#32483E] px-2 py-0.5 text-[11px] text-[#A8C5B2] rounded-xs">
                  BATCH: WST-PUN-00124
                </div>
              </div>

              <div className="relative z-10 my-8 py-4">
                <svg viewBox="0 0 600 160" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 40 80 Q 180 20 300 80 T 560 80"
                    fill="none"
                    stroke="#32483E"
                    strokeWidth="4"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 40 80 Q 180 20 300 80 T 560 80"
                    fill="none"
                    stroke="#238B57"
                    strokeWidth="3"
                  />

                  {[
                    { x: 40, y: 80, label: 'SOURCE', id: 'wp-1' },
                    { x: 170, y: 44, label: 'COLLECTED', id: 'wp-2' },
                    { x: 300, y: 80, label: 'IN TRANSIT', id: 'wp-3' },
                    { x: 430, y: 116, label: 'FACILITY', id: 'wp-4' },
                    { x: 560, y: 80, label: 'REUSED', id: 'wp-5' },
                  ].map((pt, i) => {
                    const isSelected = activeWaypoint.id === pt.id;
                    return (
                      <g
                        key={pt.id}
                        className="cursor-pointer"
                        onClick={() => {
                          const wp = ROUTE_WAYPOINTS.find((w) => w.id === pt.id);
                          if (wp) setActiveWaypoint(wp);
                        }}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 10 : 7}
                          fill={isSelected ? '#53B978' : '#238B57'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={pt.x}
                          y={pt.y > 80 ? pt.y + 22 : pt.y - 14}
                          textAnchor="middle"
                          fill={isSelected ? '#53B978' : '#A8C5B2'}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#A8C5B2] border-t border-[#32483E] pt-3">
                <div className="flex items-center gap-1.5 text-[#53B978]">
                  <MapPin className="w-3 h-3" />
                  <span>GPS: {activeWaypoint.coordinates}</span>
                </div>
                <div className="text-[10px] text-[#7D9187]">
                  CLICK ANY WAYPOINT TO INSPECT LOG
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between border border-[#D9DDD5] bg-[#F6F5EF]/50 p-6 rounded-xs font-mono">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9DDD5]">
                  <div className="text-xs font-bold text-[#238B57] uppercase tracking-wider">
                    WAYPOINT AUDIT TELEMETRY
                  </div>
                  <span className="bg-[#E5EFE8] text-[#12372A] text-[10px] px-2 py-0.5 rounded-xs font-bold">
                    {activeWaypoint.stage}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="text-[10px] text-[#7D9187] uppercase">CHECKPOINT LOCATION</div>
                    <div className="font-bold text-[#12372A] text-sm mt-0.5">{activeWaypoint.name}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#7D9187] uppercase">TIMESTAMP (GPS SYNC)</div>
                    <div className="font-bold text-[#12372A] mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#238B57]" />
                      <span>{activeWaypoint.timestamp}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#7D9187] uppercase">AUTHORIZED CUSTODIAN</div>
                    <div className="font-bold text-[#12372A] mt-0.5 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#238B57]" />
                      <span>{activeWaypoint.handler}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#7D9187] uppercase">SECURITY SEAL REF</div>
                    <div className="font-bold text-[#12372A] mt-0.5">{activeWaypoint.sealId}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#7D9187] uppercase">MASS VERIFICATION</div>
                    <div className="font-bold text-[#238B57] text-sm mt-0.5">
                      {activeWaypoint.weightDelta}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D9DDD5] flex items-center gap-2 text-[11px] text-[#238B57] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>ALL SENSORS WITHIN STRICT TOLERANCE LIMITS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
