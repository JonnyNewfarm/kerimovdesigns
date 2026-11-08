
import { FRAGMENT_SHADER } from "../infinite-projects/shaders";

// ABOUT ONLY — project shaders remain unchanged.
export const PROFILE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uMorph;
  uniform float uCoverReturn;
  uniform float uWorldScale;
  uniform float uEdgeMorphStrength;
  uniform float uDepthBend;
  uniform vec2 uTravelLag;
  uniform vec2 uImageSize;

  varying vec2 vUv;
  varying float vProfileShade;

  const float PI = 3.14159265359;

  // X-BEND — KEEP THE SHAPE YOU LIKED
const float CORNER_TRAIL = 0.125;  const float SIDE_PULL = 0.055;
  const float DIAGONAL_TILT = 0.070;

  // DEPTH / LIGHT
  const float DEPTH_STRENGTH = 0.48;
  const float LIGHT_STRENGTH = 0.38;

  void main() {
    vUv = uv;

    vec3 p = position;

    float side = uv.x * 2.0 - 1.0;
    float verticalSide = uv.y * 2.0 - 1.0;

    float horizontalEdge =
      pow(abs(side), 1.25);

    float verticalEdge =
      pow(abs(verticalSide), 1.55);

    float cornerMask =
      horizontalEdge * verticalEdge;

    float sideMiddle =
      horizontalEdge * (1.0 - verticalEdge);

    // =====================================
    // ORIGINAL X-AXIS CORNER TRAILING
    // =====================================

    p.x += uTravelLag.x * (
      CORNER_TRAIL * cornerMask -
      SIDE_PULL * sideMiddle
    );

    p.y +=
      uTravelLag.x *
      DIAGONAL_TILT *
      side *
      verticalSide;

    p.y +=
      uTravelLag.y *
      0.025 *
      cornerMask;

    // =====================================
    // 3D SURFACE CURVATURE
    // =====================================

    float verticalSoftness =
      0.80 + 0.20 * sin(uv.y * PI);

    float centerArch =
      sin(uv.x * PI);

    float depthCurve =
      (
        centerArch * 0.95 -
        cornerMask * 0.30
      ) *
      verticalSoftness;

    p.z +=
      uDepthBend *
      DEPTH_STRENGTH *
      depthCurve;

    // =====================================
    // LIGHT RESPONSE FROM SURFACE SLOPE
    // =====================================

    // The curve's left and right sides have
    // different slopes, like a bent sheet.
    float surfaceSlope =
      cos(uv.x * PI) *
      sin(uv.y * PI);

    // Normalize depth against image width,
    // so lighting remains consistent.
    float relativeDepth =
      uDepthBend *
      DEPTH_STRENGTH /
      max(uImageSize.x, 1.0);

    float lightDirection =
      uTravelLag.x >= 0.0 ? 1.0 : -1.0;

    float lighting =
      surfaceSlope *
      relativeDepth *
      LIGHT_STRENGTH *
      lightDirection;

    // Noticeable, but restrained shading.
    vProfileShade = clamp(
      1.0 + lighting,
      0.86,
      1.14
    );

    // =====================================
    // EXISTING IMAGE / VIDEO MORPH
    // =====================================

    float sx = sin(uv.x * PI);
    float sy = sin(uv.y * PI);

    float morphPulse = max(
      sin(PI * uMorph) *
        (1.0 - uCoverReturn),
      sin(PI * uCoverReturn)
    );

    p.z +=
      sx * sy *
      morphPulse *
      uWorldScale *
      (
        0.38 +
        0.22 * sin(
          uv.x * 7.0 +
          uv.y * 3.0 +
          uTime * 0.4
        )
      );

    p.x +=
      sx * sy *
      morphPulse *
      uWorldScale *
      0.075 *
      sin(uv.y * 8.0);

    // =====================================
    // EXISTING MORPH EDGE MOTION
    // =====================================

    float sideMask =
      pow(abs(side), 2.6);

    float topBottomMask =
      pow(abs(verticalSide), 2.6);

    float sideFlow = (
      sin(
        uv.y * 6.2831853 +
        uTime * 0.5 + 0.6
      ) +
      0.3 * sin(
        uv.y * 12.5663706 -
        uTime * 0.32
      )
    ) * sin(uv.y * PI);

    float topBottomFlow = (
      sin(
        uv.x * 6.2831853 -
        uTime * 0.4 + 1.2
      ) +
      0.3 * sin(
        uv.x * 12.5663706 +
        uTime * 0.3
      )
    ) * sin(uv.x * PI);

    float edgeAmount =
      morphPulse *
      uWorldScale *
      uEdgeMorphStrength;

    p.x +=
      side *
      sideMask *
      sideFlow *
      edgeAmount;

    p.y +=
      verticalSide *
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

// Keep original image/video/PNG/morph behavior.
// Add surface lighting to both fragment paths.
export const PROFILE_FRAGMENT_SHADER = FRAGMENT_SHADER
  .replace(
    "varying vec2 vUv;",
    "varying vec2 vUv;\n  varying float vProfileShade;",
  )
  .replace(
    /gl_FragColor\s*=\s*vec4\(\s*color\.rgb\s*,\s*uOpacity\s*\)\s*;/g,
    "gl_FragColor = vec4(color.rgb * vProfileShade, uOpacity);",
  );
