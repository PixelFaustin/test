import React, { Component } from 'react';

import * as glm from 'gl-matrix';

import WGLRenderer from './WGLRenderer';
import FileDownloader from './FileDownloader';
import Texture from './Texture';
import PlayerController from './PlayerController';
import Player from './Player';
import Platform from './Platform';

class Game {
  constructor() {
    this.canvas = undefined;
    this.gl = undefined;
    this.precompiled = false;

    this.renderer = new WGLRenderer();
    this.downloader = new FileDownloader();
    this.player = new Player();
    this.playerController = new PlayerController(this.player);
    window.onkeyup = this.handleKeyPress;
  }

  handleKeyPress = e => {
    if (e) {
      const key = e.keyCode ? e.keyCode : e.which;
      this.playerController.keyPressed(key);
    }
  };

  setupGraphics = canvas => {
    this.canvas = canvas;
    this.isRenderReady = false;

    if (this.canvas) {
      console.log('Setting up graphics!');
      this.gl = this.canvas.getContext('webgl');

      if (!this.gl) {
        alert('Error: Your browser does not support WebGL!');
        return;
      }

      this.renderer
        .initialize(this.gl, this.canvas)
        .then(() => {
          return this.downloader.downloadImages([
            '/images/bus/buspickup.png',
            '/images/smiley.png',
            '/images/cat.png',
            '/images/bus/clouds.png',
            '/images/bus/bus.png',
            '/images/bus/tire.png',
            '/images/bus/busdoor.png',
            '/images/bus/snow.png'
          ]);
        })
        .then(images => {
          this.backgroundTexture = new Texture().build(this.gl, images[0]);
          this.ballTexture = new Texture().build(this.gl, images[1]);
          this.catTexture = new Texture().build(this.gl, images[2]);
          this.cloudTexture = new Texture().build(this.gl, images[3]);
          this.busBodyTexture = new Texture().build(this.gl, images[4]);
          this.busTireTexture = new Texture().build(this.gl, images[5]);
          this.busDoorTexture = new Texture().build(this.gl, images[6]);
          this.snowTexture = new Texture().build(this.gl, images[7]);
          this.isRenderReady = true;
        });
    }
  };

  setup() {
    this.platforms = [
      new Platform(glm.vec2.fromValues(300, 400), this.backgroundTexture)
    ];

    this.startTime = performance.now();
    this.player.velocity = glm.vec2.fromValues(0, 100, 0);
  }

  tick = () => {
    const now = performance.now();
    const dt = now - this.startTime;
    this.startTime = performance.now();
  };

  labRender = () => {
    this.renderer.initFrame();

    this.renderer.drawTexture(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.catTexture
    );
  };

  render = () => {
    this.renderer.initFrame();
    this.renderer.drawTexture(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      this.backgroundTexture
    );
    this.renderer.drawSlidingTexture(
      0,
      this.canvas.height - this.cloudTexture.height,
      1280,
      0,
      0.1 / 10,
      0,
      this.cloudTexture
    );

    this.renderer.drawTexture(200 + 40, 100, 0, 0, this.busBodyTexture);
    this.renderer.drawTextureRotated(
      291 + 40,
      60,
      0,
      0,
      -performance.now() * 0.1,
      this.busTireTexture
    );
    this.renderer.drawTextureRotated(
      713 + 40,
      60,
      0,
      0,
      -performance.now() * 0.1,
      this.busTireTexture
    );
    this.renderer.drawTexture(620 + 40, 119, 0, 0, this.busDoorTexture);
    this.renderer.drawSlidingTexture(
      0,
      this.canvas.height - this.cloudTexture.height - this.snowTexture.height,
      this.canvas.width,
      0,
      0,
      -0.2,
      this.snowTexture
    );
  };

  gameLoop = () => {
    this.tick();
    this.render();
    this.paintHook = requestAnimationFrame(this.gameLoop);
  };

  run = () => {
    if (this.isRenderReady) {
      this.setup();
      this.gameLoop();
    } else {
      setTimeout(() => {
        this.run();
      }, 300);
    }
  };
}

export default class GameWindow extends Component {
  constructor(props) {
    super(props);
    this.game = new Game();
  }

  componentDidMount = () => {
    this.game.run();
  };

  render() {
    return (
      <canvas
        id="game-canvas"
        ref={canvas => {
          this.game.setupGraphics(canvas);
        }}
      />
    );
  }
}
