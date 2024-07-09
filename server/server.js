import Gameboard from "./game_classes/gameboard";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

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

let players = {};
const getRandomBinary = () => {
  return Math.floor(Math.random() * 3);
};
let gameBoard = new Gameboard(GRID_ROWS, GRID_COLUMNS);

let grid = gameBoard.grid;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  players[socket.id] = { x: 0, y: 0, id: socket.id };
  console.log("INITIAL GRID, ", grid);
  // Send current grid state to new player
  socket.emit("currentGrid", grid);

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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
    grid[row][col] = 3; // 3 represents bomb
    console.log("PLACED BOMB AT: ", row, col);
    io.emit("updateGrid", { row, col, value: 3 });
    setTimeout(() => {
      io.emit("bombExploded", bomb);
    }, 3000); // Bomb explodes after 3 seconds
  });

  socket.on("placeObstacle", ({ row, col }) => {
    grid[row][col] = 1; // 1 represents obstacle
    io.emit("updateGrid", { row, col, value: 1 });
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
