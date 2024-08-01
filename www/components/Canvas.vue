<script setup>
const canvas = ref()
const app = useNuxtApp()
const { isMobile } = useDevice();

onMounted(() => {
  if (!isMobile) {
    if (canvas.value) {
      // Initialize WebGL
      app.$setup(canvas.value)
    }
  }
})
</script>

<template>
  <canvas ref='canvas' id='canvas'></canvas>
</template>
