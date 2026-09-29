import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Heart } from 'lucide-react';
import { useTransformation } from '../context/TransformationContext';
import { ShowInterestModal } from './ShowInterestModal';

// ================= FEST LANDSCAPE BACKGROUND (realistic pass) =================
// DROP-IN: replace everything from the "FEST LANDSCAPE BACKGROUND" comment down to
// the end of `const InteractiveBackground` in Hero.jsx with this block.
// Imports (useEffect, useRef) and the rest of the file stay unchanged.
//
// What changed: milky-way + moon + horizon light pollution, atmospheric depth on the
// skyline, detailed Ferris wheel, real stage (speaker stacks, truss, LED screen with
// scanlines, DJ silhouette), soft volumetric beams + glowing lasers, fireworks with
// glitter and sky flash, branching lightning, crowd silhouettes with shoulders/necks/
// two-segment arms, stage rim-lighting, phones + glowsticks, haze, camera bokeh, film grain.
const PAL = ['0,240,255', '139,92,246', '255,0,127', '56,130,255', '255,225,120'];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = () => PAL[Math.floor(rand(0, PAL.length))];
const TAU = Math.PI * 2;
const rgba = (c, a) => `rgba(${c},${a})`;

const InteractiveBackground = () => {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, hz = 0, raf = 0, last = 0, t = 0, nextFw = 1200;
    let stars = [], far = [], blds = [], crowd = [], fogs = [], beams = [], bokeh = [];
    let rockets = [], parts = [], bolts = [], bursts = [];
    let jump = 0, flash = 0, grain = null, bc = null, bx = null, lowQ = false, motes = [];
    const ptr = { x: 0, y: 0, nx: 0, ny: 0, active: false };
    const cam = { x: 0, y: 0 };

    const stageBox = () => {
      const sw = Math.min(w * 0.46, 620), th = Math.min(h * 0.2, 170);
      return { sx: w / 2 - cam.x * 6, sw, th };
    };

    const makeGrain = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const gx = c.getContext('2d');
      const im = gx.createImageData(160, 160);
      for (let i = 0; i < im.data.length; i += 4) {
        im.data[i] = im.data[i + 1] = im.data[i + 2] = 120 + Math.random() * 135;
        im.data[i + 3] = Math.random() * 38;
      }
      gx.putImageData(im, 0, 0);
      return ctx.createPattern(c, 'repeat');
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight; hz = h * 0.64;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 170 }, () => ({
        x: rand(0, w), y: rand(0, hz * 0.92), p: rand(0, TAU),
        r: Math.random() < 0.1 ? rand(1.4, 2) : rand(0.5, 1.2),
        tint: Math.random() < 0.2 ? '180,200,255' : '255,255,255',
      }));
      far = [];
      for (let x = -40; x < w + 40;) {
        const bw = rand(30, 80);
        far.push({ x, w: bw, h: rand(10, 34) * (h / 800 + 0.4) });
        x += bw + rand(0, 6);
      }
      blds = [];
      for (let x = -40; x < w + 40;) {
        const bw = rand(24, 60);
        blds.push({ x, w: bw, h: rand(14, 52) * (h / 800 + 0.4), win: Math.floor(rand(0, 6)) });
        x += bw + rand(0, 10);
      }
      crowd = [0.55, 0.85, 1.3].map((s) => {
        const arr = [];
        for (let x = -90; x < w + 90; x += 44 * s * rand(0.8, 1.2)) {
          const arm = Math.random() < 0.55 ? (Math.random() < 0.5 ? 1 : 2) : 0;
          const q = Math.random();
          arr.push({
            x, ph: rand(0, 6.2), arm, s: s * rand(0.9, 1.1),
            side: Math.random() < 0.5 ? -1 : 1,
            item: arm ? (q < 0.1 ? 1 : q < 0.2 ? 2 : 0) : 0,
            rc: Math.random() < 0.5 ? '0,240,255' : '255,0,127',
          });
        }
        return arr;
      });
      fogs = Array.from({ length: 8 }, () => ({
        x: rand(0, w), y: hz + rand(-30, 40), r: rand(160, 340), v: rand(0.01, 0.03),
        c: ['139,92,246', '0,240,255', '255,0,127'][Math.floor(rand(0, 3))],
      }));
      beams = Array.from({ length: 7 }, (_, i) => ({ ang: -Math.PI / 2, c: PAL[i % 4] }));
      bokeh = Array.from({ length: 16 }, () => ({ x: rand(0, w), y: rand(hz - 20, h), r: rand(10, 34), c: pick(), ph: rand(0, TAU) }));
      grain = makeGrain();
      bc = document.createElement('canvas');
      bc.width = Math.max(1, Math.ceil(w / 8)); bc.height = Math.max(1, Math.ceil(h / 8));
      bx = bc.getContext('2d');
      motes = Array.from({ length: 80 }, () => ({ x: rand(0, w), y: rand(0, hz), vx: rand(-0.01, 0.01), vy: rand(-0.012, 0.004), r: rand(0.8, 1.8), ph: rand(0, TAU) }));
      rockets = []; parts = []; bolts = []; bursts = [];
      if (reduced) draw(0);
    };

    // anamorphic lens streak: a thin horizontal light bar
    const streak = (x, y, len, c, a) => {
      const sg = ctx.createLinearGradient(x - len, 0, x + len, 0);
      sg.addColorStop(0, rgba(c, 0)); sg.addColorStop(0.5, rgba(c, a)); sg.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = sg; ctx.fillRect(x - len, y - 1, len * 2, 2);
    };

    const setPointer = (e) => {
      const b = cv.getBoundingClientRect();
      ptr.x = e.clientX - b.left; ptr.y = e.clientY - b.top;
      ptr.nx = (ptr.x / b.width) * 2 - 1; ptr.ny = (ptr.y / b.height) * 2 - 1;
      ptr.active = ptr.y >= 0 && ptr.y <= b.height;
    };

    const launch = (tx, ty) => {
      const { sx, sw, th } = stageBox();
      const x0 = sx + rand(-sw / 3, sw / 3), y0 = hz - th;
      rockets.push({ x0, y0, tx, ty, k: 0, c: pick(), px: x0, py: y0 });
    };

    const strike = (x, y) => {
      const pts = [[x + rand(-70, 70), 0]];
      const n = 12;
      for (let i = 1; i <= n; i++) pts.push([x + (i === n ? 0 : rand(-26, 26)) * (1 - i / n) + (pts[0][0] - x) * (1 - i / n), (y * i) / n]);
      const segs = [pts];
      for (let b = 0; b < 2; b++) {
        let [bx, by] = pts[Math.floor(rand(3, 8))];
        const dir = Math.random() < 0.5 ? -1 : 1, br = [[bx, by]];
        for (let i = 0; i < 4; i++) { bx += dir * rand(6, 20); by += rand(10, 22); if (by > y) break; br.push([bx, by]); }
        if (br.length > 1) segs.push(br);
      }
      bolts.push({ segs, life: 1 });
    };

    const onDown = (e) => {
      setPointer(e);
      if (!ptr.active) return;
      const ty = Math.min(ptr.y, hz * 0.75);
      launch(ptr.x, ty); strike(ptr.x, ty);
      jump = 1; flash = 1;
    };
    const onLeave = () => { ptr.active = false; };

    function draw(dt) {
      t += dt;
      const beat = (t % 508) / 508;
      const pulse = Math.min(1.4, Math.exp(-beat * 4) + flash * 0.6);
      jump *= 0.95; flash *= 0.93;
      cam.x += ((ptr.active ? ptr.nx : Math.sin(t * 0.0002) * 0.4) - cam.x) * 0.04;
      const { sx, sw, th } = stageBox();
      const topY = hz - th - 10;
      const u = th / 170;
      let g;

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.lineCap = 'butt';

      // ---- sky: gradient, milky way, stars, moon ----
      g = ctx.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, '#01010a'); g.addColorStop(0.45, '#080622'); g.addColorStop(0.8, '#1d0d45'); g.addColorStop(1, '#6b1c72');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hz + 2);

      ctx.save(); ctx.translate(w * 0.45 - cam.x * 3, hz * 0.35); ctx.rotate(-0.45);
      g = ctx.createLinearGradient(0, -70, 0, 70);
      g.addColorStop(0, 'rgba(120,140,255,0)'); g.addColorStop(0.5, 'rgba(150,160,255,0.09)'); g.addColorStop(1, 'rgba(120,140,255,0)');
      ctx.fillStyle = g; ctx.fillRect(-w, -70, w * 2, 140); ctx.restore();

      for (const s of stars) {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0015 + s.p));
        ctx.fillStyle = rgba(s.tint, tw * 0.85 * (1 - (s.y / hz) * 0.55));
        ctx.fillRect(s.x - cam.x * 6, s.y, s.r, s.r);
      }

      const mr = Math.max(10, Math.min(h * 0.028, 24)), mx = w * 0.16 - cam.x * 4, my = hz * 0.2;
      g = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 6);
      g.addColorStop(0, 'rgba(200,215,255,0.18)'); g.addColorStop(1, 'rgba(200,215,255,0)');
      ctx.fillStyle = g; ctx.fillRect(mx - mr * 6, my - mr * 6, mr * 12, mr * 12);
      g = ctx.createLinearGradient(mx - mr, my - mr, mx + mr, my + mr);
      g.addColorStop(0, '#f1f4ff'); g.addColorStop(1, '#a3add4');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(110,120,165,0.3)';
      [[-0.3, -0.2, 0.28], [0.25, 0.15, 0.2], [-0.1, 0.45, 0.15]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, TAU); ctx.fill(); });

      // ---- hills, far skyline, wheel, near skyline ----
      [['#170c3d', 0, 46, 0.003, 4], ['#0b0a26', 1.7, 30, 0.006, 8]].forEach(([col, ph, amp, fr, par]) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, hz);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, hz - 18 - amp * (0.5 + 0.5 * Math.sin(x * fr + ph - cam.x * par * 0.05)) - 10 * Math.sin(x * 0.013 + ph));
        ctx.lineTo(w, hz); ctx.fill();
      });
      ctx.fillStyle = 'rgba(34,20,80,0.9)';
      for (const b of far) ctx.fillRect(b.x - cam.x * 5, hz - b.h, b.w, b.h + 2);

      const R = Math.min(h * 0.14, w * 0.11, 120), fx = w * 0.83 - cam.x * 9, fy = hz - R - 8;
      const rot = t * 0.00012;
      ctx.strokeStyle = 'rgba(120,140,220,0.4)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(fx, fy, R, 0, TAU); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(120,140,220,0.25)';
      ctx.beginPath(); ctx.arc(fx, fy, R * 0.94, 0, TAU); ctx.stroke();
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(120,140,220,0.4)';
      ctx.beginPath(); ctx.moveTo(fx - R * 0.4, hz); ctx.lineTo(fx, fy); ctx.lineTo(fx + R * 0.4, hz); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = rot + (i / 12) * TAU, x = fx + Math.cos(a) * R, y = fy + Math.sin(a) * R;
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = '#0a0a22'; ctx.fillRect(x - 3.5, y + 2, 7, 6);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 2); ctx.stroke();
      }
      ctx.fillStyle = '#0b0a24'; ctx.beginPath(); ctx.arc(fx, fy, 4, 0, TAU); ctx.fill();

      ctx.fillStyle = '#07071a';
      for (const b of blds) {
        const x = b.x - cam.x * 10;
        ctx.fillRect(x, hz - b.h, b.w, b.h + 2);
        ctx.fillStyle = 'rgba(255,215,140,0.75)';
        for (let i = 0; i < b.win; i++) ctx.fillRect(x + 4 + (i % 3) * 12, hz - b.h + 6 + Math.floor(i / 3) * 10, 3, 3);
        ctx.fillStyle = '#07071a';
      }

      // horizon haze + ground
      g = ctx.createLinearGradient(0, hz - 70, 0, hz);
      g.addColorStop(0, 'rgba(120,50,150,0)'); g.addColorStop(1, 'rgba(150,60,160,0.35)');
      ctx.fillStyle = g; ctx.fillRect(0, hz - 70, w, 72);
      g = ctx.createLinearGradient(0, hz, 0, h);
      g.addColorStop(0, '#12072e'); g.addColorStop(1, '#000');
      ctx.fillStyle = g; ctx.fillRect(0, hz, w, h - hz);

      // ---- additive light: wheel, sky glow, ground spill, beams, lasers, fireworks ----
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * TAU;
        ctx.fillStyle = rgba(PAL[i % 5], 0.25 + 0.55 * Math.max(0, Math.sin(t * 0.005 - i * 0.5)));
        ctx.fillRect(fx + Math.cos(a) * R - 1, fy + Math.sin(a) * R - 1, 2, 2);
      }
      for (let i = 0; i < 12; i++) {
        const a = rot + (i / 12) * TAU, x = fx + Math.cos(a) * R, y = fy + Math.sin(a) * R + 5, c = PAL[i % 5];
        g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, rgba(c, 0.95)); g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g; ctx.fillRect(x - 9, y - 9, 18, 18);
      }
      g = ctx.createRadialGradient(sx, topY, 0, sx, topY, h * 0.8);
      g.addColorStop(0, rgba('139,92,246', 0.1 + pulse * 0.08)); g.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hz);
      if (flash > 0.05) { ctx.fillStyle = `rgba(170,190,255,${flash * 0.05})`; ctx.fillRect(0, 0, w, hz); }

      ctx.save(); ctx.translate(sx, hz + 10); ctx.scale(1, 0.22);
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, sw * 0.95);
      g.addColorStop(0, rgba('0,240,255', 0.25 + pulse * 0.2)); g.addColorStop(0.5, 'rgba(255,0,127,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sw * 0.95, 0, TAU); ctx.fill(); ctx.restore();

      // volumetric beams: three soft layered cones per lamp
      beams.forEach((b, i) => {
        const ox = sx - sw / 2 + sw * (i / 6), oy = topY;
        let target = -Math.PI / 2 + Math.sin(t * 0.0007 * (1 + i * 0.13) + i * 1.7) * 0.75;
        if (ptr.active && i % 2 === 0) target = Math.atan2(ptr.y - oy, ptr.x - ox);
        b.ang += (target - b.ang) * 0.06;
        const L = h * 1.1, sp = 0.035 + (i % 2) * 0.015;
        g = ctx.createLinearGradient(ox, oy, ox + Math.cos(b.ang) * L, oy + Math.sin(b.ang) * L);
        g.addColorStop(0, rgba(b.c, 0.32 + pulse * 0.2)); g.addColorStop(0.6, rgba(b.c, 0.1)); g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g;
        [[1, 0.35], [0.6, 0.55], [0.3, 0.9]].forEach(([m, a]) => {
          ctx.globalAlpha = a;
          const q = sp * m;
          ctx.beginPath(); ctx.moveTo(ox, oy);
          ctx.lineTo(ox + Math.cos(b.ang - q) * L, oy + Math.sin(b.ang - q) * L);
          ctx.lineTo(ox + Math.cos(b.ang + q) * L, oy + Math.sin(b.ang + q) * L);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      });
      if (!reduced && !lowQ) {
        for (let k = 0; k < 12; k++) {
          const a = -Math.PI / 2 + (k - 5.5) * 0.16 * Math.sin(t * 0.0005 + 1);
          const c = k % 2 ? '0,240,255' : '255,0,127', ex = sx + Math.cos(a) * h, ey = topY + Math.sin(a) * h;
          ctx.strokeStyle = rgba(c, 0.08); ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(sx, topY); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.strokeStyle = rgba(c, 0.55); ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(sx, topY); ctx.lineTo(ex, ey); ctx.stroke();
        }
      }

      // dust motes drifting through the haze, glowing only inside the beams
      if (!reduced && !lowQ) {
        for (const m of motes) {
          m.x += m.vx * dt; m.y += m.vy * dt;
          if (m.x < 0) m.x = w; if (m.x > w) m.x = 0; if (m.y < 0) m.y = hz; if (m.y > hz) m.y = 0;
          let lit = 0;
          for (let i = 0; i < 7; i++) {
            const d = Math.abs(Math.atan2(m.y - topY, m.x - (sx - sw / 2 + sw * (i / 6))) - beams[i].ang);
            if (d < 0.07) lit = Math.max(lit, 1 - d / 0.07);
          }
          ctx.fillStyle = `rgba(255,255,255,${(0.06 + lit * 0.7) * (0.6 + 0.4 * Math.sin(t * 0.003 + m.ph))})`;
          ctx.fillRect(m.x, m.y, m.r, m.r);
        }
      }

      // fireworks
      if (!reduced && t > nextFw) { launch(rand(w * 0.15, w * 0.85), rand(h * 0.1, hz * 0.55)); nextFw = t + rand(2500, 5000); }
      rockets = rockets.filter((r) => {
        r.k += 0.03;
        const e = 1 - Math.pow(1 - Math.min(r.k, 1), 2);
        const x = r.x0 + (r.tx - r.x0) * e, y = r.y0 + (r.ty - r.y0) * e;
        ctx.strokeStyle = rgba(r.c, 0.6); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(r.px, r.py); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = 'rgba(255,240,220,0.95)'; ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        r.px = x; r.py = y;
        if (r.k >= 1) {
          flash = Math.max(flash, 0.35);
          bursts.push({ x, y, c: r.c, life: 1 });
          const ring = Math.random() < 0.35;
          for (let i = 0; i < 70; i++) {
            const a = rand(0, TAU), s = ring ? 3.6 : rand(0.8, 4.6);
            parts.push({ x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: Math.random() < 0.7 ? r.c : pick() });
          }
          return false;
        }
        return true;
      });
      bursts = bursts.filter((b) => b.life > 0);
      for (const b of bursts) {
        b.life -= 0.04;
        g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 170);
        g.addColorStop(0, rgba(b.c, 0.28 * b.life)); g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g; ctx.fillRect(b.x - 170, b.y - 170, 340, 340);
      }
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.px = p.x; p.py = p.y; p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.vx *= 0.985; p.vy *= 0.985; p.life -= 0.011;
        const glitter = p.life < 0.5 && Math.random() < 0.2 ? 0.3 : 1;
        ctx.strokeStyle = rgba(p.life > 0.75 ? '255,245,225' : p.c, p.life * glitter); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }

      // branching lightning
      bolts = bolts.filter((b) => b.life > 0);
      for (const b of bolts) {
        b.life -= 0.06;
        const fl = b.life * (Math.random() < 0.25 ? 0.5 : 1);
        b.segs.forEach((pts, si) => {
          const wk = si ? 0.5 : 1;
          ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.strokeStyle = rgba('0,240,255', fl * 0.3); ctx.lineWidth = 9 * wk; ctx.stroke();
          ctx.strokeStyle = rgba('230,250,255', fl); ctx.lineWidth = 2 * wk; ctx.stroke();
        });
      }

      // ---- stage structure ----
      ctx.globalCompositeOperation = 'source-over';
      const lx = sx - sw / 2, rx = sx + sw / 2;
      [lx - 34, rx + 16].forEach((x0) => {
        const ah = th * 0.85, n = 7;
        for (let i = 0; i < n; i++) {
          const y = topY + 14 + i * (ah / n);
          ctx.fillStyle = '#070719'; ctx.fillRect(x0, y, 18, ah / n - 2);
          ctx.fillStyle = 'rgba(140,170,255,0.18)'; ctx.fillRect(x0, y, 18, 1);
        }
        ctx.strokeStyle = 'rgba(140,170,255,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0 + 9, topY); ctx.lineTo(x0 + 9, topY + 14); ctx.stroke();
      });
      ctx.fillStyle = '#04040f'; ctx.fillRect(lx - 6, topY, sw + 12, th + 2);
      ctx.fillStyle = '#05051a'; ctx.fillRect(lx - 10, hz - 8, sw + 20, 12);
      ctx.fillRect(lx - 6, topY, 10, th + 2); ctx.fillRect(rx - 4, topY, 10, th + 2); ctx.fillRect(lx - 6, topY, sw + 12, 12);
      ctx.fillStyle = rgba('0,240,255', 0.25 + pulse * 0.25); ctx.fillRect(lx - 10, hz + 3, sw + 20, 1.5);
      ctx.strokeStyle = 'rgba(140,170,255,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = lx; x < rx; x += 14) { ctx.moveTo(x, topY); ctx.lineTo(x + 7, topY + 12); ctx.lineTo(x + 14, topY); }
      ctx.stroke();

      // LED screen: color wash, waves, equalizer, scanlines
      const scx = sx - sw * 0.36, scy = topY + 20, scw = sw * 0.72, sch = th - 32;
      g = ctx.createLinearGradient(scx, 0, scx + scw, 0);
      g.addColorStop(0, `hsl(${(t * 0.02) % 360},85%,${18 + pulse * 10}%)`);
      g.addColorStop(1, `hsl(${(t * 0.02 + 70) % 360},85%,${18 + pulse * 10}%)`);
      ctx.fillStyle = g; ctx.fillRect(scx, scy, scw, sch);
      ctx.lineWidth = 1.5;
      for (let j = 0; j < 3; j++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath();
        for (let x = 0; x <= scw; x += 6) {
          const y = scy + sch * 0.45 + j * 4 + Math.sin(x * 0.03 + t * 0.003 * (j + 1) + j) * sch * 0.18 * (0.6 + pulse * 0.5);
          x ? ctx.lineTo(scx + x, y) : ctx.moveTo(scx, y);
        }
        ctx.stroke();
      }
      const nb = 28, bw = scw / nb;
      for (let i = 0; i < nb; i++) {
        const v = (0.3 + 0.7 * Math.abs(Math.sin(t * 0.004 + i * 0.7) * Math.cos(t * 0.0023 + i * 0.31))) * (0.55 + pulse * 0.45) * 0.4;
        ctx.fillStyle = rgba(PAL[i % 3], 0.85);
        ctx.fillRect(scx + i * bw + 1, scy + sch - sch * v, bw - 2, sch * v);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      for (let y = scy; y < scy + sch; y += 3) ctx.fillRect(scx, y, scw, 1);

      // DJ silhouette against the screen
      const dy = hz - 8, bob2 = Math.sin(t * 0.012) * 1.2 * u * (0.5 + pulse);
      ctx.fillStyle = '#010108'; ctx.strokeStyle = '#010108'; ctx.lineCap = 'round';
      ctx.fillRect(sx - sw * 0.08, dy - 18 * u, sw * 0.16, 18 * u);
      ctx.beginPath(); ctx.moveTo(sx - 9 * u, dy - 18 * u); ctx.lineTo(sx - 7 * u, dy - 46 * u + bob2); ctx.lineTo(sx + 7 * u, dy - 46 * u + bob2); ctx.lineTo(sx + 9 * u, dy - 18 * u); ctx.fill();
      ctx.beginPath(); ctx.arc(sx, dy - 54 * u + bob2, 6.5 * u, 0, TAU); ctx.fill();
      ctx.lineWidth = 4 * u;
      [-1, 1].forEach((sd) => {
        ctx.beginPath(); ctx.moveTo(sx + sd * 7 * u, dy - 44 * u + bob2);
        ctx.lineTo(sx + sd * (15 + (sd > 0 ? Math.sin(t * 0.01) * 4 : 0)) * u, dy - 26 * u); ctx.stroke();
      });
      ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.arc(sx, dy - 54 * u + bob2, 8 * u, Math.PI, TAU); ctx.stroke();
      ctx.lineCap = 'butt';

      // lamp heads + screen glow
      ctx.globalCompositeOperation = 'lighter';
      g = ctx.createRadialGradient(sx, scy + sch / 2, 0, sx, scy + sch / 2, sw * 0.6);
      g.addColorStop(0, rgba('0,240,255', 0.1 + pulse * 0.1)); g.addColorStop(1, 'rgba(0,240,255,0)');
      ctx.fillStyle = g; ctx.fillRect(sx - sw * 0.6, scy - sw * 0.3, sw * 1.2, sw * 0.9);
      beams.forEach((b, i) => {
        const x = lx + sw * (i / 6);
        g = ctx.createRadialGradient(x, topY, 0, x, topY, 14);
        g.addColorStop(0, rgba(b.c, 1)); g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g; ctx.fillRect(x - 14, topY - 14, 28, 28);
      });

      // anamorphic streaks on the stage, lamps and firework bursts
      streak(sx, topY, sw * 0.9, '120,220,255', 0.25 + pulse * 0.3);
      beams.forEach((b, i) => streak(lx + sw * (i / 6), topY, 60 + pulse * 40, b.c, 0.5));
      for (const b of bursts) streak(b.x, b.y, 150 * b.life, b.c, 0.5 * b.life);

      // fog
      for (const f of fogs) {
        f.x += f.v * dt; if (f.x - f.r > w) f.x = -f.r;
        g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, rgba(f.c, 0.11)); g.addColorStop(1, rgba(f.c, 0));
        ctx.fillStyle = g; ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      }

      // ---- crowd (back to front): shoulders, neck, head, two-segment arms, rim light ----
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const items = [];
      crowd.forEach((row, r) => {
        const baseY = hz + (h - hz) * [0.14, 0.44, 0.84][r];
        const shade = ['#0e0b2c', '#07061b', '#010105'][r];
        const off = -cam.x * [10, 22, 40][r];
        const rimK = 0.5 * (1 - r * 0.25) * (0.5 + pulse * 0.5);
        for (const p of row) {
          const s = p.s, x = p.x + off;
          if (x < -60 || x > w + 60) continue;
          const bob = -Math.abs(Math.sin(beat * Math.PI + p.ph * 0.15)) * (4 + jump * 10) * s;
          const y = baseY + bob, hr = 8.5 * s, top = y + hr + 8 * s, sh = y + 34 * s;
          ctx.fillStyle = shade; ctx.strokeStyle = shade;
          if (p.arm) {
            ctx.lineWidth = 4.6 * s;
            for (let a = 0; a < p.arm; a++) {
              const side = p.arm === 2 ? (a ? 1 : -1) : p.side;
              const ax = x + side * 19 * s, ay = sh, wob = Math.sin(t * 0.005 + p.ph + a);
              const ex = ax + side * (9 + wob * 3) * s, ey = ay - 14 * s;
              const hx = ex + side * (3 + wob * 5) * s, hy = ey - (20 + jump * 14) * s;
              ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
              ctx.beginPath(); ctx.arc(hx, hy, 3.2 * s, 0, TAU); ctx.fill();
              if (p.item && a === 0) items.push([hx, hy, p.item, p.rc, s]);
            }
          }
          ctx.beginPath();
          ctx.moveTo(x - 25 * s, h + 10); ctx.lineTo(x - 25 * s, sh);
          ctx.quadraticCurveTo(x - 22 * s, top, x - 8 * s, top); ctx.lineTo(x + 8 * s, top);
          ctx.quadraticCurveTo(x + 22 * s, top, x + 25 * s, sh); ctx.lineTo(x + 25 * s, h + 10);
          ctx.closePath(); ctx.fill();
          ctx.fillRect(x - 3.6 * s, y + hr - 3 * s, 7.2 * s, 12 * s);
          ctx.beginPath(); ctx.ellipse(x, y, hr * 0.86, hr, 0, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = rgba(p.rc, rimK); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.ellipse(x, y, hr * 0.86, hr, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - 25 * s, sh); ctx.quadraticCurveTo(x - 22 * s, top, x - 8 * s, top);
          ctx.moveTo(x + 8 * s, top); ctx.quadraticCurveTo(x + 22 * s, top, x + 25 * s, sh);
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }
      });

      // stage light washing over the crowd
      ctx.globalCompositeOperation = 'lighter';
      ctx.save(); ctx.translate(sx, hz + (h - hz) * 0.3); ctx.scale(1, 0.4);
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, sw * 1.2);
      g.addColorStop(0, rgba('0,240,255', 0.1 + pulse * 0.1)); g.addColorStop(0.5, 'rgba(255,0,127,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sw * 1.2, 0, TAU); ctx.fill(); ctx.restore();

      // phones + glowsticks
      for (const [x, y, it, c, s] of items) {
        const gy = y - 5 * s;
        g = ctx.createRadialGradient(x, gy, 0, x, gy, 13 * s);
        g.addColorStop(0, it === 1 ? 'rgba(255,240,200,0.85)' : rgba(c, 0.8)); g.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = g; ctx.fillRect(x - 13 * s, gy - 13 * s, 26 * s, 26 * s);
        if (it === 1) { ctx.fillStyle = 'rgba(255,250,230,0.95)'; ctx.fillRect(x - 2 * s, y - 8 * s, 4 * s, 7 * s); }
        else { ctx.strokeStyle = rgba(c, 0.95); ctx.lineWidth = 2.4 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2 * s, y - 11 * s); ctx.stroke(); }
      }

      // out-of-focus foreground bokeh
      for (const b of lowQ ? [] : bokeh) {
        const al = (0.05 + 0.03 * Math.sin(t * 0.002 + b.ph)) * (0.6 + pulse * 0.6), bx = b.x - cam.x * 60;
        ctx.fillStyle = rgba(b.c, al); ctx.beginPath(); ctx.arc(bx, b.y, b.r, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(b.c, al * 1.6); ctx.lineWidth = 1; ctx.stroke();
      }

      // festoon string lights
      [0.06, 0.12].forEach((yy, s) => {
        const y0 = h * yy, dy2 = s ? -12 : 12, sag = 34 + s * 12, ox = -cam.x * 14;
        const yAt = (x) => y0 + dy2 * (x / w) + sag * (1 - Math.pow((x / w) * 2 - 1, 2));
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 1.2; ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 20) (x < 0 ? ctx.moveTo(x + ox, yAt(x)) : ctx.lineTo(x + ox, yAt(x)));
        ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        for (let x = 10 + s * 20, i = 0; x < w; x += 46, i++) {
          const bx = x + ox, by = yAt(x) + 4, fl = 0.55 + Math.sin(t * 0.004 + i * 1.3) * 0.12;
          g = ctx.createRadialGradient(bx, by, 0, bx, by, 13);
          g.addColorStop(0, rgba('255,200,120', fl)); g.addColorStop(1, 'rgba(255,200,120,0)');
          ctx.fillStyle = g; ctx.fillRect(bx - 13, by - 13, 26, 26);
          ctx.fillStyle = 'rgba(255,245,220,0.95)'; ctx.fillRect(bx - 1.5, by - 1.5, 3, 3);
        }
      });

      // lens ghosts trailing the stage light toward the cursor
      if (ptr.active && !reduced && !lowQ) {
        [[0.35, 26, '0,240,255'], [0.7, 14, '255,0,127'], [1.3, 40, '139,92,246']].forEach(([f, r, c]) => {
          const gx = sx + (ptr.x - sx) * f, gy = topY + (ptr.y - topY) * f;
          ctx.strokeStyle = rgba(c, 0.12 + pulse * 0.06); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(gx, gy, r, 0, TAU); ctx.stroke();
          ctx.fillStyle = rgba(c, 0.04); ctx.fill();
        });
      }

      // cursor glow
      if (ptr.active && !reduced) {
        g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 120);
        g.addColorStop(0, 'rgba(0,240,255,0.2)'); g.addColorStop(1, 'rgba(0,240,255,0)');
        ctx.fillStyle = g; ctx.fillRect(ptr.x - 120, ptr.y - 120, 240, 240);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 10, 0, TAU); ctx.stroke();
      }

      // bloom: blur a tiny copy of the frame and add it back for a cinematic glow
      if (bx && !lowQ && cv.width > 0) {
        bx.drawImage(cv, 0, 0, cv.width, cv.height, 0, 0, bc.width, bc.height);
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.38;
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(bc, 0, 0, bc.width, bc.height, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      // film grain
      ctx.globalCompositeOperation = 'source-over';
      if (grain) {
        ctx.save(); ctx.globalAlpha = 0.55; ctx.translate(rand(0, 160), rand(0, 160));
        ctx.fillStyle = grain; ctx.fillRect(-160, -160, w + 320, h + 320); ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    let visible = true, ema = 16, frames = 0;
    const loop = (now) => {
      const dt = Math.min(now - last, 50);
      frames++; ema += (dt - ema) * 0.05;
      if (!lowQ && frames > 90 && ema > 26) lowQ = true; // drop heavy effects on slow devices
      draw(dt);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && visible && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', setPointer);
    window.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; onVisibility(); });
    io.observe(cv);
    if (!reduced) { last = performance.now(); raf = requestAnimationFrame(loop); }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', setPointer);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="vd-dolly absolute inset-0 w-full h-full pointer-events-none" />;
};

// ================= HERO =================
const TIME_UNITS = [
  ['days', 'DAYS'],
  ['hours', 'HOURS'],
  ['minutes', 'MINS'],
  ['seconds', 'SECS'],
];
const MARQUEE = 'NATIONAL LEVEL TECHNO-CULTURAL FEST  ✦  OCT 15, 2026  ✦  AMRITA VISHWA VIDYAPEETHAM  ✦  BE THE CHANGE  ✦  ';

const heroCss = `
@keyframes vd-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes vd-spin { to { transform: rotate(360deg); } }
@keyframes vd-glint { 0%,100% { background-position: 100% 0; } 50% { background-position: 0% 0; } }
@keyframes vd-dolly { from { transform: scale(1.16); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes vd-track { from { opacity: 0; letter-spacing: 0.5em; } to { opacity: 1; letter-spacing: 0.1em; } }
@keyframes vd-focus { from { filter: blur(14px); } to { filter: blur(0); } }
@keyframes vd-tick { from { opacity: 0.35; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.vd-marquee { animation: vd-marquee 38s linear infinite; }
.vd-spin { animation: vd-spin 4s linear infinite; }
.vd-dolly { animation: vd-dolly 3.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
.vd-track { animation: vd-track 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
.vd-focus { animation: vd-focus 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
.vd-tick { animation: vd-tick 0.35s ease-out both; }
.vd-chrome { background-image: linear-gradient(100deg, #7c8db5 0%, #cfe9ff 30%, #ffffff 42%, #cfe9ff 54%, #7c8db5 100%); background-size: 250% 100%; animation: vd-glint 7s ease-in-out infinite; }
.vd-tilt { transform: perspective(1400px) rotateX(calc(var(--ry, 0) * -5deg)) rotateY(calc(var(--rx, 0) * 7deg)); transition: transform 0.25s ease-out; will-change: transform; }
.vd-layer-c { transform: translate(calc(var(--rx, 0) * -10px), calc(var(--ry, 0) * -6px)); }
.vd-layer-m { transform: translate(calc(var(--rx, 0) * 10px), calc(var(--ry, 0) * 6px)); }
@media (prefers-reduced-motion: reduce) {
  .vd-marquee, .vd-spin, .vd-chrome, .vd-dolly, .vd-track, .vd-focus, .vd-tick { animation: none; }
  .vd-tilt, .vd-layer-c, .vd-layer-m { transform: none; transition: none; }
}
`;

const Corner = ({ className }) => (
  <span aria-hidden="true" className={`absolute w-3 h-3 border-[#00f0ff] ${className}`} />
);

const FRAME_CORNERS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
];

export const Hero = ({ onNavbarReady }) => {
  const { timeLeft, setIsPassModalOpen } = useTransformation();
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [entranceStage, setEntranceStage] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setEntranceStage(1), 120);
    const t2 = setTimeout(() => setEntranceStage(2), 850);
    const t3 = setTimeout(() => {
      setEntranceStage(3);
      if (onNavbarReady) onNavbarReady();
    }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onNavbarReady]);

  // cursor -> CSS vars that tilt the content and split the title layers in 3D
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = rootRef.current;
    const move = (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--rx', (((e.clientX - b.left) / b.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--ry', (((e.clientY - b.top) / b.height) * 2 - 1).toFixed(3));
    };
    const reset = () => { el.style.setProperty('--rx', 0); el.style.setProperty('--ry', 0); };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
    };
  }, []);

  const shown = entranceStage >= 3;
  const reveal = shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
  const titleCls =
    'font-frontage font-black tracking-[0.10em] text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] leading-[0.88] uppercase';

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center bg-black text-white overflow-hidden select-none"
    >
      <style>{heroCss}</style>

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <div aria-hidden="true" className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[#8b5cf6]/25 blur-[110px] motion-safe:animate-subtle-pulse" />
        <div aria-hidden="true" className="absolute -bottom-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#00f0ff]/20 blur-[110px] motion-safe:animate-subtle-pulse" style={{ animationDelay: '1.2s' }} />
        <div aria-hidden="true" className="absolute top-[30%] left-[35%] w-[30vw] h-[30vw] rounded-full bg-[#ff007f]/15 blur-[120px] motion-safe:animate-subtle-pulse" style={{ animationDelay: '2.4s' }} />

        <InteractiveBackground />

        {/* cinematic grade: soft vignette + darker top/bottom for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.9) 100%),
              radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 42%, rgba(0,0,0,0.7) 100%)
            `,
          }}
        />
      </div>

      {/* Viewfinder frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 sm:inset-x-8 top-20 sm:top-24 bottom-24 z-10 hidden sm:block">
        {FRAME_CORNERS.map((c) => (
          <span key={c} className={`absolute w-6 h-6 border-white/30 ${c}`} />
        ))}
        <span className="hidden lg:block absolute left-3 top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] font-syncopate text-[9px] tracking-[0.5em] text-white/30 uppercase">Be the change</span>
        <span className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] font-syncopate text-[9px] tracking-[0.5em] text-white/30 uppercase">Oct 15 · 2026</span>
      </div>

      {/* Navbar spacer */}
      <div className="w-full h-16 sm:h-20" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 text-center my-auto flex flex-col items-center justify-center">
        <div className="vd-tilt flex flex-col items-center w-full">
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              entranceStage === 0
                ? 'opacity-0 translate-y-10'
                : entranceStage === 1
                ? 'opacity-100 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Presenter line */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 font-syncopate text-[8px] sm:text-[10px] tracking-[0.4em] text-white/70 uppercase">
              <span aria-hidden="true" className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#00f0ff]/70" />
              <span>Amrita Vishwa Vidyapeetham presents</span>
              <span aria-hidden="true" className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#00f0ff]/70" />
            </div>

            {/* Layered 3D title: cyan + magenta depth layers split with the cursor */}
            <div className="relative block my-1 sm:my-2">
              <div className="absolute -inset-10 bg-[#8b5cf6]/15 blur-3xl rounded-full opacity-70 pointer-events-none" />
              <h1 className="vd-focus relative">
                <span className="sr-only">VIDYUT</span>
                <span aria-hidden="true" className={`vd-track vd-layer-c absolute inset-0 ${titleCls} text-[#00f0ff]/40 blur-[1px] transition-transform duration-200 ease-out`}>VIDYUT</span>
                <span aria-hidden="true" className={`vd-track vd-layer-m absolute inset-0 ${titleCls} text-[#ff007f]/40 blur-[1px] transition-transform duration-200 ease-out`}>VIDYUT</span>
                <span
                  aria-hidden="true"
                  className={`vd-track vd-chrome relative block ${titleCls} text-transparent bg-clip-text drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]`}
                >
                  VIDYUT
                </span>
              </h1>
            </div>

            <div aria-hidden="true" className="mx-auto mt-4 h-[2px] w-40 sm:w-64 rounded-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_14px_rgba(0,240,255,0.8)]" />

            {/* Tagline + date */}
            <div className={`mt-4 flex flex-col items-center gap-2 transition-all duration-700 ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="font-syncopate text-[10px] sm:text-xs md:text-sm tracking-[0.38em] text-white/90 uppercase">
                National Level Techno-Cultural Fest
              </p>
              <p className="inline-flex items-center gap-3 font-impact text-lg sm:text-2xl tracking-[0.25em] text-[#00f0ff] drop-shadow-[0_0_14px_rgba(0,240,255,0.55)]">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#ff007f] shadow-[0_0_10px_#ff007f] motion-safe:animate-pulse" />
                OCT 15, 2026
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#ff007f] shadow-[0_0_10px_#ff007f] motion-safe:animate-pulse" />
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div id="countdown" className={`mt-7 sm:mt-9 w-full max-w-2xl mx-auto transition-all duration-700 ${reveal}`}>
            <p className="mb-2 font-syncopate text-[8px] sm:text-[9px] tracking-[0.5em] text-white/50 uppercase">Lights up in</p>
            <div
              role="timer"
              aria-label="Countdown to the fest"
              className="relative flex items-start justify-center gap-1 sm:gap-3 px-3 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(139,92,246,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              <Corner className="-top-px -left-px border-t-2 border-l-2 rounded-tl-2xl" />
              <Corner className="-top-px -right-px border-t-2 border-r-2 rounded-tr-2xl" />
              <Corner className="-bottom-px -left-px border-b-2 border-l-2 rounded-bl-2xl" />
              <Corner className="-bottom-px -right-px border-b-2 border-r-2 rounded-br-2xl" />
              {TIME_UNITS.map(([key, label], i) => (
                <React.Fragment key={key}>
                  {i > 0 && (
                    <span aria-hidden="true" className="text-3xl sm:text-5xl md:text-6xl font-impact leading-none text-[#00f0ff]/60 motion-safe:animate-pulse">:</span>
                  )}
                  <div className="flex flex-col items-center min-w-[3.4rem] sm:min-w-[5.5rem]">
                    <span key={`${key}-${timeLeft[key]}`} className="vd-tick inline-block text-4xl sm:text-5xl md:text-6xl font-impact font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#94a3b8] leading-none tabular-nums drop-shadow-[0_0_14px_rgba(0,240,255,0.4)]">
                      {String(timeLeft[key]).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-syncopate text-white/60 uppercase font-semibold tracking-[0.3em] mt-2">
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className={`mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 transition-all duration-700 ${reveal}`}
            style={{ transitionDelay: shown ? '150ms' : '0ms' }}
          >
            {/* Primary: rotating electric border */}
            <div className="relative p-[1.5px] rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.35)]">
              <span
                aria-hidden="true"
                className="vd-spin absolute -inset-[150%] bg-[conic-gradient(from_0deg,#00f0ff,#8b5cf6,#ff007f,#ffe178,#00f0ff)]"
              />
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="relative px-7 sm:px-8 py-3 rounded-full bg-white text-black font-syncopate font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#e0fbff] active:bg-gray-300 transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00f0ff]"
              >
                <Ticket className="w-3.5 h-3.5 fill-current" />
                <span>CLAIM PASS</span>
              </button>
            </div>

            <button
              onClick={() => setIsInterestModalOpen(true)}
              className="px-7 sm:px-8 py-3 rounded-full border border-white/30 hover:border-[#ff007f] hover:shadow-[0_0_22px_rgba(255,0,127,0.35)] bg-black/60 backdrop-blur-md text-white font-syncopate font-bold text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff007f]"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white" />
              <span>SHOW INTEREST</span>
            </button>

            <a
              href="https://vidyut-last.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3 rounded-full border border-white/20 hover:border-white bg-black/60 backdrop-blur-md text-white/70 hover:text-white font-syncopate font-bold text-xs tracking-[0.2em] uppercase transition-colors flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>VIDYUT '25 ↗</span>
            </a>
          </div>

          <p
            className={`mt-6 font-montserrat text-[10px] sm:text-[11px] text-white/45 transition-all duration-700 ${reveal}`}
            style={{ transitionDelay: shown ? '300ms' : '0ms' }}
          >
            Move your cursor to steer the stage lights. Tap or click to launch fireworks.
          </p>
        </div>
      </div>

      {/* ================= MARQUEE ================= */}
      <div aria-hidden="true" className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-black/50 backdrop-blur-md py-2">
        <div className="vd-marquee flex w-max whitespace-nowrap font-syncopate text-[10px] tracking-[0.35em] text-white/50">
          <span className="pr-0">{MARQUEE.repeat(4)}</span>
          <span>{MARQUEE.repeat(4)}</span>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-montserrat text-white/40">
        <div>© 2026 VIDYUT • AMRITA VISHWA VIDYAPEETHAM</div>
        <div className="font-syncopate tracking-[0.2em] text-white/60">BE THE CHANGE</div>
      </footer>

      <ShowInterestModal isOpen={isInterestModalOpen} onClose={() => setIsInterestModalOpen(false)} />
    </div>
  );
};