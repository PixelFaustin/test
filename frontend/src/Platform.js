export default class Platform {
  constructor(position, texture) {
    this.position = position;
    this.texture = texture;
    this.width = 128;
    this.height = 32;
  }

  isIntersecting(player) {
    const [playerX, playerY] = player.position;
    const [platformX, platformY] = this.position;

    var rect1 = {
      x: playerX,
      y: playerY,
      width: player.width,
      height: player.height
    };
    var rect2 = {
      x: platformX,
      y: platformY,
      width: this.width,
      height: this.height
    };

    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }
}
