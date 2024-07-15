const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const Gameboard = require("./game_classes/gameboard");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.HOST_NAME, // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Use CORS middleware
app.use(
  cors({
    origin: process.env.HOST_NAME, // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const GRID_COLUMNS = 15;
const GRID_ROWS = 15;
const BOMB_TIMING = 2000; // bomb timing explosion
const BOMB_EXPLOSION_RANGE = 2; // bomb explosion range

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
    if (Object.keys(players).length == 1) gameBoard.cleanOccupied();
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });

  socket.on("playerMovement", (movementData) => {
    if (players[movementData.id]) {
      if (gameBoard.checkPlayerMove(movementData)) {
        players[movementData.id].x = movementData.x;
        players[movementData.id].y = movementData.y;
        socket.broadcast.emit("playerMoved", {
          id: movementData.id,
          ...movementData,
        });
        socket.emit("playerMoved", {
          id: movementData.id,
          ...movementData,
        });
      }
    }
  });

  socket.on("placeBomb", (bomb) => {
    let col = bomb.x;
    let row = bomb.y;
    grid[gameBoard.getIndex(row, col)] = 2; // 2 represents bomb
    io.emit("updateGrid", { row, col, value: 2 });
    setTimeout(() => {
      const { destroyCells, userDeaths } = gameBoard.getDestroyedCellByBomb(
        bomb,
        BOMB_EXPLOSION_RANGE
      );
      for (const value of destroyCells) {
        grid[gameBoard.getIndex(value.y, value.x)] = 0;
      }

      io.emit("bombExploded", Array.from(destroyCells));
      io.emit("updateGrid", { row, col, value: 0 });
      for (const user of userDeaths) {
        delete players[user.id];
        io.emit("playerLose", user.id);
      }
    }, BOMB_TIMING); // Bomb explodes after 3 seconds
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
