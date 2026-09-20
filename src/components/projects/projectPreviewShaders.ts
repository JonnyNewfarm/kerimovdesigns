export const previewBendVertexShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uDelta;

const float PI = 3.141592653589793238;

void main() {
  vUv = uv;

  vec3 newPosition =
    position;

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

export const previewImageFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;

uniform vec2 uUvScale;
uniform vec2 uUvOffset;

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
    textureColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const hoverLabelFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
  vec4 textureColor =
    texture2D(
      uTexture,
      vUv
    );

  gl_FragColor =
    vec4(
      textureColor.rgb,
      textureColor.a *
      uOpacity
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;