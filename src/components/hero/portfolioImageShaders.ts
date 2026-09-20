export const portfolioBendVertexShader = `
varying vec2 vUv;

uniform vec2 uDelta;
uniform float uAmplitude;

const float PI = 3.141592653589793238;

void main() {
  vUv = uv;

  vec3 newPosition =
    position;

  /*
   * Samme type bend som AnimatedPortraitPlane.
   */
  newPosition.x +=
    sin(uv.y * PI) *
    uDelta.x *
    uAmplitude;

  newPosition.y +=
    sin(uv.x * PI) *
    uDelta.y *
    uAmplitude;

  float speed =
    length(uDelta);

  newPosition.z +=
    sin(uv.x * PI) *
    sin(uv.y * PI) *
    speed *
    uAmplitude *
    0.16;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(
      newPosition,
      1.0
    );
}
`;

export const portfolioImageFragmentShader = `
varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uUvScale;
uniform vec2 uUvOffset;

void main() {
  /*
   * object-fit: cover.
   */
  vec2 imageUv =
    vUv *
    uUvScale +
    uUvOffset;

  vec4 textureColor =
    texture2D(
      uTexture,
      imageUv
    );

  gl_FragColor =
    textureColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const portfolioTextureFragmentShader = `
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  vec4 textureColor =
    texture2D(
      uTexture,
      vUv
    );

  gl_FragColor =
    textureColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const portfolioColorFragmentShader = `
uniform vec3 uColor;

void main() {
  gl_FragColor =
    vec4(
      uColor,
      1.0
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const portfolioButtonFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

void main() {
  vec2 uv = vUv;

  float time = uTime * uSpeed;

  float wave =
    sin(
      uv.x * 5.2 +
      uv.y * 2.6 -
      time
    ) * 0.5 + 0.5;

  float wave2 =
    sin(
      uv.x * -2.8 +
      uv.y * 4.0 +
      time * 0.55
    ) * 0.5 + 0.5;

  float gradient = mix(
    wave,
    wave2,
    0.30
  );

  gradient = smoothstep(
    0.08,
    0.92,
    gradient
  );

  vec3 colorA = vec3(
    0.29,
    0.32,
    0.26
  );

  vec3 colorB = vec3(
    0.39,
    0.44,
    0.35
  );

  // Litt mørkere lys tone
  vec3 colorC = vec3(
    0.46,
    0.46,
    0.37
  );

  vec3 color;

  if (gradient < 0.5) {
    color = mix(
      colorA,
      colorB,
      gradient * 2.0
    );
  } else {
    color = mix(
      colorB,
      colorC,
      (gradient - 0.5) * 2.0
    );
  }

  gl_FragColor = vec4(
    color,
    1.0
  );
}
`;


export const projectLabelFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

void main() {
  vec2 uv = vUv;

  float time = uTime * uSpeed;

  // Hovedflow
  float wave =
    sin(
      uv.x * 4.6 +
      uv.y * 1.4 -
      time * 0.75
    ) * 0.5 + 0.5;

  // Svak sekundær variasjon
  float wave2 =
    sin(
      uv.x * -2.2 +
      uv.y * 2.8 +
      time * 0.35
    ) * 0.5 + 0.5;

  float gradient = mix(
    wave,
    wave2,
    0.16
  );

  gradient = smoothstep(
    0.10,
    0.90,
    gradient
  );

  vec3 color;

  if (gradient < 0.5) {
    color = mix(
      uColorA,
      uColorB,
      gradient * 2.0
    );
  } else {
    color = mix(
      uColorB,
      uColorC,
      (gradient - 0.5) * 2.0
    );
  }

  gl_FragColor = vec4(color, 1.0);
}
`;


export const portfolioLogoGradientFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;

uniform vec2 uUvScale;
uniform vec2 uUvOffset;

uniform float uTime;
uniform float uSpeed;

void main() {
  /*
   * COVER UV
   */
  vec2 imageUv =
    vUv *
    uUvScale +
    uUvOffset;

  /*
   * PNG TEXTURE
   */
  vec4 textureColor =
    texture2D(
      uTexture,
      imageUv
    );

  /*
   * PNG ALPHA MASK
   */
  float alpha =
    textureColor.a;

  if (alpha < 0.01) {
    discard;
  }

  vec2 uv = vUv;

  float time =
    uTime *
    uSpeed;

  /*
   * PRIMARY FLOW
   */
  float wave =
    sin(
      uv.x * 5.2 +
      uv.y * 2.6 -
      time
    ) * 0.5 + 0.5;

  /*
   * SECONDARY FLOW
   */
  float wave2 =
    sin(
      uv.x * -2.8 +
      uv.y * 4.0 +
      time * 0.55
    ) * 0.5 + 0.5;

  /*
   * MIX FLOWS
   */
  float gradient =
    mix(
      wave,
      wave2,
      0.30
    );

  gradient =
    smoothstep(
      0.08,
      0.92,
      gradient
    );

  /*
   * COOL EDITORIAL PALETTE
   *
   * A: #314A78
   * B: #7189B0
   * C: #C7D2D8
   */
  vec3 colorA = vec3(
    0.192,
    0.290,
    0.471
  );

  vec3 colorB = vec3(
    0.443,
    0.537,
    0.690
  );

  vec3 colorC = vec3(
    0.780,
    0.824,
    0.847
  );

  /*
   * THREE COLOR GRADIENT
   */
  vec3 color;

  if (gradient < 0.5) {
    color =
      mix(
        colorA,
        colorB,
        gradient * 2.0
      );
  } else {
    color =
      mix(
        colorB,
        colorC,
        (gradient - 0.5) * 2.0
      );
  }

  /*
   * OUTPUT
   */
  gl_FragColor =
    vec4(
      color,
      alpha
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const projectGalleryBendVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uDelta;

const float PI = 3.141592653589793238;

void main() {
  vUv = uv;

  vec3 newPosition = position;

  newPosition.x +=
    sin(uv.y * PI) *
    uDelta.x;

  newPosition.y +=
    sin(uv.x * PI) *
    uDelta.y;

  float speed =
    length(uDelta);

  newPosition.z +=
    sin(uv.x * PI) *
    sin(uv.y * PI) *
    speed *
    0.16;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(
      newPosition,
      1.0
    );
}
`;

export const projectGalleryImageFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;

uniform vec2 uUvScale;
uniform vec2 uUvOffset;

uniform float uOpacity;

void main() {
  vec2 imageUv =
    vUv *
    uUvScale +
    uUvOffset;

  vec4 textureColor =
    texture2D(
      uTexture,
      imageUv
    );

  gl_FragColor =
    vec4(
      textureColor.rgb,
      textureColor.a * uOpacity
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;