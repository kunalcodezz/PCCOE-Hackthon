"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  PlusCircle,
  Layers,
  Search,
  Package,
  Factory,
  ShieldAlert,
  QrCode,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, route: "/dashboard" },
  { label: "List", icon: PlusCircle, route: "/list-waste" },
  { label: "Matches", icon: Layers, route: "/matches" },
  { label: "Map", icon: MapPin, route: "/map" },
  { label: "Track", icon: Search, route: "/track/WST-PUN-00124" },
  { label: "Listings", icon: Package, route: "/my-listings" },
];

const RECYCLER_NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, route: "/dashboard" },
  { label: "Market", icon: Layers, route: "/recycler/marketplace" },
  { label: "Process", icon: Factory, route: "/recycler/processing" },
  { label: "Track", icon: Search, route: "/track/WST-PUN-00124" },
  { label: "Passport", icon: QrCode, route: "/passport/WST-PUN-00124" },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, route: "/dashboard" },
  { label: "Radar", icon: ShieldAlert, route: "/admin/dashboard" },
  { label: "Listings", icon: Package, route: "/my-listings" },
  { label: "Track", icon: Search, route: "/track/WST-PUN-00124" },
  { label: "Passport", icon: QrCode, route: "/passport/WST-PUN-00124" },
];

const MOBILE_LABEL_WIDTH = 72;

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  items?: NavItem[];
  userRole?: string;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  currentRoute,
  onNavigate,
  items,
  userRole,
}: BottomNavBarProps) {
  // Determine appropriate nav items based on role or explicit props
  const navItems = items || (
    userRole === "recycler"
      ? RECYCLER_NAV_ITEMS
      : userRole === "admin"
      ? ADMIN_NAV_ITEMS
      : DEFAULT_NAV_ITEMS
  );

  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  // Synchronize active tab with the current application route
  useEffect(() => {
    if (!currentRoute) return;

    const matchedIdx = navItems.findIndex((item) => {
      if (item.route === "/" || item.route === "/dashboard") {
        return currentRoute === "/" || currentRoute === "/dashboard" || currentRoute === "/how-it-works" || currentRoute === "/impact";
      }
      if (item.route.startsWith("/track")) {
        return currentRoute.startsWith("/track");
      }
      if (item.route.startsWith("/passport")) {
        return currentRoute.startsWith("/passport");
      }
      return currentRoute === item.route || currentRoute.startsWith(item.route);
    });

    if (matchedIdx !== -1) {
      setActiveIndex(matchedIdx);
    }
  }, [currentRoute, navItems]);

  const handleItemClick = (idx: number, route: string) => {
    setActiveIndex(idx);
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.history.pushState({}, "", route);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className={cn(
        "bg-white/95 backdrop-blur-md border border-slate-200 rounded-full flex items-center p-1.5 sm:p-2 shadow-xl space-x-1 min-w-[320px] max-w-[95vw] h-[52px] pointer-events-auto",
        stickyBottom && "fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] mx-auto z-40 w-fit",
        className,
      )}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "flex items-center gap-0 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px] cursor-pointer",
              isActive
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs gap-1.5 sm:gap-2"
                : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
            )}
            onClick={() => handleItemClick(idx, item.route)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            type="button"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 2}
              aria-hidden="true"
              className={cn(
                "transition-colors duration-200 shrink-0",
                isActive ? "text-emerald-700" : "text-slate-500",
              )}
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className="overflow-hidden flex items-center max-w-[72px]"
            >
              <span
                className={cn(
                  "font-semibold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,0.75rem)] leading-none",
                  isActive
                    ? "text-emerald-800 font-bold"
                    : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
