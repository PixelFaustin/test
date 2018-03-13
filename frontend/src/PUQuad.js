export default class PUQuad {
  constructor(gl) {
    this.gl = gl;
    this.positionVBO = null;

    this.vertices = [1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1];
    this.uvs = [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0];
    this.indices = [0, 1, 2, 3, 4, 5];
    this.indexCount = this.indices.length;
  }

  build = () => {
    const { gl } = this;

    this.positionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVBO);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW
    );

    this.uvVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVBO);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.uvs),
      this.gl.STATIC_DRAW
    );

    this.indexVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indices),
      this.gl.STATIC_DRAW
    );

    return this;
  };

  bind = program => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);
    program.setAttribPointer('a_position', 2, this.gl.FLOAT);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvVBO);
    program.setAttribPointer('a_uv', 2, this.gl.FLOAT);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
  };
}
