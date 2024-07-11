<template>
  <div @click="startMusicOnInteraction">
    <audio ref="audio" loop>
      <source src="@/assets/game_assets/sound/xmas.wav" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <!-- Include a visual cue or a message if necessary -->
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("click", this.startMusicOnInteraction, {
      once: true,
    });
  },
  methods: {
    startMusicOnInteraction() {
      this.$refs.audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      window.removeEventListener("click", this.startMusicOnInteraction);
    },
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
