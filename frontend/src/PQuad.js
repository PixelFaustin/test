export default class PQuad {
  constructor(gl) {
    this.gl = gl;
    this.positionVBO = null;

    this.vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    this.vertexCount = this.vertices.length / 2;
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

    return this;
  };

  bind = () => {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);
  };
}
