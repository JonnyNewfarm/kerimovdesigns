export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uNextTexture;

  uniform float uMorph;
  uniform float uTime;
  uniform float uStrength;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) *
      43758.5453123
    );
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        hash(i),
        hash(i + vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        hash(i + vec2(0.0, 1.0)),
        hash(i + vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  void main() {
    float p = clamp(uMorph, 0.0, 1.0);

    if (p <= 0.0001) {
      gl_FragColor = texture2D(uTexture, vUv);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      return;
    }

    if (p >= 0.9999) {
      gl_FragColor = texture2D(uNextTexture, vUv);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      return;
    }

    vec2 flow = vec2(
      noise(
        vUv * vec2(3.0, 4.5) +
        vec2(uTime * 0.08, -p)
      ) - 0.5,

      noise(
        vUv * vec2(4.2, 3.1) +
        vec2(p, uTime * 0.06)
      ) - 0.5
    );

    flow += vec2(
      sin(
        vUv.y * 12.0 +
        vUv.x * 3.0 -
        p * 3.14159265
      ),

      cos(
        vUv.x * 9.0 -
        vUv.y * 4.0 +
        p * 3.14159265
      )
    ) * 0.22;

    vec2 fromUv = clamp(
      vUv + flow * uStrength * p,
      0.002,
      0.998
    );

    vec2 toUv = clamp(
      vUv - flow * uStrength * (1.0 - p),
      0.002,
      0.998
    );

    vec4 fromColor = texture2D(
      uTexture,
      fromUv
    );

    vec4 toColor = texture2D(
      uNextTexture,
      toUv
    );

    float reveal = smoothstep(0.0, 1.0, p);

    gl_FragColor = mix(
      fromColor,
      toColor,
      reveal
    );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
