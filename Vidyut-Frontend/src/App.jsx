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
import CinematicLanding from './components/CinematicLanding';

function FestApp() {
  // Cinematic flow:
  // landing -> preloader -> logo-reveal -> grimoire-story -> main
  const [appStage, setAppStage] = useState('landing');
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">

      {/* =========================================================
          STAGE 0: CINEMATIC VIDYUT LANDING PAGE
          ========================================================= */}
      {appStage === 'landing' && (
        <CinematicLanding
          onEnter={() => setAppStage('preloader')}
        />
      )}

      {/* =========================================================
          BACKGROUND PARTICLE & SUBTLE LIGHTING ENGINE
          
          Hidden during the cinematic landing page so the old
          particle dots do not appear over the new hero artwork.
          
          It automatically returns after leaving the landing page.
          ========================================================= */}
      {appStage !== 'landing' && <AmbientBackground />}

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* =========================================================
          STAGE 1: PRELOADER INITIALISATION
          ========================================================= */}
      {appStage === 'preloader' && (
        <Preloader
          onComplete={() => setAppStage('logo-reveal')}
        />
      )}

      {/* =========================================================
          STAGE 2: LOGO REVEAL INTERSTITIAL
          ========================================================= */}
      {appStage === 'logo-reveal' && (
        <LogoReveal
          onEnter={() => setAppStage('grimoire-story')}
        />
      )}

      {/* =========================================================
          STAGE 3: ANCIENT JAPANESE GRIMOIRE STORY MODE
          ========================================================= */}
      {appStage === 'grimoire-story' && (
        <JapaneseGrimoire
          onComplete={() => setAppStage('main')}
        />
      )}

      {/* =========================================================
          STAGE 4: MAIN VIDYUT WEBSITE
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

      {/* =========================================================
          INTERACTIVE MODALS
          ========================================================= */}
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