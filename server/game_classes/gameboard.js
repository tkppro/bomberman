export default class Gameboard {
  constructor(rows, cols) {
    this.rows = rows; // rows of the game board
    this.cols = cols; // cols of the game board
    this.grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, this.getRandomBinary)
    );

    this.obstacles = []; // Array to store obstacles on the game board
    this.players = []; // Array to store active players in the game
    this.bombs = []; // Array to store active bombs in the game
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
    return Math.floor(Math.random() * 3);
  }
}
