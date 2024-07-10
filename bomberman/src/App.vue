<template>
  <div id="app">
    <Game />
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
  background-image: url("assets/boom-background.jpg");
  background-position-y: center;
}
</style>
