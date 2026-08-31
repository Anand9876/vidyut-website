import React, { useState } from 'react';
import { TransformationProvider } from './context/TransformationContext';
import { Preloader } from './components/Preloader';
import { LogoReveal } from './components/LogoReveal';
import { JapaneseGrimoire } from './components/JapaneseGrimoire';
import { CustomCursor } from './components/CustomCursor';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PassGenerator } from './components/PassGenerator';
import { ShareModal } from './components/ShareModal';

function FestApp() {
  // 4-Stage Cinematic Flow: 'preloader' -> 'logo-reveal' -> 'grimoire-story' -> 'main'
  const [appStage, setAppStage] = useState('preloader');
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Background Particle & Subtle Lighting Engine */}
      <AmbientBackground />

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* Stage 1: Preloader Initialisation */}
      {appStage === 'preloader' && (
        <Preloader onComplete={() => setAppStage('logo-reveal')} />
      )}

      {/* Stage 2: Logo Reveal Interstitial (Logo animates first, then tap prompt) */}
      {appStage === 'logo-reveal' && (
        <LogoReveal onEnter={() => setAppStage('grimoire-story')} />
      )}

      {/* Stage 3: Ancient Japanese Grimoire Story Mode (3D Tome Unsealing & 5 Spreads) */}
      {appStage === 'grimoire-story' && (
        <JapaneseGrimoire onComplete={() => setAppStage('main')} />
      )}

      {/* Stage 4: Core Website with Choreographed Hero & Navbar Entrance */}
      <div
        className={`transition-opacity duration-1000 relative z-10 ${
          appStage === 'main' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Navbar isNavVisible={isNavVisible} />
        <main>
          <Hero onNavbarReady={() => setIsNavVisible(true)} />
        </main>
      </div>

      {/* Interactive Modals */}
      <PassGenerator />
      <ShareModal />
    </div>
  );
}

export default function App() {
  return (
    <TransformationProvider>
      <FestApp />
    </TransformationProvider>
  );
}
