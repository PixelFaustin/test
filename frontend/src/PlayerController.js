export default class PlayerController {
  constructor(player) {
    this.activePlayer = player;
  }

  keyPressed(key) {
    const keymap = {
      32: () => {
        this.activePlayer.jump();
      },
      65: () => {
        this.activePlayer.move(-1);
      },
      68: () => {
        this.activePlayer.move(1);
      }
    };

    const val = keymap[key];
    if (val) {
      val();
    }
  }
}
