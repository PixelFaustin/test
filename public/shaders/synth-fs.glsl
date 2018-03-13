#version 100
precision mediump float;

uniform vec2 u_resolution;

uniform sampler2D u_texture0;
uniform float u_time;

varying vec2 v_uv;

vec3 SYNTH_PINK = vec3(.93, .45, .71);
vec3 SYNTH_BLUE = vec3(.0, .26, .94);
void main()
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float height = uv.y;
  uv = (uv * 2.) - 1.;
  uv.x *= u_resolution.x / u_resolution.y;
  
  uv.y = mod(uv.y+u_time*(0.02 * 4.), 0.02);
    
  vec3 col = vec3(0.) + SYNTH_PINK * step(0.01, uv.y);

  vec4 image = texture2D(u_texture0, v_uv);
  float a = image.a;

  float brightness = 1.8;
  vec3 image_rgb = SYNTH_PINK * image.r * brightness;

  vec3 color = mix(col, image_rgb, a); 

  gl_FragColor = vec4(color, 1.);
}
