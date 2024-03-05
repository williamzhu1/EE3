const { Chess } = require("chess.js");

class Magnet {
  constructor() {
    this._position = {
      x: 0,
      y: 0,
    };
    this._instructions = ["MAGNET OFF"];
    this._isOn = false;
  }

  get position() {
    return this._position;
  }

  get instructions() {
    return this._instructions; // TODO: simplify instructions
  }

  resetInstructions() {
    this._instructions = ["MAGNET OFF"];
  }

  moveTo(position) {
    if (this.position.x === position.x && this.position.y === position.y) return;

    let dx = position.x - this.position.x;
    let dy = position.y - this.position.y;

    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      dx = dx > 0.5 ? 0.5 : dx < -0.5 ? -0.5 : 0;
      dy = dy > 0.5 ? 0.5 : dy < -0.5 ? -0.5 : 0;
    } else {
      dx = dx !== 0 ? dx : 0;
      dy = dy !== 0 ? dy : 0;
    }

    const directionX = dx > 0 ? "EAST" : dx < 0 ? "WEST" : "";
    const directionY = dy > 0 ? "NORTH" : dy < 0 ? "SOUTH" : "";

    if (dx !== 0) {
      this._position.x += dx;
      this._instructions.push(`${directionX} ${Math.abs(dx)}`);
    }
    if (dy !== 0) {
      this._position.y += dy;
      this._instructions.push(`${directionY} ${Math.abs(dy)}`);
    }

    this.moveTo(position);
  }

  turnOn() {
    this._instructions.push("MAGNET ON");
  }

  turnOff() {
    this._instructions.push("MAGNET OFF");
  }

  goHome() {
    this._instructions.push("HOME");
    this._position = {
      x: 0,
      y: 0,
    };
  }
}

const convertChessNotationToXY = (notation) => {
  return {
    x: notation.charCodeAt(0) - "a".charCodeAt(0),
    y: notation.charAt(1) - "0" - 1,
  };
};

// DEMO
const magnet = new Magnet();
const moves = ["b1c3", "e7e5", "g1h3", "b8a6"];

for (let i = 0; i < moves.length; i++) {
  const start = convertChessNotationToXY(`${moves[i][0]}${moves[i][1]}`);
  const end = convertChessNotationToXY(`${moves[i][2]}${moves[i][3]}`);
  magnet.moveTo(start);
  magnet.turnOn();
  magnet.moveTo(end);
  magnet.goHome();
  console.log(magnet.instructions);
  magnet.resetInstructions();
}
