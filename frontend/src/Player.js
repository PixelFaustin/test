import * as glm from 'gl-matrix';

export default class Player {
  constructor() {
    this.position = glm.vec2.fromValues(300, 100);
    this.velocity = glm.vec2.fromValues(0, 0);
    this.acceleration = glm.vec2.fromValues(0, -350);
    this.width = 64;
    this.height = 64;
  }

  jump = () => {
    this.velocity = glm.vec2.add(
      glm.vec2.create(),
      this.velocity,
      glm.vec2.fromValues(0, 500)
    );
  };

  move = direction => {
    this.velocity = glm.vec2.add(
      glm.vec2.create(),
      this.velocity,
      glm.vec2.fromValues(90 * direction, 0)
    );
  };

  tick = dt => {
    this.position = glm.vec2.add(
      this.position,
      this.position,
      glm.vec2.scale(glm.vec2.create(), this.velocity, dt)
    );

    this.velocity = glm.vec2.add(
      this.velocity,
      this.velocity,
      glm.vec2.scale(glm.vec2.create(), this.acceleration, dt)
    );
  };
}
