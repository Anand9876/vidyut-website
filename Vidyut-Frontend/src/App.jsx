import React, { useState } from 'react';

import { TransformationProvider } from './context/TransformationContext';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PassGenerator } from './components/PassGenerator';
import { ShareModal } from './components/ShareModal';

// Teammate's original VidyutIntro
import { VidyutIntro } from './components/VidyutIntro';

// Our cinematic intro
import MVidyutIntro from './components/VidyutIntroM/page';

import { RippleTransition } from './components/RippleTransition';


function FestApp() {
  const [appStage, setAppStage] = useState('preloader');
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-x-hidden">

      {/* Background Particle & Subtle Lighting Engine */}

      {/* Custom Precision Cursor */}
      <CustomCursor />

      {/* =========================================================
          STAGE 0: PRELOADER
          ========================================================= */}
      {appStage === 'preloader' && (
        <Preloader
          onComplete={() => setAppStage('vidyut-intro')}
        />
      )}

      {/* =========================================================
          STAGE 1: OUR NEW VIDYUT CINEMATIC PHOTO INTRO
          ========================================================= */}
      {appStage === 'vidyut-intro' && (
        <MVidyutIntro
          onComplete={() => setAppStage('ripple-transition')}
        />
      )}

      {/* =========================================================
          STAGE 2: RIPPLE TRANSITION
          ========================================================= */}
      {appStage === 'ripple-transition' && (
        <RippleTransition 
          onComplete={() => setAppStage('main')}
        />
      )}

      {/* =========================================================
          AMBIENT BACKGROUND
          Only starts with the main website.
          ========================================================= */}
      {appStage === 'main' && <AmbientBackground />}

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