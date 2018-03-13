function compileShader(gl, type, src) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "Could not compile shader, here's what we know: " +
        gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default class ShaderProgram {
  constructor(gl) {
    this.gl = gl;
    this.attributeMap = {};
    this.uniformMap = {};
    //{'u_resolution': {getter: uVec2, location: 0}}
  }

  attachVertexSrc = vert => {
    this.vertexShader = compileShader(this.gl, this.gl.VERTEX_SHADER, vert);

    return this;
  };

  attachFragmentSrc = frag => {
    this.fragmentShader = compileShader(this.gl, this.gl.FRAGMENT_SHADER, frag);

    return this;
  };

  build = () => {
    const { vertexShader, fragmentShader } = this;

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      alert(
        'Unable to initialize the shader program: ' +
          this.gl.getProgramInfoLog(this.program)
      );
    }

    return this;
  };

  loadUniforms = uniformMap => {
    this.bind();

    let success = true;
    Object.keys(uniformMap).forEach(key => {
      const location = this.gl.getUniformLocation(this.program, key);

      if (location < 0) {
        alert(`Could not load uniform ${key}`);
        success = false;
      } else {
        this.uniformMap[key] = { getter: uniformMap[key], location };
      }
    });

    return success;
  };

  loadAttributes = attributes => {
    this.bind();
    let success = true;
    attributes.forEach(attribute => {
      const location = this.gl.getAttribLocation(this.program, attribute);

      if (location < 0) {
        alert(`Could not load attribute ${attribute}`);
        success = false;
      } else {
        this.attributeMap[attribute] = location;
      }
    });

    return success;
  };

  setUniform = (name, value) => {
    const { getter, location } = this.uniformMap[name];

    getter(this.gl, location, value);
  };

  setAttribPointer = (attribute, size, type) => {
    this.gl.vertexAttribPointer(
      this.attributeMap[attribute],
      size,
      type,
      false,
      0,
      0
    );
  };

  enableAttribs = () => {
    Object.keys(this.attributeMap).forEach(attr => {
      this.gl.enableVertexAttribArray(this.attributeMap[attr]);
    });
  };

  bind = () => {
    this.gl.useProgram(this.program);
    this.enableAttribs();
  };
}
