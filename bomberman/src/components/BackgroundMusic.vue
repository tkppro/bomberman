<template>
  <div>
    <audio ref="audio" loop>
      <source src="@/assets/game_assets/sound/xmas.wav" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
export default {
  mounted() {
    this.playBackgroundMusic();
  },
  methods: {
    playBackgroundMusic() {
      this.$refs.audio.play();
    },
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
