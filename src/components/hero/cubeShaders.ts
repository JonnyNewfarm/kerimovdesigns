export const gradientVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform float uTime;
  uniform float uHover;
  uniform float uDisplacement;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 transformed = position;

    float slowWave =
      sin(position.x * 3.1 + uTime * 0.95) *
      cos(position.y * 2.8 + uTime * 0.82);

    float fabricWave =
      sin(
        (position.x * 1.4 - position.y * 1.8) * 5.0 +
        uTime * 1.15
      );

    float detailWave =
      sin(
        (position.x + position.y) * 6.5 +
        uTime * 1.35
      );

    float displacement =
      (
        slowWave * uDisplacement +
        fabricWave * 0.005 +
        detailWave * 0.004
      ) * (0.45 + uHover * 0.45);

    transformed += normal * displacement;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(transformed, 1.0);
  }
`;

export const gradientFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;

  uniform float uTime;
  uniform float uHover;
  uniform float uSpeed;
  uniform float uMovement;
  uniform float uWarp;
  uniform vec2 uMouse;

  float random(vec2 st) {
    return fract(
      sin(dot(st.xy, vec2(12.9898, 78.233))) *
      43758.5453123
    );
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
      (c - a) * u.y * (1.0 - u.x) +
      (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.55;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 1.92;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;

    float time = uTime * uSpeed;

    vec2 mouseOffset =
      (uMouse - vec2(0.5)) * uHover;

    vec2 animatedUv = uv;

    animatedUv -= mouseOffset * 0.42;

    animatedUv.x += sin(
      (uv.y + mouseOffset.y * 1.8) * 4.8 +
      time * 0.95
    ) * uWarp;

    animatedUv.y += cos(
      (uv.x + mouseOffset.x * 1.8) * 4.4 +
      time * 0.82
    ) * uWarp;

    vec2 silkUv = animatedUv;

    silkUv.x += sin(
      (
        animatedUv.y +
        animatedUv.x * 0.35 +
        mouseOffset.x * 0.85
      ) * 7.0 +
      time * 0.75
    ) * 0.045;

    silkUv.y += cos(
      (
        animatedUv.x -
        animatedUv.y * 0.25 +
        mouseOffset.y * 0.85
      ) * 6.5 -
      time * 0.62
    ) * 0.038;

    vec2 flowUv = silkUv * 1.75;

    flowUv += mouseOffset * 1.35;

    flowUv += vec2(
      sin(time * 0.42),
      cos(time * 0.36)
    ) * uMovement;

    float n1 = fbm(
      flowUv +
      vec2(time * 0.08, -time * 0.04)
    );

    float n2 = fbm(
      flowUv * 1.65 -
      vec2(time * 0.12, time * 0.08)
    );

    float n3 = fbm(
      flowUv * 2.45 +
      vec2(n1, n2) +
      time * 0.12
    );

    float sweepOne = smoothstep(
      0.02,
      0.95,
      silkUv.x + n1 * 0.42
    );

    float sweepTwo = smoothstep(
      0.04,
      0.98,
      silkUv.y + n2 * 0.38
    );

    float diagonalSweep = smoothstep(
      0.0,
      1.0,
      silkUv.x * 0.58 +
      silkUv.y * 0.42 +
      n3 * 0.28
    );

    float movingLight =
      sin(
        silkUv.x * 3.2 +
        silkUv.y * 2.4 +
        time * 1.15 +
        n3 * 2.2
      ) * 0.5 + 0.5;

    movingLight = smoothstep(
      0.25,
      0.95,
      movingLight
    );

    vec3 color = mix(
      uColorA,
      uColorB,
      sweepOne
    );

    color = mix(
      color,
      uColorC,
      sweepTwo * 0.5
    );

    color = mix(
      color,
      uColorD,
      diagonalSweep * 0.42
    );

    vec3 liftedColor =
      color + uColorC * 0.16;

    color = mix(
      color,
      liftedColor,
      movingLight * 0.22
    );

    float shadowVeil = fbm(
      silkUv * 3.4 -
      time * 0.08
    );

    color = mix(
      color * 0.88,
      color * 1.08,
      shadowVeil * 0.55
    );

    float centerGlow =
      1.0 -
      distance(uv, vec2(0.5));

    centerGlow = smoothstep(
      0.12,
      0.86,
      centerGlow
    );

    color = mix(
      color * 0.82,
      color * 1.08,
      centerGlow
    );

    float vignette =
      smoothstep(0.0, 0.22, uv.x) *
      smoothstep(0.0, 0.22, uv.y) *
      smoothstep(0.0, 0.22, 1.0 - uv.x) *
      smoothstep(0.0, 0.22, 1.0 - uv.y);

    color *= mix(
      0.72,
      1.08,
      vignette
    );

    float grain = random(
      uv * 2.2 +
      time * 0.025
    );

    color +=
      (grain - 0.5) * 0.012;

    color = mix(
      color,
      color * 1.12,
      uHover * 0.18
    );

    color = pow(
      color,
      vec3(0.94)
    );

    gl_FragColor =
      vec4(color, 1.0);
  }
`;

export const gradientPalettes: Record<
  number,
  {
    colorA: string;
    colorB: string;
    colorC: string;
    colorD: string;
  }
> = {
  1: {
    colorA: "#d9ded6",
    colorB: "#aab6aa",
    colorC: "#f1f4ee",
    colorD: "#5f6b60",
  },
  2: {
    colorA: "#d7d4cc",
    colorB: "#aeb6b0",
    colorC: "#eef0ea",
    colorD: "#6d746f",
  },
  3: {
    colorA: "#d4ddd7",
    colorB: "#9aaea3",
    colorC: "#eef4ef",
    colorD: "#58695f",
  },
  4: {
    colorA: "#d7dfd4",
    colorB: "#a5b49f",
    colorC: "#f0f5ec",
    colorD: "#5b6d58",
  },
  5: {
    colorA: "#ccd8d0",
    colorB: "#8fa092",
    colorC: "#edf3ee",
    colorD: "#526354",
  },
};