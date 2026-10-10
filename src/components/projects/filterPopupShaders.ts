export const filterPopupVertexShader =  `
precision highp float;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = vec4(
    position.xy,
    0.0,
    1.0
  );
}
`;

export const filterPopupFragmentShader =  `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uSpeed;

void main() {
  vec2 uv = vUv;

  float time =
    uTime *
    uSpeed;

 

  vec2 warpedUv = uv;

  warpedUv.x +=
    sin(
      uv.y * 4.3 +
      time * 0.72
    ) * 0.045;

  warpedUv.y +=
    sin(
      uv.x * 3.6 -
      time * 0.58
    ) * 0.035;

  

  float wave =
    sin(
      warpedUv.x * 5.2 +
      warpedUv.y * 2.6 -
      time
    ) * 0.5 + 0.5;

  

  float wave2 =
    sin(
      warpedUv.x * -2.8 +
      warpedUv.y * 4.0 +
      time * 0.55
    ) * 0.5 + 0.5;

  
  float wave3 =
    sin(
      warpedUv.x * 2.0 -
      warpedUv.y * 3.2 +
      time * 0.38
    ) * 0.5 + 0.5;

 

  float gradient =
    mix(
      wave,
      wave2,
      0.30
    );

  gradient =
    mix(
      gradient,
      wave3,
      0.16
    );

  gradient =
    smoothstep(
      0.08,
      0.92,
      gradient
    );



  gradient =
    pow(
      gradient,
      1.55
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

 

  color =
    mix(
      color,
      colorA,
      0.24
    );

  

  vec2 centered =
    uv - 0.5;

  float edge =
    smoothstep(
      0.22,
      0.76,
      length(centered)
    );

  color =
    mix(
      color,
      colorA,
      edge * 0.18
    );

 

  gl_FragColor =
    vec4(
      color,
      1.0
    );
}
`;