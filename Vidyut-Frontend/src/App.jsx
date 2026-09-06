
import React, { useState } from 'react';
import { TransformationProvider } from './context/TransformationContext';
import { Preloader } from './Components/Preloader';
import { LogoReveal } from './Components/LogoReveal';
import VidyutWormholeHero from './Components/Wormhole/VidyutWormholeHero';
import { CustomCursor } from './Components/CustomCursor';
import { AmbientBackground } from './Components/AmbientBackground';
import { Navbar } from './Components/Navbar';
import { Hero } from './Components/Hero';
import { PassGenerator } from './Components/PassGenerator';
import { ShareModal } from './Components/ShareModal';

function FestApp() {
  const [appStage, setAppStage] = useState('preloader');
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Background Particle & Subtle Lighting Engine */}

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* Stage 1: Preloader Initialisation */}
      {appStage === 'preloader' && (
        <Preloader
          onComplete={() => setAppStage('vidyut-intro')}
        />
      )}

      {/* =========================================================
          STAGE 1: NEW VIDYUT CINEMATIC PHOTO INTRO
          ========================================================= */}
      {appStage === 'vidyut-intro' && (
        <VidyutIntro
          onComplete={() => setAppStage('grimoire-story')}
        />
      )}

      {/* =========================================================
          STAGE 2: ORIGINAL 3D BOOK / GRIMOIRE
          ========================================================= */}
      {appStage === 'grimoire-story' && (
        <VidyutWormholeHero onComplete={() => setAppStage('main')} />
      )}

      {/* =========================================================
          AMBIENT BACKGROUND
          Only starts with the main website.
          ========================================================= */}
      {appStage === 'main' && <AmbientBackground />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* =========================================================
          STAGE 3: MAIN VIDYUT WEBSITE
          ========================================================= */}
      <div
        className={`transition-opacity duration-1000 relative z-10 ${
          appStage === 'main'
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <Navbar isNavVisible={isNavVisible} />

        <main>
          <Hero
            onNavbarReady={() => setIsNavVisible(true)}
          />
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