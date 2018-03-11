#version 100
precision mediump float;

uniform vec2 u_resolution;

uniform sampler2D u_texture0;

varying vec2 v_uv;

void main()
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = (uv * 2.0) - 1.;
  uv.x *= u_resolution.x / u_resolution.y;

  float brightness = smoothstep(0.2, 0.190, length(uv));
  vec3 col = mix(vec3(1.), vec3(1., 0., 0.), brightness);

  gl_FragColor = vec4(1., v_uv.r, 0., 1.);
}
