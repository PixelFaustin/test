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

        Promise.all([
          fetch('/shaders/box-game-vs.glsl'),
          fetch('/shaders/box-game-fs.glsl')
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

            console.log(this.defaultProgram);

            const uniforms = {
              u_resolution: uVec2,
              u_texture0: uInt
            };
            const attributes = ['a_position', 'a_uv'];

            this.defaultProgram.loadUniforms(uniforms);
            this.defaultProgram.loadAttributes(attributes);
            this.quad = new PUQuad(this.gl).build();
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

  render = texture => {
    this.defaultProgram.bind();
    this.quad.bind();
    this.defaultProgram.enableAttribs();
    this.defaultProgram.setAttribPointer('a_position', 2, this.gl.FLOAT);
    this.defaultProgram.setAttribPointer('a_uv', 2, this.gl.FLOAT);
    //texture.bind();
    this.defaultProgram.setUniform('u_resolution', [
      this.canvas.width,
      this.canvas.height
    ]);
    this.defaultProgram.setUniform('u_texture0', 0);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.quad.indexCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  };

  drawTexture(x, y, texture) {}

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
