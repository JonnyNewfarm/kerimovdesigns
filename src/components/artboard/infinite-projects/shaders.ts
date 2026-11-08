
export const VERTEX_SHADER = `
  uniform float uTime, uHover, uWorldScale, uEdgeBend, uTransitionBend, uMorph, uCoverReturn, uEdgeMorphStrength;
  uniform vec2 uPointer, uMotion, uImageSize;
  varying vec2 vUv;

  const float PI = 3.14159265359;

  void main() {
    vUv = uv;

    vec3 p = position;
    vec2 q = p.xy / uImageSize + 0.5;

    float sx = sin(q.x * PI);
    float sy = sin(q.y * PI);
    float wave = sin(q.x * 7.0 - uTime * 1.8);

    p.z += sx * sy * (
      uPointer.x * 0.32 + uPointer.y * 0.16 +
      wave * uHover * 0.13 +
      uMotion.x * 0.29 + uMotion.y * 0.24
    ) * uWorldScale;

    p.x += sy * (
      uPointer.x * 0.085 + uMotion.x * 0.085
    ) * uWorldScale;

    p.y -= sx * (
      uPointer.y * 0.065 - uMotion.y * 0.075
    ) * uWorldScale;

    float side = uv.x * 2.0 - 1.0;
    float edge = pow(abs(side), 1.4);

    float verticalProfile =
      0.85 + 0.15 * cos((uv.y - 0.5) * PI);

    p.z += uEdgeBend *
      (edge * 0.56 + side * edge * 0.17) *
      verticalProfile;

    p.x += uEdgeBend * side * edge * 0.11;

    p.y += uEdgeBend * side *
      (uv.y - 0.5) * 0.07;

    p.x += uTransitionBend *
      sin(uv.y * PI) * 0.035 * uImageSize.x;

    p.y += uTransitionBend *
      sin(uv.x * PI) *
      (uv.y - 0.5) * 0.035 * uImageSize.x;

    p.z += uTransitionBend *
      sin(uv.x * PI) *
      sin(uv.y * PI) *
      0.16 * uWorldScale;

    float morphPulse = max(
      sin(PI * uMorph) * (1.0 - uCoverReturn),
      sin(PI * uCoverReturn)
    );

    p.z += sx * sy * morphPulse * uWorldScale *
      (
        0.38 + 0.22 *
        sin(
          uv.x * 7.0 +
          uv.y * 3.0 +
          uTime * 0.4
        )
      );

    p.x += sx * sy * morphPulse *
      uWorldScale * 0.075 *
      sin(uv.y * 8.0);

    float verticalSide = uv.y * 2.0 - 1.0;

    float sideMask = pow(abs(side), 2.6);
    float topBottomMask = pow(abs(verticalSide), 2.6);

    float sideFlow = (
      sin(uv.y * 6.2831853 + uTime * 0.5 + 0.6) +
      0.3 * sin(uv.y * 12.5663706 - uTime * 0.32)
    ) * sin(uv.y * PI);

    float topBottomFlow = (
      sin(uv.x * 6.2831853 - uTime * 0.4 + 1.2) +
      0.3 * sin(uv.x * 12.5663706 + uTime * 0.3)
    ) * sin(uv.x * PI);

    float edgeAmount =
      morphPulse * uWorldScale * uEdgeMorphStrength;

    p.x += side * sideMask *
      sideFlow * edgeAmount;

    p.y += verticalSide *
      topBottomMask *
      topBottomFlow *
      edgeAmount * 0.68;

    p.z += (
      sideMask * sin(uv.y * PI) +
      topBottomMask * sin(uv.x * PI)
    ) * edgeAmount * 0.65;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(p, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform sampler2D uNextTexture;
  uniform sampler2D uCoverTexture;

  uniform vec2 uUvFromScale, uUvFromOffset;
  uniform vec2 uUvToScale, uUvToOffset;
  uniform vec2 uUvCoverScale, uUvCoverOffset;

  uniform float uMorph, uCoverReturn, uOpacity, uTime, uBlur;
  uniform vec2 uImageSize;

  varying vec2 vUv;

  // Background for transparent PNG pixels.
  // Linear RGB equivalent of approximately #f1f0f0.
  const vec3 ALPHA_BACKGROUND =
    vec3(0.88, 0.871, 0.871);

  vec4 compositeAlpha(vec4 color) {
    float alpha = clamp(color.a, 0.0, 1.0);

    vec3 rgb = mix(
      ALPHA_BACKGROUND,
      color.rgb,
      alpha
    );

    return vec4(rgb, 1.0);
  }

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

    if (
      p <= 0.0001 &&
      uCoverReturn <= 0.0001
    ) {
      vec2 uv = clamp(
        vUv * uUvFromScale + uUvFromOffset,
        0.002,
        0.998
      );

      vec4 color = compositeAlpha(
        texture2D(uTexture, uv)
      );

      if (uBlur > 0.001) {
        float amount = clamp(
          uBlur,
          0.0,
          1.0
        );

        vec4 softened = compositeAlpha(
          texture2D(uTexture, uv, 1.4 * amount)
        );

        color.rgb = mix(
          color.rgb,
          softened.rgb,
          amount * 0.78
        );

color.rgb *= 1.0 - 0.60 * amount;      }

      gl_FragColor = vec4(
        color.rgb,
        uOpacity
      );

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
      (vUv + flow * 0.20 * p) *
      uUvFromScale + uUvFromOffset,
      0.002,
      0.998
    );

    vec2 toUv = clamp(
      (
        vUv -
        flow * 0.20 * (1.0 - p)
      ) * uUvToScale + uUvToOffset,
      0.002,
      0.998
    );

    // Composite both textures individually before
    // the morph to avoid transparent regions showing
    // the dark gallery background.

    vec4 fromColor = compositeAlpha(
      texture2D(uTexture, fromUv)
    );

    vec4 toColor = compositeAlpha(
      texture2D(uNextTexture, toUv)
    );

    float reveal = smoothstep(
      0.0,
      1.0,
      p
    );

    vec4 color = mix(
      fromColor,
      toColor,
      reveal
    );

    vec2 coverUv = clamp(
      (
        vUv +
        flow * 0.09 *
        uCoverReturn *
        (1.0 - uCoverReturn)
      ) * uUvCoverScale + uUvCoverOffset,
      0.002,
      0.998
    );

    vec4 coverColor = compositeAlpha(
      texture2D(uCoverTexture, coverUv)
    );

    color = mix(
      color,
      coverColor,
      uCoverReturn
    );

    gl_FragColor = vec4(
      color.rgb,
      uOpacity
    );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
