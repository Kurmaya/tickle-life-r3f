'use client';
import React, { useState, useCallback, useMemo } from "react";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";

export default function LoadingScreen2({ onFinish }) {
  const { progress } = useProgress();
  const word = "HEARTBEAT OF YOUR BUSINESS";

  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const visibleLetters = Math.floor((progress / 100) * word.length);

  const startFadeOut = useCallback(() => {
    if (fadeOut) return;
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 800);
  }, [fadeOut, onFinish]);

  /* =========================
     CURVE DEFINITION
  ========================= */
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-5, -1.8, 0),
      new THREE.Vector3(-3, 0.5, 0),
      new THREE.Vector3(-1, -0.4, 0),
      new THREE.Vector3(2, 1.0, 0),
      new THREE.Vector3(4, 0.3, 0),
      new THREE.Vector3(6, 2.3, 0),
      new THREE.Vector3(8, 1.8, 0),
      new THREE.Vector3(10, 3.3, 0),
      new THREE.Vector3(12, 4.8, 0),
    ];
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.15);
  }, []);

  /* =========================
     SAMPLE CURVE
  ========================= */
  const points = useMemo(() => {
    const pts = [];
    const samples = 120;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const v = curve.getPoint(t);
      pts.push({ x: v.x, y: v.y });
    }
    return pts;
  }, [curve]);

  /* =========================
     NORMALIZE TO SVG SPACE
  ========================= */
  const svgPoints = useMemo(() => {
    if (!points.length) return [];

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return points.map(p => ({
      x: ((p.x - minX) / (maxX - minX)) * 100,
      y: ((p.y - minY) / (maxY - minY)) * 100,
    }));
  }, [points]);

  /* =========================
     DRAW BASED ON PROGRESS
  ========================= */
  const drawnPoints = useMemo(() => {
    if (!svgPoints.length) return [];
    const count = Math.floor((progress / 100) * svgPoints.length);
    return svgPoints.slice(0, Math.max(2, count));
  }, [svgPoints, progress]);

  /* =========================
     SVG PATH (SAFE)
  ========================= */
  const path = useMemo(() => {
    if (drawnPoints.length < 2) return "";
    return drawnPoints
      .map((p, i) =>
        `${i === 0 ? "M" : "L"} ${p.x} ${100 - p.y}`
      )
      .join(" ");
  }, [drawnPoints]);

  /* =========================
     PEAKS & TROUGHS
  ========================= */
  const peaksAndTroughs = useMemo(() => {
    const res = [];
    for (let i = 1; i < drawnPoints.length - 1; i++) {
      const a = drawnPoints[i - 1].y;
      const b = drawnPoints[i].y;
      const c = drawnPoints[i + 1].y;
      if ((b > a && b > c) || (b < a && b < c)) {
        res.push(drawnPoints[i]);
      }
    }
    return res;
  }, [drawnPoints]);

  if (!visible) return null;

  return (
    <div
      onClick={startFadeOut}
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="graph">
        <defs>
          {/* Grid */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#222" strokeWidth="0.3" />
          </pattern>

          {/* Area Gradient */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D7B750" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#D7B750" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#D7B750" stopOpacity="0" />
          </linearGradient>

          {/* Grain */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4">
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.7;0.9;0.7"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.035" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Grid */}
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Area */}
        {path && (
          <path
            d={`${path} L ${drawnPoints[drawnPoints.length - 1].x} 100 L 0 100 Z`}
            fill="url(#areaGradient)"
          />
        )}

        {/* Line */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="#D7B750"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        )}

        {/* Dots */}
        {peaksAndTroughs.map((p, i) => (
          <circle key={i} cx={p.x} cy={100 - p.y} r="0.9" className="dot" />
        ))}

        {/* Grain */}
        <rect width="100" height="100" filter="url(#noise)" opacity="0.4" />
      </svg>

      <div className="loading-text">
        {word.split("").map((c, i) => (
          <span key={i} className={i < visibleLetters ? "show" : ""}>
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </div>

      <style jsx>{`
        .graph {
          position: absolute;
          top: 12.5vh;
          width: 100vw;
          height: 75vh;
        }

        .dot {
          fill: white;
          filter: drop-shadow(0 0 3px white);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { r: 0.8; opacity: 0.7; }
          50% { r: 1.1; opacity: 1; }
        }

        .loading-text {
          position: absolute;
          bottom: 8vh;
          width: 100%;
          text-align: center;
          font-size: clamp(1rem, 5vw, 3rem);
          font-weight: bold;
          color: white;
          letter-spacing: 0.1em;
        }

        .loading-text span {
          opacity: 0;
          transition: opacity 0.3s;
        }

        .loading-text span.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
