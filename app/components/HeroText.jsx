'use client';
import React from "react";
import { Oxanium,Saira_Condensed } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ['600'],
});

const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ['400','700'],
});
export default function HeroText({ active, onExplosion }) {
  return (
    // <section id="page">
    <div
      className={active ? "overlay active" : "overlay"}
      style={{
        // position: "relative",
        position:'absolute',
        top: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        color: "white",
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      {/* --- Headings Container --- */}
      <div className="holder">
        <h1
        className={oxanium.className}
          id="heading1"
          style={{
            opacity: 0,
            lineHeight: "1",
          }}
        >
          <strong>Heartbeat</strong> <br /> of your business
        </h1>

        <h2
        className={saira.className}
          id="heading2"
          style={{
            opacity: 0,
          }}
        >
          Building <strong>safe and secure</strong> online payments
        </h2>
      </div>

      {/* --- CTA --- */}
      <h3
      className={saira.className}
        id="rates"
        style={{
          position: "absolute",
          right: "clamp(5%, 12vw, 14%)",
          top: "58%",
          transform: "translateY(-58%)",
          // fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)",
          opacity: 0,
          textAlign: "center",
          pointerEvents: "none",
          // cursor: "pointer",
        }}
        
      >
        <strong>Click on the heart</strong> <br />
        to find your rates with us
      </h3>

      {/* --- Scroll Indicator --- */}
      <p
      className={saira.className}
        id="scroll"
        style={{
          position: "absolute",
          bottom: "3%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          letterSpacing: "1px",
          opacity: 0,
          fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
        }}
      >
        Scroll to learn more <br />
        &darr;
      </p>
    </div>
    // </section>
  );
}
