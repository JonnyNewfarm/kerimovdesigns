export const projectGalleryImageFragmentShader = /* glsl */ `
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
      textureColor.a * uOpacity
    );

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;