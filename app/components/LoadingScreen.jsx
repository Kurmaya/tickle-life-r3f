"use client";
import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
  const { progress } = useProgress();
  const word = "HEARTBEAT OF YOUR BUSINESS";

  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const visibleLetters = Math.floor((progress / 100) * word.length);

  useEffect(() => {
    if (progress === 100) {
      // Start fade
      setFadeOut(true);

      // Remove after fade duration
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 800); // must match CSS duration

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black
        transition-opacity duration-700 ease-out
        ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
    <div
  className="
    flex flex-wrap justify-center text-center
    max-w-[90vw]
    leading-tight
    font-bold text-white
    text-[clamp(1rem,5vw,3rem)]
    tracking-wide
  "
>
  {word.split("").map((char, index) => (
    <span
      key={index}
      className={`
        transition-opacity duration-300
        ${index < visibleLetters ? "opacity-100" : "opacity-0"}
      `}
      style={{ minWidth: char === " " ? "0.6em" : "auto" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ))}
</div>

    </div>
  );
}
