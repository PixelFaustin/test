import React, { Component } from 'react';

import WGLRenderer from './WGLRenderer';
import FileDownloader from './FileDownloader';
import Texture from './Texture';
class Game {
  constructor() {
    this.canvas = undefined;
    this.gl = undefined;
    this.precompiled = false;

    this.renderer = new WGLRenderer();
    this.downloader = new FileDownloader();
  }

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
          return this.downloader.downloadImages(['/images/sky.png']);
        })
        .then(images => {
          this.backgroundTexture = new Texture().build(this.gl, images[0]);
          this.isRenderReady = true;
        });
    }
  };

  tick = () => {};

  render = () => {
    console.log('Rendering!');
    this.renderer.initFrame();
    this.renderer.render(this.backgroundTexture);
  };

  run = () => {
    this.tick();

    if (this.isRenderReady) {
      this.render();
    }

    this.paintHook = requestAnimationFrame(this.run);
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
