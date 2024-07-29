<script setup>
import gsap from 'gsap'

definePageMeta({
  pageTransition: {
    css: false,
    name: 'info',
    mode: 'out-in',
    onEnter(el, done) {
      // const { $ } = useNuxtApp()
      // $toDetail()
      done()
    },
    onLeave(el, done) {
      const { $toHome } = useNuxtApp()
      $toHome()
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
