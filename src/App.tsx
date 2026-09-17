import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { DEMO_USERS, wasteStore } from './services/wasteService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ListWaste } from './pages/ListWaste';
import { MyListings } from './pages/MyListings';
import { Matches } from './pages/Matches';
import { WasteTracking } from './pages/WasteTracking';
import { WastePassport } from './pages/WastePassport';
import { VerifyWaste } from './pages/VerifyWaste';
import { RecyclerMarketplace } from './pages/RecyclerMarketplace';
import { RecyclerProcessing } from './pages/RecyclerProcessing';
import { AdminDashboard } from './pages/AdminDashboard';
import { HowItWorks } from './pages/HowItWorks';
import { MapPage } from './pages/MapPage';
import { BottomNavBar } from './components/ui/bottom-nav-bar';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('business');
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.business);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(DEMO_USERS[role] || DEMO_USERS.business);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo listings, batches, and transactions back to initial state?')) {
      wasteStore.resetToInitialSeed();
      handleSelectRole(currentRole);
      navigate('/');
    }
  };

  const renderRouteContent = () => {
    if (currentRoute.startsWith('/verify/')) {
      const wasteId = currentRoute.replace('/verify/', '') || 'WST-PUN-00124';
      return <VerifyWaste wasteId={wasteId} navigate={navigate} />;
    }

    if (currentRoute.startsWith('/track/')) {
      const wasteId = currentRoute.replace('/track/', '') || 'WST-PUN-00124';
      return <WasteTracking wasteId={wasteId} currentUser={currentUser} navigate={navigate} />;
    }

    if (currentRoute.startsWith('/passport/')) {
      const wasteId = currentRoute.replace('/passport/', '') || 'WST-PUN-00124';
      return <WastePassport wasteId={wasteId} currentUser={currentUser} navigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
        return (
          <Landing
            navigate={navigate}
            onTryDemo={(role) => {
              handleSelectRole(role);
              navigate('/dashboard');
            }}
          />
        );
      case '/how-it-works':
        return <HowItWorks navigate={navigate} />;
      case '/dashboard':
      case '/impact':
        return <Dashboard currentUser={currentUser} navigate={navigate} />;
      case '/list-waste':
        return <ListWaste currentUser={currentUser} navigate={navigate} />;
      case '/my-listings':
        return <MyListings currentUser={currentUser} navigate={navigate} />;
      case '/matches':
        return <Matches currentUser={currentUser} navigate={navigate} />;
      case '/recycler/marketplace':
        return <RecyclerMarketplace currentUser={currentUser} navigate={navigate} />;
      case '/recycler/processing':
        return <RecyclerProcessing currentUser={currentUser} navigate={navigate} />;
      case '/admin/dashboard':
        return <AdminDashboard currentUser={currentUser} navigate={navigate} />;
      case '/map':
        return <MapPage navigate={navigate} />;
      default:
        return <Dashboard currentUser={currentUser} navigate={navigate} />;
    }
  };

  const isPublicVerificationRoute = currentRoute.startsWith('/verify/');

  if (isPublicVerificationRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {renderRouteContent()}
      </div>
    );
  }

  const isLandingPage = currentRoute === '/' || currentRoute === '/how-it-works';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        activeRoute={currentRoute}
        navigate={navigate}
        onResetDemo={handleResetDemo}
      />

      {isLandingPage ? (
        <main className="flex-1 pb-20 lg:pb-0">{renderRouteContent()}</main>
      ) : (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6 pb-20 lg:pb-6">
          <Sidebar currentRoute={currentRoute} navigate={navigate} userRole={currentUser.role} />
          <main className="flex-1 min-w-0">{renderRouteContent()}</main>
        </div>
      )}

      <BottomNavBar
        stickyBottom
        className="lg:hidden"
        currentRoute={currentRoute}
        onNavigate={navigate}
        userRole={currentUser.role}
      />

      {!isLandingPage && (
        <footer className="bg-white border-t border-[#D9DDD5] py-6 text-xs text-[#556960] pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#12372A]">RE:LOOP</span>
              <span>•</span>
              <span>Digital Infrastructure for Circular Economy &amp; Waste Traceability</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#7D9187]">
              <span>SHA-256 Merkle Ledger</span>
              <span>•</span>
              <span>ISO/TC 323 Ready</span>
              <span>•</span>
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-[#C2413B] hover:underline cursor-pointer"
              >
                Reset Sandbox
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
