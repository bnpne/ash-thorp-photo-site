<script setup>
const canvas = ref()
const app = useNuxtApp()

onMounted(() => {
  if (canvas.value) {
    // Initialize WebGL
    app.$setup(canvas.value)
  }
})
</script>

<template>
  <canvas ref='canvas' id='canvas'></canvas>
</template>
