precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

uniform vec2 u_resolution;
uniform vec2 u_size;
uniform vec2 u_position;

varying vec2 v_uv;

void main() 
{
  vec2 size = u_size;
  //size.x /= 3.;
  vec2 vertex_position = (a_position + 1.) / 2.0;
  vertex_position *= (size / u_resolution);
  vertex_position.x += u_position.x /  u_resolution.x;
  vertex_position.y += u_position.y / u_resolution.y;
  vertex_position = (vertex_position * 2.0) - 1.0;

  v_uv = a_uv;
  gl_Position = vec4(vertex_position, 0., 1.);
}
