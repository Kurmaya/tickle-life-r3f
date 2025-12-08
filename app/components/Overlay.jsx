import React from "react";
import { Html } from "@react-three/drei";

export default function OverlayUI({ active, setActive, handleExplosion }) {
  return (
    <Html
      fullscreen        // covers the whole viewport
      transform={false} // ensures it stays fixed, not 3D-positioned
      style={{
        pointerEvents: "none", // allow Canvas interaction underneath unless overridden
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          color: "white",
          fontFamily: "Bebas Neue, sans-serif",
          pointerEvents: "none",  // global disabled; re-enabled per element
          zIndex:'1000'
        }}
      >
        {/* Nav Menu */}
        <div
          className={active ? "nav-menu active" : "nav-menu"}
          onClick={() => setActive(!active)}
          style={{
            position: "absolute",
            top: "5%",
            right: "5%",
            width: "50px",
            height: "50px",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Logo */}
        <img
          src="./images/logo.png"
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "80px",
            height: "80px",
            pointerEvents: "auto",
          }}
        />

        {/* Heading 1 */}
        <h1
          id="heading1"
          style={{
            fontSize: "4rem",
            margin: "0 0 0 30px",
            alignSelf: "flex-start",
            padding: "1rem",
            opacity: 0,
            textAlign: "left",
            letterSpacing: "1px",
            pointerEvents: "auto",
          }}
        >
          Heartbeat <br /> of your business
        </h1>

        {/* Heading 2 */}
        <h2
          id="heading2"
          style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            margin: "0 0 0 30px",
            alignSelf: "flex-start",
            padding: "1rem",
            opacity: 0,
            letterSpacing: "1px",
            pointerEvents: "auto",
          }}
        >
          Building safe and
          <br />
          secure online payments
        </h2>

        {/* Rates button */}
        <h3
          id="rates"
          onClick={handleExplosion}
          style={{
            position: "absolute",
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            opacity: 0,
            textAlign: "center",
            letterSpacing: "1px",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
        >
          Click to find out <br /> your rates with us
        </h3>

        {/* Scroll hint */}
        <p
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            letterSpacing: "1px",
            pointerEvents: "auto",
          }}
        >
          Scroll to learn more <br />
          ↓
        </p>
      </div>
    </Html>
  );
}
