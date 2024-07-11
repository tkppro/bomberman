<template>
  <div id="gameArea">
    <background-music />
    <div
      v-for="(cell, index) in grid"
      :key="index"
      :style="{
        left: (index % GRID_COLUMNS) * cellSize + 'px',
        top: Math.floor(index / GRID_COLUMNS) * cellSize + 'px',
      }"
      class="cell"
      :class="{
        floor: cell === 0,
        obstacle: cell === 1,
        bomb: cell === 2,
      }"
    ></div>
    <div
      v-for="player in players"
      :key="player.id"
      :style="{
        left: player.x * cellSize + 'px',
        top: player.y * cellSize + 'px',
      }"
      class="player"
    >
      {{ player.id }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import Player from "../game/classes/player.js";
import Bomb from "../game/classes/bomb.js";
import Gameboard from "../game/classes/gameboard.js";
import Obstacle from "../game/classes/obstacle.js";

import socket from "../socket";
import BackgroundMusic from "./BackgroundMusic.vue";

export default {
  components: { BackgroundMusic },
  name: "Game",
  setup() {
    const GRID_ROWS = 15;
    const GRID_COLUMNS = 15;
    const cellSize = 40;
    const BOMB_EXPLOSION_RANGE = 1;
    const grid = ref();
    const players = ref({});
    const playerId = ref(null);

    socket.on("currentPlayers", (playersData) => {
      players.value = playersData;
    });

    socket.on("currentGrid", (gridData) => {
      grid.value = gridData;
    });

    socket.on("updateGrid", ({ row, col, value }) => {
      grid.value[getGridIndex(row, col)] = value;
    });

    socket.on("newPlayer", (player) => {
      players.value = { ...players.value, [player.id]: player };
    });

    const getGridIndex = (x, y) => {
      return y * GRID_COLUMNS + x;
    };

    for (const player in players.value) {
      const index = getGridIndex(player.x, player.y);
      grid.value[index] = 0;
    }

    socket.on("playerDisconnected", (id) => {
      const { [id]: _, ...rest } = players.value;
      players.value = rest;
    });

    socket.on("playerMoved", (movementData) => {
      console.log("Player can move ", movementData);
      players.value[movementData.id].x = movementData.x;
      players.value[movementData.id].y = movementData.y;
    });

    const handleBombPlacement = () => {
      const player = players.value[socket.id];
      if (!player) return;
      console.log(
        "User " + socket.id + " has placed bomb at x: " + player.x,
        ", y: " + player.y
      );
      grid.value[getGridIndex(player.x, player.y)] = 2;
      const bomb = { x: player.x, y: player.y, id: socket.id };
      socket.emit("placeBomb", bomb);
    };

    const bombExplosion = (row, col) => {
      Array.from({ length: BOMB_EXPLOSION_RANGE }, (x, i) => {
        let _range = i + 1;
        _checkBombExplosion(row + _range, col);
        _checkBombExplosion(row - _range, col);
        _checkBombExplosion(row, col + _range);
        _checkBombExplosion(row, col - _range);
      });
    };
    const _checkBombExplosion = (row, col) => {
      if (isNaN(row) || isNaN(col)) return;
      if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLUMNS) return;

      if (grid[getGridIndex(row, col)] === 0) return;
      else if (grid[getGridIndex(row, col)] === 1) {
        console.log("DESTROY obstacle at position ", getGridIndex(row, col));
        grid.value[getGridIndex(row, col)] = 0;
        socket.emit("updateGrid", { row, col, value: 0 });
      }
    };

    const handleBombExplosion = (bomb) => {
      bombExplosion(bomb.x, bomb.y);
      // Logic for handling bomb explosion
      // Remove players and obstacles in the explosion radius
    };

    socket.on("bombPlaced", (bomb) => {
      const player = players.value[socket.id];

      // Handle bomb placement on the grid
    });

    socket.on("bombExploded", (bomb) => {
      handleBombExplosion(bomb);
    });

    const handleMovement = (event) => {
      let x = players.value[socket.id].x;
      let y = players.value[socket.id].y;

      switch (event.key) {
        case "ArrowUp":
          y = Math.max(0, y - 1);
          break;
        case "ArrowDown":
          y = Math.min(GRID_ROWS - 1, y + 1);
          break;
        case "ArrowLeft":
          x = Math.max(0, x - 1);
          break;
        case "ArrowRight":
          x = Math.min(GRID_COLUMNS - 1, x + 1);
          break;
      }

      socket.emit("playerMovement", { id: socket.id, x, y });
    };

    onMounted(() => {
      window.addEventListener("keydown", handleMovement);
      window.addEventListener("keydown", (event) => {
        if (event.key === " ") handleBombPlacement();
      });
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleMovement);
    });

    return {
      grid,
      players,
      playerId,
      cellSize,
      GRID_ROWS,
      GRID_COLUMNS,
      BOMB_EXPLOSION_RANGE,
    };
  },
};
</script>

<style>
#gameArea {
  position: relative;
  width: 600px;
  height: 600px;
  /* background: #ccc; */
  background-image: url("assets/game_assets/map_files/");
  display: flex;
  flex-wrap: wrap;
}

.cell {
  width: 40px;
  height: 40px;
}

.floor {
  background-size: 40px 40px;
  background-image: url("../assets/game_assets/map_asset/xmas/floor.png");
}

.obstacle {
  background-size: 40px 40px;
}

.obstacle {
  background-image: url("../assets/game_assets/map_asset/xmas/stone.png");
}
/* 
.obstacle .gift {
  background-image: url("../assets/game_assets/map_asset/xmas/gift_box.png");
}

.obstacle .brick {
  background-image: url("../assets/game_assets/map_asset/xmas/brick.png");
} */

.bomb {
  background-size: 40px 40px;
  background-image: url("../assets/game_assets/bomb/xmas_bomb.png");
  border-radius: 20px;
}

.player {
  position: absolute;
  width: 40px;
  height: 40px;
  /* background: red; */
  background-image: url("../assets/game_assets/character/boz.png");
  background-position: 2px 0px;
  background-size: 200px 200px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition-timing-function: ease-out;
}
</style>
