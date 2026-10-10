
export const pageTransitionVertexShader =  `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

export const pageTransitionFragmentShader =  `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;

  
  float hash(vec2 p) {
    p = fract(
      p * vec2(
        123.34,
        456.21
      )
    );

    p += dot(
      p,
      p + 45.32
    );

    return fract(
      p.x * p.y
    );
  }

 

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f =
      f *
      f *
      (
        3.0 -
        2.0 * f
      );

    float a =
      hash(i);

    float b =
      hash(
        i +
        vec2(1.0, 0.0)
      );

    float c =
      hash(
        i +
        vec2(0.0, 1.0)
      );

    float d =
      hash(
        i +
        vec2(1.0, 1.0)
      );

    return mix(
      mix(
        a,
        b,
        f.x
      ),
      mix(
        c,
        d,
        f.x
      ),
      f.y
    );
  }

 

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    mat2 rotation = mat2(
      0.86,
      -0.50,
      0.50,
      0.86
    );

    for (
      int i = 0;
      i < 4;
      i++
    ) {
      value +=
        noise(p) *
        amplitude;

      p =
        rotation *
        p *
        1.82;

      amplitude *=
        0.48;
    }

    return value;
  }

  

  void main() {
    vec2 uv = vUv;


    vec2 cloudUv =
      uv * vec2(
        2.15,
        2.35
      );

    cloudUv.x +=
      sin(
        uv.y * 3.0 +
        uTime * 0.12
      ) *
      0.055;

    cloudUv.y +=
      cos(
        uv.x * 2.6 -
        uTime * 0.095
      ) *
      0.045;

    float cloudA =
      fbm(
        cloudUv +
        vec2(
          uTime * 0.014,
          -uTime * 0.010
        )
      );

 

    vec2 secondUv =
      uv * vec2(
        1.45,
        1.65
      );

    secondUv +=
      vec2(
        -uTime * 0.009,
        uTime * 0.007
      );

    float cloudB =
      fbm(
        secondUv
      );

    float field =
      mix(
        cloudA,
        cloudB,
        0.28
      );

    field =
      smoothstep(
        0.16,
        0.84,
        field
      );

 

    float threshold =
      mix(
        -0.18,
        1.18,
        uProgress
      );

    float softness =
      0.16;

    float mask =
      1.0 -
      smoothstep(
        threshold - softness,
        threshold + softness,
        field
      );

 

    float edgeDistance =
      abs(
        field -
        threshold
      );

    float edgeArea =
      1.0 -
      smoothstep(
        0.0,
        0.24,
        edgeDistance
      );

    float secondary =
      fbm(
        uv * 3.0 +
        vec2(
          -uTime * 0.012,
          uTime * 0.009
        )
      );

    mask +=
      (
        secondary -
        0.5
      ) *
      edgeArea *
      0.11;

    mask =
      clamp(
        mask,
        0.0,
        1.0
      );

  

    mask *=
      smoothstep(
        0.0,
        0.045,
        uProgress
      );

   
    mask =
      mix(
        mask,
        1.0,
        smoothstep(
          0.955,
          1.0,
          uProgress
        )
      );

  

    float baseVariation =
      smoothstep(
        0.18,
        0.82,
        cloudB
      );

    vec3 color =
      mix(
        uColorA,
        uColorB,
        baseVariation * 0.42
      );

    

    float greenField =
      fbm(
        uv * 1.25 +
        vec2(
          uTime * 0.004,
          -uTime * 0.003
        )
      );

    greenField =
      smoothstep(
        0.20,
        0.80,
        greenField
      );

    

    vec3 oliveTint =
      vec3(
        0.22,
        0.27,
        0.20
      );

   

    color =
      mix(
        color,
        oliveTint,
        greenField * 0.09
      );

   
    color +=
      (
        cloudA -
        0.5
      ) *
      0.012;

    gl_FragColor =
      vec4(
        color,
        mask
      );

    #include <colorspace_fragment>
  }
`;
