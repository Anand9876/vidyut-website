import { useState, useEffect, useRef } from "react";
import "./DarkExperience.css";

type Stage = "loader" | "mandala" | "title" | "interactive";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
}

export default function DarkOfficialIntro() {
  const [stage, setStage] = useState<Stage>("loader");
  const [progress, setProgress] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background ambient floating dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Progression manager
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStage("mandala"), 300);
          return 100;
        }
        return prev + 1;
      });
    }, 22);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (stage === "mandala") {
      const t1 = setTimeout(() => setStage("title"), 1600);
      return () => clearTimeout(t1);
    }
    if (stage === "title") {
      const t2 = setTimeout(() => setStage("interactive"), 1700);
      return () => clearTimeout(t2);
    }
  }, [stage]);

  const curveLength = 260;
  const strokeOffset = curveLength - (progress / 100) * curveLength;

  return (
    <div className="dark-universe">
      <canvas ref={canvasRef} className="dust-canvas" />

      {/* Top Header Controls */}
      <header className="dark-header">
        <div className="hamburger">
          <span></span>
          <span></span>
        </div>
        {stage === "interactive" && <div className="brand-header">D A R K</div>}
        {stage === "interactive" && <button className="close-btn">✕</button>}
      </header>

      {/* Main Experience Viewport */}
      <main className="dark-core">
        {stage === "loader" && (
          <div className="stage-block fade-in">
            <svg viewBox="0 0 100 60" className="curve-loader-svg">
              <path
                d="M 15,45 C 15,15 50,15 50,30 C 50,45 85,45 85,15"
                fill="none"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray={curveLength}
                style={{ strokeDashoffset: strokeOffset }}
              />
            </svg>
            <div className="counter-label">{progress}%</div>
          </div>
        )}

        {stage === "mandala" && (
          <div className="stage-block fade-in">
            <svg viewBox="0 0 200 200" className="mandala-svg">
              <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="0.8" fill="none" />
              {[...Array(8)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 45} 100 100)`}>
                  <path d="M 100,50 L 92,68 L 108,68 Z" stroke="white" strokeWidth="1" fill="none" />
                  <path d="M 92,68 L 82,85 L 118,85 L 108,68" stroke="white" strokeWidth="0.9" fill="none" />
                  <circle cx="100" cy="38" r="3.5" stroke="white" strokeWidth="0.8" fill="none" />
                </g>
              ))}
              <path d="M 30,90 L 30,100 L 40,100" stroke="white" strokeWidth="1" fill="none" />
              <path d="M 170,90 L 170,100 L 160,100" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </div>
        )}

        {stage === "title" && (
          <div className="stage-block fade-in">
            <h1 className="series-title">
              D A <span className="reverse-r">R</span> K
            </h1>
          </div>
        )}

        {stage === "interactive" && (
          <div className="stage-block timeline-interface fade-in">
            {/* Multi-cycle Time Loop Axis */}
            <div className="timeline-graphic">
              <svg viewBox="0 0 440 160" className="loops-svg">
                <line x1="20" y1="80" x2="420" y2="80" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <circle cx="60" cy="80" r="2.5" fill="white" />
                <ellipse cx="150" cy="80" rx="40" ry="28" stroke="white" strokeWidth="1.2" fill="none" />
                <ellipse cx="220" cy="80" rx="55" ry="38" stroke="white" strokeWidth="1.2" fill="none" />
                <ellipse cx="270" cy="80" rx="70" ry="45" stroke="white" strokeWidth="1.2" fill="none" />
                <line x1="220" y1="35" x2="220" y2="125" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
              </svg>
            </div>

            {/* Triquetra Season Nodes */}
            <div className="triquetra-knot">
              <svg viewBox="0 0 100 95" className="knot-svg">
                <circle cx="50" cy="38" r="22" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
                <circle cx="38" cy="58" r="22" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
                <circle cx="62" cy="58" r="22" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
              </svg>
              <button
                className={`knot-node season-1 ${selectedSeason === 1 ? "active" : ""}`}
                onClick={() => setSelectedSeason(1)}
              >
                1
              </button>
              <button
                className={`knot-node season-2 ${selectedSeason === 2 ? "active" : ""}`}
                onClick={() => setSelectedSeason(2)}
              >
                2
              </button>
              <button
                className={`knot-node season-3 ${selectedSeason === 3 ? "active" : ""}`}
                onClick={() => setSelectedSeason(3)}
              >
                3
              </button>
            </div>

            {/* Season Episode Select Bar */}
            <div className="episode-selector-bar">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((ep) => (
                <button
                  key={ep}
                  className={`ep-pill ${selectedEpisode === ep ? "selected" : ""}`}
                  onClick={() => setSelectedEpisode(ep)}
                >
                  {ep}
                </button>
              ))}
            </div>

            {/* Action CTA */}
            <button className="continue-cta">CONTINUE</button>
          </div>
        )}
      </main>

      {/* Footer Meta Labels */}
      <footer className="dark-footer">
        <span className="footer-tag">LANGUAGE</span>
        <span className="footer-tag">
          EPISODES <span className="bars">||||</span>
        </span>
      </footer>
    </div>
  );
}