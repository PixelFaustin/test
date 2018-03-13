import ShaderProgram from './ShaderProgram';
import PQuad from './PQuad';
import Texture from './Texture';
import PUQuad from './PUQuad';
function uVec2(gl, loc, value) {
  gl.uniform2fv(loc, value);
}

function uInt(gl, loc, value) {
  gl.uniform1i(loc, value);
}

function uFloat(gl, loc, value) {
  gl.uniform1f(loc, value);
}

export default class WGLRenderer {
  constructor() {
    this.gl = undefined;
    this.precompiled = false;
  }

  initialize = (gl, canvas) => {
    return new Promise((resolve, reject) => {
      this.gl = gl;
      this.canvas = canvas;

      if (!this.precompiled) {
        this.precompiled = true;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

        Promise.all([
          fetch('/shaders/default-vs.glsl'),
          fetch('/shaders/default-fs.glsl')
        ])
          .then(values => {
            return Promise.all([values[0].text(), values[1].text()]);
          })
          .then(values => {
            const [vertexSrc, fragmentSrc] = values;

            this.defaultProgram = new ShaderProgram(this.gl)
              .attachVertexSrc(vertexSrc)
              .attachFragmentSrc(fragmentSrc)
              .build();

            const uniforms = {
              u_resolution: uVec2,
              u_size: uVec2,
              u_texture0: uInt,
              u_position: uVec2,
              u_time: uFloat,
              u_panningSpeed: uVec2,
              u_angle: uFloat
            };
            const attributes = ['a_position', 'a_uv'];

            this.defaultProgram.loadUniforms(uniforms);
            this.defaultProgram.loadAttributes(attributes);
            this.quad = new PUQuad(this.gl).build();
            //this.quad = new PQuad(this.gl).build();
            resolve();
          });
      }
    });
  };

  resize = () => {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = this.canvas.clientWidth;
    var displayHeight = this.canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (
      this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight
    ) {
      // Make the this.renderer.defaultProgramcanvas the same size
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }
  };

  render = texture => {};

  drawTexture(x, y, width, height, texture) {
    width = width || texture.width;
    height = height || texture.height;

    this.defaultProgram.bind();

    this.quad.bind(this.defaultProgram);

    texture.bind();
    this.defaultProgram.setUniform('u_resolution', [
      this.canvas.width,
      this.canvas.height
    ]);
    this.defaultProgram.setUniform('u_size', [width, height]);
    this.defaultProgram.setUniform('u_position', [x, y]);
    this.defaultProgram.setUniform('u_texture0', 0);
    this.defaultProgram.setUniform('u_time', performance.now() / 1000);
    this.defaultProgram.setUniform('u_panningSpeed', [0, 0]);
    this.defaultProgram.setUniform('u_angle', 0);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quad.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }

  drawSlidingTexture = (x, y, width, height, x_speed, y_speed, texture) => {
    width = width || texture.width;
    height = height || texture.height;

    this.defaultProgram.bind();

    this.quad.bind(this.defaultProgram);

    texture.bind();
    this.defaultProgram.setUniform('u_resolution', [
      this.canvas.width,
      this.canvas.height
    ]);
    this.defaultProgram.setUniform('u_size', [width, height]);
    this.defaultProgram.setUniform('u_position', [x, y]);
    this.defaultProgram.setUniform('u_texture0', 0);
    this.defaultProgram.setUniform('u_time', performance.now() / 1000);
    this.defaultProgram.setUniform('u_panningSpeed', [x_speed, y_speed]);
    this.defaultProgram.setUniform('u_angle', 0);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quad.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  };

  drawTextureRotated = (x, y, width, height, angle, texture) => {
    width = width || texture.width;
    height = height || texture.height;

    this.defaultProgram.bind();

    this.quad.bind(this.defaultProgram);

    texture.bind();
    this.defaultProgram.setUniform('u_resolution', [
      this.canvas.width,
      this.canvas.height
    ]);
    this.defaultProgram.setUniform('u_size', [width, height]);
    this.defaultProgram.setUniform('u_position', [x, y]);
    this.defaultProgram.setUniform('u_texture0', 0);
    this.defaultProgram.setUniform('u_time', performance.now() / 1000);
    this.defaultProgram.setUniform('u_panningSpeed', [0, 0]);
    this.defaultProgram.setUniform('u_angle', angle);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quad.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  };

  drawPlatform = platform => {
    this.drawTexture(...platform.position, 0, 0, platform.texture);
  };

  postprocessSnow = () => {};

  clear = () => {
    this.gl.clearColor(1, 0, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  };

  initFrame = () => {
    this.resize();
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.clear();
  };
}
