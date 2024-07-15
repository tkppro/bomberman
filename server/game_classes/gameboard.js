class Gameboard {
  constructor(rows, cols) {
    this.rows = rows; // rows of the game board
    this.cols = cols; // cols of the game board
    this.grid = Array.from({ length: rows * cols }, this.getRandomBinary);

    this.obstacles = []; // Array to store obstacles on the game board
    this.players = {}; // Array to store active players in the game
    this.bombs = []; // Array to store active bombs in the game
    this.occupied = new Set();
  }

  resetGrid() {
    this.grid = Array.from({ length: rows * cols }, this.getRandomBinary);
  }

  getRandomBinary() {
    return Math.floor(Math.random() * 2);
  }

  getIndex(row, col) {
    return row * this.cols + col;
  }

  checkPlayerMove(movementData) {
    let row = movementData.y;
    let col = movementData.x;
    let cell = this.grid[this.getIndex(row, col)];
    if (cell !== 0) return false;
    return true;
  }

  isValidPosition(row, col) {
    // Check if the position itself is valid
    if (
      this.grid[this.getIndex(row, col)] !== 0 ||
      this.occupied.has(this.getIndex(row, col))
    ) {
      return false;
    }
    // Check top cell
    if (
      (row > 0 && this.grid[this.getIndex(row - 1, col)] !== 0) ||
      this.occupied.has(this.getIndex(row - 1, col))
    ) {
      return false;
    }
    // Check bottom cell
    if (
      (row < this.rows - 1 && this.grid[this.getIndex(row + 1, col)] !== 0) ||
      this.occupied.has(this.getIndex(row + 1, col))
    ) {
      return false;
    }
    // Check left cell
    if (
      (col > 0 && this.grid[this.getIndex(row, col - 1)] !== 0) ||
      this.occupied.has(this.getIndex(row, col - 1))
    ) {
      return false;
    }
    // Check right cell
    if (
      (col < this.cols - 1 && this.grid[this.getIndex(row, col + 1)] !== 0) ||
      this.occupied.has(this.getIndex(row, col + 1))
    ) {
      return false;
    }
    return true;
  }

  getRandomValidPosition() {
    let visited = new Set();
    while (true) {
      let row = Math.floor(Math.random() * this.rows);
      let col = Math.floor(Math.random() * this.cols);
      if (!visited.has(this.getIndex(row, col)))
        if (this.isValidPosition(row, col)) {
          return { row, col };
        }
      visited.add(this.getIndex(row, col));
    }
  }

  addPlayer(id) {
    this.players[id] = (() => {
      let { row, col } = this.getRandomValidPosition(
        this.grid,
        this.rows,
        this.cols
      );
      this.occupied.add(this.getIndex(row, col));
      this.occupied.add(this.getIndex(row - 1, col));
      this.occupied.add(this.getIndex(row + 1, col));
      this.occupied.add(this.getIndex(row, col - 1));
      this.occupied.add(this.getIndex(row, col + 1));
      return { x: col, y: row, id: id };
    })();
  }
  cleanOccupied() {
    this.occupied = new Set();
  }

  getDestroyedCellByBomb(bomb, explosionRange) {
    let row = bomb.y;
    let col = bomb.x;
    let destroyCells = new Set();
    destroyCells.add({ x: col, y: row });
    let top = false;
    let down = false;
    let left = false;
    let right = false;
    let userDeaths = new Set();
    Array.from({ length: explosionRange }, (x, i) => {
      let _range = i + 1;
      if (!down)
        down = this._checkBombExplosion(
          row + _range,
          col,
          destroyCells,
          userDeaths
        );
      if (!top)
        top = this._checkBombExplosion(
          row - _range,
          col,
          destroyCells,
          userDeaths
        );
      if (!right)
        right = this._checkBombExplosion(
          row,
          col + _range,
          destroyCells,
          userDeaths
        );
      if (!left)
        left = this._checkBombExplosion(
          row,
          col - _range,
          destroyCells,
          userDeaths
        );
    });

    return { destroyCells, userDeaths };
  }

  _checkBombExplosion(row, col, destroyCells, userDeaths) {
    if (isNaN(row) || isNaN(col)) return false;
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols)
      return false;
    // check player in range of explosion
    for (const [key, value] of Object.entries(this.players)) {
      if (value.x === col && value.y === row) {
        userDeaths.add({ x: col, y: row, id: key });
        console.log("USER ID : ", key, " died");
      }
    }

    if (this.grid[this.getIndex(row, col)] === 0) return false;
    else if (this.grid[this.getIndex(row, col)] === 1) {
      this.grid[this.getIndex(row, col)] = 0;
      destroyCells.add({ x: col, y: row });
    }
    return true;
  }
}

module.exports = Gameboard;
