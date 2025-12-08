import { Effect } from "postprocessing";
import * as THREE from "three";

export class PencilEffect extends Effect {
  constructor() {
    super(
      "PencilEffect",

      // ---- FRAGMENT SHADER ----
      `
uniform vec2 uResolution;
uniform sampler2D tDiffuse;

mat3 Gx = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
);

mat3 Gy = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
);

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec2 texel = 1.0 / uResolution;
    float edge = 0.0;

    // Sobel edge detection
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            float gray = length(texture2D(tDiffuse, uv + vec2(x,y)*texel).rgb);
            edge += gray * Gx[x+1][y+1];
            edge += gray * Gy[x+1][y+1];
        }
    }

    float sketch = 1.0 - smoothstep(0.1, 0.3, abs(edge));

   vec3 base = texture2D(tDiffuse, uv).rgb;

// convert to grayscale
float luminance = dot(base, vec3(0.299, 0.587, 0.114));

// pencil sketch darkening
float shade = luminance - sketch * 0.5;

// output only grayscale
outputColor = vec4(vec3(shade), 1.0);

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
