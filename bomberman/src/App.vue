<template>
  <div id="app">
    <div id="container">
      <Game />
    </div>
  </div>
</template>

<script>
import Game from "./components/Game.vue";

export default {
  name: "App",
  components: {
    Game,
  },
};
</script>

<style>
#app {
  text-align: center;
  display: flex;
  /* background-image: url("assets/boom-background.jpg"); */
  /* background-position-y: center; */
}
#container {
  background-color: #5ba9da;
}
</style>
