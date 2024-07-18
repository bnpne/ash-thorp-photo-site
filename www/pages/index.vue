<script setup>
import gsap from 'gsap'

const dataStore = useData()
const photos = ref(null)

const { $loadElements } = useNuxtApp()

watch(() => dataStore.value, () => {
  if (dataStore.value.photos) {
    photos.value = dataStore.value.photos
  }
})

onMounted(async () => {
  await nextTick()

  let p = gsap.utils.toArray('.p')
  if (p.length > 0) {
    let plt = gsap.utils.toArray('.pl-t span')
    let tl = gsap.timeline({
      paused: true
    })
    tl.to(plt, {
      opacity: 1,
      delay: 2,
      stagger: {
        each: .3,
        from: 'edges',
      }
    }, '<')
      .to('.pl', {
        opacity: 0,
        duration: 1,
        ease: 'easeOutQuint',
      }, '>+=.6')

    $loadElements(p)

    tl.play()
  }
})
</script>

<template>
  <div id='page' class='h'>
    <div v-if='photos' class='h-c'>
      <div v-for='photo in photos' class='p'></div>
    </div>
  </div>
</template>

<style lang="scss">
.h {
  position: relative;
  width: 100%;
  height: 100%;

  &-c {
    padding: desktop-vw(80px) 0;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 calc((100vw / 12) + desktop-vw(20px));
    gap: calc(((100vw - (((100vw / 12) + desktop-vw(20px)) * 2) - desktop-vw(40px)) - (desktop-vw(150px) * 8)) / 7);
  }

}

.p {
  display: block;
  height: desktop-vw(150px);
  width: desktop-vw(150px);
}
</style>
