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

  addObstacle(x, y) {
    // Code to add an obstacle at the specified position
  }

  removeObstacle(x, y) {
    // Code to remove an obstacle from the specified position
  }

  checkCollision(x, y) {
    // Code to check for collisions with obstacles or other players
  }
  getRandomBinary() {
    return Math.floor(Math.random() * 2);
  }

  getIndex(row, col) {
    return row * this.cols + col;
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
}

module.exports = Gameboard;
