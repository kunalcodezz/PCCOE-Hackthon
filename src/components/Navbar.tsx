import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/wasteService';
import {
  Menu,
  X,
  ChevronDown,
  RotateCcw,
  Building2,
  Factory,
  Shield,
  User as UserIcon,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
  activeRoute: string;
  navigate: (route: string) => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  onSelectRole,
  activeRoute,
  navigate,
  onResetDemo,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode }> = {
    citizen: { label: 'Citizen', icon: <UserIcon className="w-3 h-3" /> },
    business: { label: 'Business', icon: <Building2 className="w-3 h-3" /> },
    recycler: { label: 'Recycler', icon: <Factory className="w-3 h-3" /> },
    ngo: { label: 'NGO', icon: <Sparkles className="w-3 h-3" /> },
    admin: { label: 'Admin', icon: <Shield className="w-3 h-3" /> },
  };

  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.business;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };

    if (roleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleDropdownOpen]);

  const scrollToSection = (id: string, fallbackRoute: string) => {
    if (activeRoute === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(fallbackRoute);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F6F5EF]/90 backdrop-blur-md border-b border-[#D9DDD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <span className="w-5 h-5 rounded-full border-2 border-[#12372A] border-t-[#53B978] transition-transform group-hover:rotate-180 duration-500 inline-block" />
              <span className="font-extrabold text-lg tracking-tight text-[#12372A] font-sans">
                RE:LOOP
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-semibold text-[#32483E]">
              <button
                type="button"
                onClick={() => scrollToSection('flow', '/how-it-works')}
                className="hover:text-[#12372A] hover:underline underline-offset-4 decoration-[#238B57] transition-colors cursor-pointer"
              >
                FLOW
              </button>
              <button
                type="button"
                onClick={() => navigate('/matches')}
                className={`hover:text-[#12372A] hover:underline underline-offset-4 decoration-[#238B57] transition-colors cursor-pointer ${
                  activeRoute.startsWith('/matches') || activeRoute.startsWith('/dashboard')
                    ? 'text-[#12372A] font-bold underline'
                    : ''
                }`}
              >
                MARKET
              </button>
              <button
                type="button"
                onClick={() => navigate('/map')}
                className={`hover:text-[#12372A] hover:underline underline-offset-4 decoration-[#238B57] transition-colors cursor-pointer ${
                  activeRoute === '/map'
                    ? 'text-[#12372A] font-bold underline'
                    : ''
                }`}
              >
                MAP
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('passport', '/verify/WST-PUN-00124')}
                className={`hover:text-[#12372A] hover:underline underline-offset-4 decoration-[#238B57] transition-colors cursor-pointer ${
                  activeRoute.startsWith('/verify') || activeRoute.startsWith('/passport')
                    ? 'text-[#12372A] font-bold underline'
                    : ''
                }`}
              >
                PASSPORT
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('impact', '/impact')}
                className={`hover:text-[#12372A] hover:underline underline-offset-4 decoration-[#238B57] transition-colors cursor-pointer ${
                  activeRoute === '/impact' ? 'text-[#12372A] font-bold underline' : ''
                }`}
              >
                IMPACT
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-xs border border-[#D9DDD5] bg-[#FFFFFF] hover:border-[#12372A] text-[#12372A] transition cursor-pointer shadow-2xs"
              >
                {currentRoleInfo.icon}
                <span>SIGN IN : {currentRoleInfo.label.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-[#7D9187]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#D9DDD5] rounded-xs shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-mono text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#7D9187] uppercase tracking-wider border-b border-[#D9DDD5] mb-1">
                    Select Persona Demo
                  </div>
                  {(['business', 'recycler'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onSelectRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#F6F5EF] transition cursor-pointer ${
                        currentUser.role === r ? 'text-[#238B57] bg-[#E5EFE8] font-bold' : 'text-[#14221D]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {roleLabels[r].icon}
                        <span>{DEMO_USERS[r]?.name || r}</span>
                      </div>
                      <span className="text-[10px] text-[#7D9187] capitalize">{r}</span>
                    </button>
                  ))}
                  <div className="border-t border-[#D9DDD5] my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemo();
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#C2413B] hover:bg-[#FEE2E2] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Sandbox Data</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/list-waste')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-xs bg-[#12372A] hover:bg-[#238B57] text-[#F6F5EF] transition-colors cursor-pointer shadow-xs"
            >
              <span>LIST WASTE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xs text-[#12372A] hover:bg-[#E5EFE8]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D9DDD5] py-4 space-y-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                scrollToSection('flow', '/how-it-works');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#12372A] hover:bg-[#E5EFE8] rounded-xs font-semibold"
            >
              FLOW
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/matches');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#12372A] hover:bg-[#E5EFE8] rounded-xs font-semibold"
            >
              MARKET
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/map');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#12372A] hover:bg-[#E5EFE8] rounded-xs font-semibold"
            >
              MAP
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToSection('passport', '/verify/WST-PUN-00124');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#12372A] hover:bg-[#E5EFE8] rounded-xs font-semibold"
            >
              PASSPORT
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToSection('impact', '/impact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#12372A] hover:bg-[#E5EFE8] rounded-xs font-semibold"
            >
              IMPACT
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#238B57] hover:bg-[#E5EFE8] rounded-xs font-bold"
            >
              PORTAL DASHBOARD →
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
