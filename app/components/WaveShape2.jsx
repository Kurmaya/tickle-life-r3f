import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaveShape2({
  color = "black",
  thickness = 0.06,
  animate = true,
  triggerExplosion = false,
  trigger=false,
  ...props
}) {
  const lineRef = useRef();
  const fadeRef = useRef(0); // 0 = visible, 1 = fully black

  // Curve points
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-5, -2.8, 0),
      new THREE.Vector3(-3, 0.5, 0),
      new THREE.Vector3(-1, -0.2, 0),
      new THREE.Vector3(2, 1.0, 0),
      new THREE.Vector3(5, 0.3, 0),
      new THREE.Vector3(8, 1.3, 0),
      new THREE.Vector3(10, 3.3, 0),
    ];
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
  }, []);

  const points = useMemo(() => curve.getPoints(200), [curve]);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const black = new THREE.Color(0x000000);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;

    // ⭐ Fade value update
    fadeRef.current = THREE.MathUtils.lerp(
      fadeRef.current,
      (triggerExplosion || trigger) ? 1 : 0,
      0.1
    );

    // ⭐ Blend original color toward black
    const finalColor = baseColor.clone().lerp(black, fadeRef.current);
    lineRef.current.material.color.copy(finalColor);

    // ⭐ Wave animation
    if (animate) {
      const t = clock.getElapsedTime();
      const updated = [];
      points.forEach((p, i) => {
        const y = p.y + Math.sin(i * 0.12 + t * 1.2) * 0.08;
        updated.push(p.x, y, p.z);
      });
      lineRef.current.geometry.setPositions(updated);
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={thickness}
      {...props}
    />
  );
}
