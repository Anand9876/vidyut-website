
import React, { useState } from 'react';
import { TransformationProvider } from './context/TransformationContext';
<<<<<<< Updated upstream

import { Preloader } from './components/Preloader';
import { JapaneseGrimoire } from './components/JapaneseGrimoire';
import { CustomCursor } from './components/CustomCursor';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PassGenerator } from './components/PassGenerator';
import { ShareModal } from './components/ShareModal';
import VidyutIntro from './components/VidyutIntro';
=======
import { Preloader } from './Components/Preloader';
import { LogoReveal } from './Components/LogoReveal';
import VidyutWormholeHero from './Components/Wormhole/VidyutWormholeHero';
import { CustomCursor } from './Components/CustomCursor';
import { AmbientBackground } from './Components/AmbientBackground';
import { Navbar } from './Components/Navbar';
import { Hero } from './Components/Hero';
import { PassGenerator } from './Components/PassGenerator';
import { ShareModal } from './Components/ShareModal';
>>>>>>> Stashed changes

function FestApp() {
  const [appStage, setAppStage] = useState('preloader');
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">
<<<<<<< Updated upstream
=======
      {/* Background Particle & Subtle Lighting Engine */}
      {/* <AmbientBackground /> */}
>>>>>>> Stashed changes

      {/* =========================================================
          STAGE 0: PRELOADER
          ========================================================= */}
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
        <JapaneseGrimoire
          onComplete={() => setAppStage('main')}
        />
      )}

      {/* =========================================================
          AMBIENT BACKGROUND
          Only starts with the main website.
          ========================================================= */}
      {appStage === 'main' && <AmbientBackground />}

      {/* Custom Cursor */}
      <CustomCursor />

<<<<<<< Updated upstream
      {/* =========================================================
          STAGE 3: MAIN VIDYUT WEBSITE
          ========================================================= */}
=======
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
        <VidyutWormholeHero onComplete={() => setAppStage('main')} />
      )}

      {/* Stage 4: Core Website with Choreographed Hero & Navbar Entrance */}
>>>>>>> Stashed changes
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