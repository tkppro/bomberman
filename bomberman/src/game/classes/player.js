export default class Player {
  constructor(id, name, x, y) {
    this.id = id; // Player ID
    this.name = name; // Player name
    this.x = x; // Current x position
    this.y = y; // Current y position
    this.bombs = []; // Bombs placed by the player
    this.power = 1; // Bomb power level
    this.maxBombs = 1; // Maximum bombs player can place at once
    this.speed = 1; // Player movement speed
    this.img = "/assets/player.png"; // URL to the player's sprite image
  }

  move(direction) {
    // Code to move the player in the specified direction
  }

  placeBomb() {
    // Code to place a bomb at the player's current position
  }
}
