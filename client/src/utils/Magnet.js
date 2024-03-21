const { Chess } = require('chess.js')

const DIRECTIONS = {
  N: '008',
  S: '009',
  W: '00A',
  E: '00B',
  NW: '00C',
  NE: '00D',
  SW: '00E',
  SE: '00F',
}

export class Magnet {
  constructor() {
    this._position = {
      x: 0,
      y: 0,
    }
    this._instructions = ['0100']
    this._isOn = false
    this._chess = new Chess()
  }

  get position() {
    return this._position
  }

  set position(pos) {
    this._position.x = pos.x
    this._position.y = pos.y
  }

  get instructions() {
    return this._instructions // TODO: simplify instructions
  }

  resetInstructions() {
    this._instructions = ['0100']
  }

  makeMove(notation) {
    if (notation === 'O-O' || notation === 'O-O-O') {
      return this.castle(notation)
    }
    const fromRaw = `${notation[0]}${notation[1]}`
    const toRaw = `${notation[2]}${notation[3]}`
    const from = Magnet.convertChessNotationToXY(fromRaw)
    const to = Magnet.convertChessNotationToXY(toRaw)
    const piece = this._chess.get(fromRaw)
    const move = this._chess.move({ from: fromRaw, to: toRaw })

    if (move.captured) {
      this.removePiece(to)
    }

    if (piece.type === 'n') {
      return this.moveKnight(from, to)
    }

    this.moveTo(from)
    this.turnOn()

    const dx = to.x - from.x
    const dy = to.y - from.y

    if (Math.abs(dx) === Math.abs(dy)) {
      const direction =
        dx > 0 && dy > 0
          ? DIRECTIONS.NE
          : dx > 0 && dy < 0
            ? DIRECTIONS.SE
            : dx < 0 && dy > 0
              ? DIRECTIONS.NW
              : DIRECTIONS.SW
      this._instructions.push(`${direction} ${Math.abs(dx)}`)
    } else {
      if (dx !== 0) {
        const direction = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W
        this._instructions.push(`${direction} ${Math.abs(dx)}`)
      } else {
        const direction = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S
        this._instructions.push(`${direction} ${Math.abs(dy)}`)
      }
    }

    this.turnOff()

    this._position.x = to.x
    this._position.y = to.y
  }

  moveKnight(from, to) {
    this.moveTo(from)
    this.turnOn()

    let dx = to.x - from.x
    let dy = to.y - from.y

    const offsetDirection =
      dx > 0 && dy > 0
        ? DIRECTIONS.NE
        : dx > 0 && dy < 0
          ? DIRECTIONS.SE
          : dx < 0 && dy > 0
            ? DIRECTIONS.NW
            : DIRECTIONS.SW

    this._instructions.push(`${offsetDirection}1`)

    dx = dx > 0 ? dx - 0.5 : dx + 0.5
    dy = dy > 0 ? dy - 0.5 : dy + 0.5

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S

    if (Math.abs(dx) < 1) {
      this._instructions.push(`${directionY}2`)
    } else {
      this._instructions.push(`${directionX}2`)
    }
    this._instructions.push(`${offsetDirection}1`)

    this.turnOff()

    this._position.x = to.x
    this._position.y = to.y
  }

  castle(notation) {
    const color = this._chess.turn()
    this._chess.move(notation)
    const whiteRookPos = notation === 'O-O' ? { x: 7, y: 0 } : { x: 0, y: 0 }
    const blackRookPos = notation === 'O-O' ? { x: 7, y: 7 } : { x: 0, y: 7 }

    if (color === 'w') {
      this.moveTo(whiteRookPos)
      this.turnOn()
      if (notation === 'O-O') {
        this._instructions.push(`${DIRECTIONS.W}4`)
        this.turnOff()
        this._instructions.push(`${DIRECTIONS.W}2`)
        this.turnOn()
        this._instructions.push(`${DIRECTIONS.NE}1`)
        this._instructions.push(`${DIRECTIONS.E}2`)
        this._instructions.push(`${DIRECTIONS.SE}1`)
        this.turnOff()
      } else {
        this._instructions.push(`${DIRECTIONS.E}6`)
        this.turnOff()
        this._instructions.push(`${DIRECTIONS.E}2`)
        this.turnOn()
        this._instructions.push(`${DIRECTIONS.NW}1`)
        this._instructions.push(`${DIRECTIONS.W}2`)
        this._instructions.push(`${DIRECTIONS.SW}1`)
        this.turnOff()
      }
    } else {
      this.moveTo(blackRookPos)
      this.turnOn()
      if (notation === 'O-O') {
        this._instructions.push(`${DIRECTIONS.W}4`)
        this.turnOff()
        this._instructions.push(`${DIRECTIONS.W}2`)
        this.turnOn()
        this._instructions.push(`${DIRECTIONS.SE}1`)
        this._instructions.push(`${DIRECTIONS.E}2`)
        this._instructions.push(`${DIRECTIONS.NE}1`)
        this.turnOff()
      } else {
        this._instructions.push(`${DIRECTIONS.E}6`)
        this.turnOff()
        this._instructions.push(`${DIRECTIONS.E}2`)
        this.turnOn()
        this._instructions.push(`${DIRECTIONS.SW}1`)
        this._instructions.push(`${DIRECTIONS.W}2`)
        this._instructions.push(`${DIRECTIONS.NW}1`)
        this.turnOff()
      }
    }
  }

  removePiece(position) {
    this.moveTo(position)
    this.turnOn()
    const targetPosition = { x: 3.5, y: 3.5 }

    let dx = targetPosition.x - position.x
    let dy = targetPosition.y - position.y

    const offsetDirection =
      dx > 0 && dy > 0
        ? DIRECTIONS.NE
        : dx > 0 && dy < 0
          ? DIRECTIONS.SE
          : dx < 0 && dy > 0
            ? DIRECTIONS.NW
            : DIRECTIONS.SW

    this._instructions.push(`${offsetDirection}1`)

    dx = dx > 0 ? dx - 0.5 : dx + 0.5
    dy = dy > 0 ? dy - 0.5 : dy + 0.5

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S

    this._instructions.push(`${directionX}${Math.abs(dx)*2}`)
    this._instructions.push(`${directionY}${Math.abs(dy)*2}`)

    this._position.x = targetPosition.x
    this._position.y = targetPosition.y
    this.turnOff()
  }

  moveTo(position) {
    const dx = position.x - this._position.x
    const dy = position.y - this._position.y

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S

    this._instructions.push(`${directionX}${Math.abs(dx)*2}`)
    this._instructions.push(`${directionY}${Math.abs(dy)*2}`)

    this._position.x = position.x
    this._position.y = position.y
  }

  static convertChessNotationToXY(notation) {
    return {
      x: notation.charCodeAt(0) - 'a'.charCodeAt(0),
      y: notation.charAt(1) - '0' - 1,
    }
  }

  turnOn() {
    this._instructions.push('0140')
  }

  turnOff() {
    this._instructions.push('0100')
  }

  goHome() {
    this._instructions.push('0180')
    this._position = {
      x: 0,
      y: 0,
    }
  }
}
