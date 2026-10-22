import React, { useState, useCallback, useEffect } from 'react';

import { TransformationProvider } from './context/TransformationContext';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { AmbientBackground } from './components/AmbientBackground';
import { Hero } from './components/Hero';
import { History } from './components/History';
import { PassGenerator } from './components/PassGenerator';
import { ShareModal } from './components/ShareModal';

import MVidyutIntro from './components/VidyutIntroM/page';
import { RippleTransition } from './components/RippleTransition';

function FestApp() {
  const [appStage, setAppStage] = useState('preloader');

  // Normal intro completion: show the ripple.
  const handleIntroComplete = useCallback(() => {
    setAppStage(current =>
      current === 'vidyut-intro'
        ? 'ripple-transition'
        : current
    );
  }, []);

  // Skip button: go directly to the main website.
  const handleSkipIntro = useCallback(() => {
    setAppStage(current =>
      current === 'vidyut-intro' ? 'main' : current
    );
  }, []);

  // Show the main website immediately after the ripple finishes.
  const handleRippleComplete = useCallback(() => {
    setAppStage(current =>
      current === 'ripple-transition' ? 'main' : current
    );
  }, []);

  // Once the main website is showing, make sure nothing left over from the
  // preloader / intro / ripple stages is blocking page scroll.
  //
  // IMPORTANT: only <html> may carry an overflow rule. If <body> gets
  // overflow-y: auto (or hidden / scroll), body turns into its own scroll
  // container and `position: sticky` stops working everywhere on the page,
  // which is what stopped the History section from pinning.
  useEffect(() => {
    if (appStage !== 'main') return undefined;

    const unlock = () => {
      const root = document.documentElement;
      const body = document.body;
      root.classList.remove('overflow-hidden');
      body.classList.remove('overflow-hidden');

      root.style.setProperty('overflow-y', 'auto', 'important');
      root.style.setProperty('height', 'auto', 'important');

      // body must NOT be a scroll container
      body.style.setProperty('overflow-y', 'visible', 'important');
      body.style.setProperty('height', 'auto', 'important');
      body.style.setProperty('position', 'static', 'important');
      body.style.setProperty('touch-action', 'auto', 'important');
    };

    unlock();
    const timer = setTimeout(unlock, 1500);
    return () => clearTimeout(timer);
  }, [appStage]);

  return (
    // overflow-x-clip (not hidden) so the sticky History section can stick
    <div className="relative min-h-screen overflow-x-clip bg-black text-white selection:bg-white selection:text-black">

      <CustomCursor />

      {/* STAGE 0: PRELOADER */}
      {appStage === 'preloader' && (
        <Preloader
          onComplete={() => setAppStage('vidyut-intro')}
        />
      )}

      {/* STAGE 1: CINEMATIC VIDYUT INTRO */}
      {appStage === 'vidyut-intro' && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleIntroComplete}
        >
          <MVidyutIntro
            onComplete={handleIntroComplete}
          />

          {/* SKIP INTRO BUTTON */}
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              handleSkipIntro();
            }}
            className="fixed right-6 top-6 z-[100] rounded-full border border-cyan-300/60 bg-black/70 px-5 py-3 font-mono text-xs font-bold tracking-[0.2em] text-cyan-200 backdrop-blur-md transition-all duration-300 hover:border-cyan-200 hover:bg-cyan-300 hover:text-black sm:right-10 sm:top-8 sm:px-7 sm:py-3.5 sm:text-sm"
            aria-label="Skip intro and go to the main Vidyut website"
          >
            SKIP INTRO <span className="ml-2">↗</span>
          </button>
        </div>
      )}

      {/* STAGE 2: RIPPLE TRANSITION */}
      {appStage === 'ripple-transition' && (
        <RippleTransition
          onComplete={handleRippleComplete}
        />
      )}

      {/* STAGE 3: MAIN WEBSITE */}
      {appStage === 'main' && (
        <>
          <AmbientBackground />

          <div className="relative z-10">
            <main>
              <Hero
                start={true}
                onNavbarReady={() => {}}
              />
              <History />
            </main>
          </div>

          <PassGenerator />
          <ShareModal />
        </>
      )}

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