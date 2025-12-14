import * as THREE from 'three'
import React, { useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const CurvedPlaneShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform float fadeStrengthX;
    uniform float fadeStrengthY;
    uniform float uScroll;
    uniform float uFadeYStart;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(map, vUv);
      color.rgb *= 0.55;

      float fadeInX  = smoothstep(0.25, fadeStrengthX, vUv.x);
      float fadeOutX = smoothstep(0.75, 1.0 - fadeStrengthX, vUv.x);
      float fadeX = fadeInX * fadeOutX;

      float fadeY = smoothstep(uFadeYStart, 0.0 - fadeStrengthY, vUv.y);
      float baseFade = fadeX * fadeY;

      // Fade out based on scroll > 50%
      float scrollFade = smoothstep(0.5, 1.0, uScroll);

      vec3 finalColor = mix(baseFade * color.rgb, vec3(0.0), scrollFade);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const CurvedPlane = ({
  width = 65,
  height = 85,
  radius = 65,
  textureUrl = '/textures/yourTexture.jpg',
  segmentsW = 64,
  fadeStrengthX = 0.15,
  fadeStrengthY = 0.15,
  scroll = 0,
  triggerExplosion,
  trigger,
  fadeDuration = 0.8,
  ...props
}) => {
  
  const fadeYStart = useRef(1.0);
  const texture = useTexture(textureUrl);
  const materialRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segmentsW, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const angle = (x / width) * Math.PI;
      const z = radius - Math.cos(angle) * radius;
      const newX = Math.sin(angle) * radius;

      pos.setXYZ(i, newX, pos.getY(i), -z);

      const u = (x + width / 2) / width;
      const v = (pos.getY(i) + height / 2) / height;
      uv.setXY(i, u, v);
    }

    geo.computeVertexNormals();
    return geo;
  }, [width, height, radius, segmentsW]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        fadeStrengthX: { value: fadeStrengthX },
        fadeStrengthY: { value: fadeStrengthY },
        uScroll: { value: 0 },
        uFadeYStart: { value: 1.0 },
      },
      vertexShader: CurvedPlaneShader.vertexShader,
      fragmentShader: CurvedPlaneShader.fragmentShader,
      side: THREE.BackSide,
      transparent: true,
      toneMapped: true,
    })
  }, [texture, fadeStrengthX, fadeStrengthY])

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const target = (triggerExplosion || trigger) ? 0.0 : 1.0;
    const smoothing = 1 - Math.exp(-delta / fadeDuration);

    fadeYStart.current += (target - fadeYStart.current) * smoothing;

    materialRef.current.uniforms.uFadeYStart.value = fadeYStart.current;
    materialRef.current.uniforms.uScroll.value = scroll;
  });

  return (
    <mesh geometry={geometry} {...props}>
      <shaderMaterial ref={materialRef} attach="material" args={[material]} />
    </mesh>
  );
};

export default CurvedPlane;
