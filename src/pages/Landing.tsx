import React from 'react';
import { AnimatedHero } from '../components/landing/AnimatedHero';

interface Props {
  navigate: (route: string) => void;
  onTryDemo: (role: 'business' | 'recycler' | 'citizen' | 'admin') => void;
}

export const Landing: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="bg-[#F6F5EF] text-[#14221D] selection:bg-[#53B978] selection:text-[#12372A]">
      {/* Hero Section (Orbital Particle Network + Bottom Micro Info Strip) */}
      <AnimatedHero
        onListWaste={() => navigate('/list-waste')}
        onExploreJourney={() => navigate('/how-it-works')}
      />
    </div>
  );
};

export default Landing;
