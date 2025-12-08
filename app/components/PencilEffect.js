import { Effect } from "postprocessing";
import * as THREE from "three";

export class PencilEffect extends Effect {
  constructor() {
    super(
      "PencilEffect",
      `
uniform vec2 uResolution;
uniform sampler2D tDiffuse;

mat3 Gx = mat3(
    -4.0, 0.0, 4.0,
    -6.0, 0.0, 6.0,
    -4.0, 0.0, 4.0
);

mat3 Gy = mat3(
    -4.0, -6.0, -4.0,
     0.0,  0.0,  0.0,
     4.0,  6.0,  4.0
);

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec2 texel = 1.0 / uResolution;

    // ---- Minimal Grain ----
    float n = rand(uv * uResolution);
    float grain = n * 0.25;
    vec2 jitter = uv + (grain - 0.02) * texel * 2.0;

    // ---- Sobel Edges ----
    float edge = 0.0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(x, y) * texel * 0.9;
            float gray = length(texture2D(tDiffuse, jitter + offset).rgb);
            edge += gray * Gx[x+1][y+1];
            edge += gray * Gy[x+1][y+1];
        }
    }

    edge *= 0.45;
    float sketch = 1.0 - smoothstep(0.03, 0.22, abs(edge));

    // ---- Base grayscale ----
    vec3 base = texture2D(tDiffuse, uv).rgb;
    float luminance = dot(base, vec3(0.299, 0.587, 0.114));
    float finalGray = mix(luminance, 1.0, sketch * 0.9);
    finalGray -= grain * 0.05;

    // ---- Teal sketch edges ----
    float tealNoise = rand(uv * vec2(120.0, 75.0));
    float edgeMask = smoothstep(0.12, 0.45, abs(edge));
    float tealMask = step(0.85, tealNoise) * edgeMask;

    float hueShift = rand(uv * vec2(10.0, 90.0)) * 0.25;
    vec3 teal = vec3(0.0 + hueShift, 0.85 + hueShift*0.2, 0.9);

    vec3 finalColor = mix(vec3(finalGray), teal, tealMask * 0.5);

    // --------------------------------------------------
    // PAPER BACKGROUND  —  #f6e8b8 → vec3(0.9647, 0.9098, 0.7216)
    // --------------------------------------------------
    vec3 paper = vec3(0.9647, 0.9098, 0.7216);
    finalColor = mix(paper, finalColor, 0.32);  // 92% sketch, 8% paper tint

    outputColor = vec4(finalColor, 1.0);
}
`,
      {
        uniforms: new Map([
          ["uResolution", new THREE.Uniform(new THREE.Vector2(1, 1))],
        ]),
      }
    );
  }

  update(renderer) {
    const size = renderer.getSize(new THREE.Vector2());
    this.uniforms.get("uResolution").value.set(size.x, size.y);
  }
}
