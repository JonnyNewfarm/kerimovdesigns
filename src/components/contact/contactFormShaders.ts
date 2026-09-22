export const contactFormButtonFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

void main() {
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
   * GRADIENT
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
   * SAME COLORS AS PORTFOLIO BUTTON
   */

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

  vec3 colorC = vec3(
    0.46,
    0.46,
    0.37
  );

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

  gl_FragColor =
    vec4(
      color,
      1.0
    );
}
`;