class Bomb {
  constructor(id, x, y, power, playerId) {
    this.id = id; // Bomb ID
    this.x = x; // Bomb x position
    this.y = y; // Bomb y position
    this.power = power; // Bomb explosion power radius
    this.playerId = playerId; // ID of the player who placed the bomb
    this.timer = 3000; // Timer before the bomb explodes (in milliseconds)
    this.spriteUrl = "/assets/bomb.png";
  }

  explode() {
    // Code to trigger bomb explosion
  }
}
