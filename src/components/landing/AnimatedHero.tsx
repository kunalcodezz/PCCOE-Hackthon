import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, ChevronRight, Compass } from 'lucide-react';

interface Props {
  onListWaste: () => void;
  onExploreJourney: () => void;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  type: 'waste' | 'recycler' | 'hub' | 'facility' | 'material';
}

const LOOP_NODES = [
  { label: 'WASTE', sub: 'Generation', angle: 0 },
  { label: 'IDENTIFY', sub: 'Spectral Vision', angle: Math.PI / 3 },
  { label: 'MATCH', sub: 'Algorithmic Routing', angle: (2 * Math.PI) / 3 },
  { label: 'COLLECT', sub: 'Verified Hauling', angle: Math.PI },
  { label: 'PROCESS', sub: 'Mechanical Refine', angle: (4 * Math.PI) / 3 },
  { label: 'RECYCLE', sub: 'Circular Feedstock', angle: (5 * Math.PI) / 3 },
];

export const AnimatedHero: React.FC<Props> = ({ onListWaste, onExploreJourney }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(0);

  // Rotate active orbital loop stage
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LOOP_NODES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Initialize and run Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight * 0.85);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      setMousePos({ x: Math.round(mouse.targetX), y: Math.round(mouse.targetY) });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const particleColors = [
      '#238B57', // Eco Green
      '#53B978', // Fresh Green
      '#74A982', // Sage Green
      '#A8C5B2', // Soft Sage
      '#12372A', // Deep Forest
    ];

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const centerX = width > 768 ? width * 0.68 : width * 0.5;
      const centerY = height * 0.48;
      const baseRadius = Math.min(width, height) * 0.32;

      // 1. Orbital Ring Particles (metaphor for living material loop)
      const ringCount = 75;
      for (let i = 0; i < ringCount; i++) {
        const orbitRadius = baseRadius * (0.55 + Math.random() * 0.65);
        const orbitAngle = Math.random() * Math.PI * 2;
        const orbitSpeed = (0.0008 + Math.random() * 0.0016) * (Math.random() > 0.5 ? 1 : -1);
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];

        particles.push({
          x: centerX + Math.cos(orbitAngle) * orbitRadius,
          y: centerY + Math.sin(orbitAngle) * orbitRadius,
          originX: centerX,
          originY: centerY,
          vx: 0,
          vy: 0,
          radius: Math.random() < 0.25 ? 3 : Math.random() * 2 + 1,
          color,
          alpha: 0.3 + Math.random() * 0.5,
          orbitAngle,
          orbitRadius,
          orbitSpeed,
          type: Math.random() > 0.6 ? 'recycler' : 'material',
        });
      }

      // 2. Ambient material network nodes
      const ambientCount = 35;
      for (let i = 0; i < ambientCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.8 + 1,
          color: '#53B978',
          alpha: 0.2 + Math.random() * 0.35,
          orbitAngle: 0,
          orbitRadius: 0,
          orbitSpeed: 0,
          type: 'waste',
        });
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const centerX = width > 768 ? width * 0.68 : width * 0.5;
      const centerY = height * 0.48;
      const baseRadius = Math.min(width, height) * 0.32;

      // Draw subtle orbital rings (editorial Swiss design)
      ctx.save();
      ctx.strokeStyle = '#D9DDD5';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      // Inner orbital guide
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Main orbital loop
      ctx.strokeStyle = 'rgba(35, 139, 87, 0.22)';
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer orbital guide
      ctx.strokeStyle = 'rgba(217, 221, 213, 0.4)';
      ctx.setLineDash([2, 10]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Connect nearby particles with delicate environmental thread lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(35, 139, 87, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.orbitRadius > 0) {
          // Circular orbital motion
          p.orbitAngle += p.orbitSpeed;
          let targetX = p.originX + Math.cos(p.orbitAngle) * p.orbitRadius;
          let targetY = p.originY + Math.sin(p.orbitAngle) * p.orbitRadius;

          // Gentle mouse interaction (smooth displacement)
          const mdx = targetX - mouse.x;
          const mdy = targetY - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const maxRepel = 120;

          if (mDist < maxRepel && mDist > 0) {
            const force = (1 - mDist / maxRepel) * 22;
            targetX += (mdx / mDist) * force;
            targetY += (mdy / mDist) * force;
          }

          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
        } else {
          // Ambient drifting particles
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Draw particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Subtle halo on larger nodes
        if (p.radius >= 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh-4rem)] bg-[#F6F5EF] text-[#14221D] flex flex-col justify-between overflow-hidden"
    >
      {/* Background Architectural Blueprint Grid */}
      <div className="absolute inset-0 bg-grid-stone pointer-events-none opacity-50" />

      {/* Interactive Canvas Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle Orbital Stage Indicators (Desktop absolute overlay) */}
      <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-80 pointer-events-none">
        <div className="space-y-3 font-mono text-[11px]">
          {LOOP_NODES.map((node, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={node.label}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-x-2' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? 'bg-[#238B57] ring-4 ring-[#53B978]/30' : 'bg-[#D9DDD5]'
                  }`}
                />
                <span className="font-semibold tracking-wider text-[#12372A]">
                  0{idx + 1} {node.label}
                </span>
                <span className="text-[#556960] text-[10px]">— {node.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E5EFE8] border border-[#D9DDD5] text-[#12372A] text-xs font-mono font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#238B57] animate-pulse" />
            <span>CIRCULAR ECONOMY / MATERIAL NETWORK</span>
          </div>

          {/* Main Heading - Editorial Swiss style */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#12372A] leading-[1.05] mb-6">
            WASTE HAS <br />
            <span className="text-[#238B57] underline decoration-[#53B978]/40 decoration-4 underline-offset-8">
              A SECOND LIFE.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#32483E] leading-relaxed mb-8 max-w-xl">
            Connect waste with the right destination, track every material journey, and turn discarded
            resources into new value.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
            <button
              type="button"
              onClick={onListWaste}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-sm bg-[#12372A] hover:bg-[#238B57] text-[#F6F5EF] transition-colors duration-200 cursor-pointer shadow-sm group"
            >
              <span>LIST YOUR WASTE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={onExploreJourney}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-sm bg-transparent border border-[#12372A] hover:bg-[#E5EFE8] text-[#12372A] transition-colors duration-200 cursor-pointer"
            >
              <span>EXPLORE THE JOURNEY</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mouse coordinate interaction indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#556960]">
            <Compass className="w-3.5 h-3.5 text-[#238B57]" />
            <span className="uppercase tracking-widest font-semibold text-[#12372A]">
              MOVE TO EXPLORE
            </span>
            <span className="text-[#7D9187]">
              [{mousePos.x || '—'}, {mousePos.y || '—'}]
            </span>
          </div>
        </div>
      </div>

      {/* Hero Micro Information Strip (Prompt Section 8) */}
      <div className="relative z-10 border-t border-[#D9DDD5] bg-[#FFFFFF]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#7D9187] text-[10px] uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#238B57]" />
              LIVE MATERIAL PIPELINE
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#14221D]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12372A]">PLASTIC</span>
                <span className="text-[#556960] bg-[#E5EFE8] px-1.5 py-0.5 rounded text-[11px]">
                  500 KG
                </span>
              </div>

              <span className="text-[#7D9187] font-sans">→</span>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12372A]">MATCHED</span>
                <span className="text-[#238B57] font-semibold">4.2 KM</span>
              </div>

              <span className="text-[#7D9187] font-sans">→</span>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12372A]">PROCESSED</span>
                <span className="text-[#238B57] font-semibold">✓ VERIFIED</span>
              </div>

              <span className="text-[#7D9187] font-sans">→</span>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12372A]">REUSED</span>
                <span className="bg-[#12372A] text-[#F6F5EF] px-1.5 py-0.5 rounded text-[11px]">
                  rPET FLAKES
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
