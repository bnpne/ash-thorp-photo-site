<script setup>
import gsap from 'gsap'

definePageMeta({
  pageTransition: {
    css: false,
    name: 'photo',
    mode: 'out-in',
    onEnter(el, done) {
      const { $toHome } = useNuxtApp()
      $toHome()
      done()
    },
    onLeave(el, done) {
      const { $toDetail } = useNuxtApp()
      $toDetail()
      done()
    },
  },
})

const dataStore = useData()

onMounted(() => {
})
</script>

<template>
  <div>
  </div>
</template>

<style lang="scss"></style>
