const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const Gameboard = require("./game_classes/gameboard");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const GRID_COLUMNS = 15;
const GRID_ROWS = 15;
const BOMB_TIMING = 3000; // bomb timing explosion
// let players = {};

const gameBoard = new Gameboard(GRID_ROWS, GRID_COLUMNS);
let players = gameBoard.players;

let grid = gameBoard.grid;

io.on("connection", (socket) => {
  gameBoard.addPlayer(socket.id);

  // Send current grid state to new player
  socket.emit("currentGrid", grid);

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (Object.keys(players).length == 1) gameBoard.cleanOccupied();
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });

  socket.on("playerMovement", (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      socket.broadcast.emit("playerMoved", players[socket.id]);
    }
  });

  socket.on("placeBomb", (bomb) => {
    io.emit("bombPlaced", bomb);
    row = bomb.x;
    col = bomb.y;
    grid[row][col] = 2; // 2 represents bomb
    console.log("PLACED BOMB AT: ", row, col);
    io.emit("updateGrid", { row, col, value: 2 });
    setTimeout(() => {
      io.emit("bombExploded", bomb);
    }, BOMB_TIMING); // Bomb explodes after 3 seconds
  });

  // socket.on("placeObstacle", ({ row, col }) => {
  //   grid[row][col] = 1; // 1 represents obstacle
  //   io.emit("updateGrid", { row, col, value: 1 });
  // });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
