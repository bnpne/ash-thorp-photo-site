<script setup>
import gsap from 'gsap'

const { $lenis, $load, $toHome, $loadElements, $loadDetail } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const photos = ref(null)

// Query Sanity
const query = groq`*[_type=='main']{..., photos[]->{..., photo{..., asset->}, audio{..., asset->}}}`
const { data } = useSanityQuery(query)

// Data Store
const dataStore = useData()


onMounted(async () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      router.push('/')
    }
  })

  if (data) {
    // Load GL
    dataStore.value = data.value[0]
    photos.value = dataStore.value.photos
    let rawPhotos = toRaw(photos.value)
    $load(rawPhotos)

    await nextTick()
    // Load Dom
    let p = gsap.utils.toArray('.p')
    $loadElements(p).then(async (photos) => {

      await nextTick()
      let index
      if (route.path !== '/' && route.path !== '/info') {
        photos.forEach((photo, i) => {
          if (route.params.slug[0] === photo.slug.current) {
            index = i
          }
        })
        if (index !== undefined) {
          let scrollBounds = photos[index].element.getBoundingClientRect()
          $lenis.scrollTo(scrollBounds.top - window.innerHeight, {
            immediate: true, force: true, lock: true, onComplete:
              $loadDetail(index)
          })
        }
      }


      await nextTick()
      // Play preloader
      let plt = gsap.utils.toArray('.pl-t span')
      let tl = gsap.timeline({
        paused: true
      })
      tl.to(plt, {
        opacity: 1,
        delay: .5,
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

      photos.forEach((photo, i) => {
        let anima = photo.mesh.material.uniforms.opacity
        let pos = photo.mesh.position

        if (route.path === '/') {
          tl.from(
            pos,
            {
              y: photo.mesh.position.y - 150,
              ease: 'easeOutQuint',
              duration: 1,
            },
            i === 0 ? '>' : '<+=.009'
          )
          tl.to(
            anima,
            {
              value: 1,
              duration: 1,
              ease: 'easeOutQuint',
            },
            '<'
          )
        }
      })

      tl.play()
    })
  }
})
</script>

<template>
  <main id='main'>
    <PL />
    <Nav />
    <NuxtPage />
    <div class='h'>
      <div v-if='photos' class='h-c'>
        <NuxtLink v-for='photo in photos' :to='`/${photo.slug.current}`' class='p'></NuxtLink>
      </div>
    </div>
    <Canvas />
  </main>
</template>

<style lang="scss">
.h {
  padding: desktop-vw(20px);
  min-height: 100vh;
  position: relative;
  z-index: 2;
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
