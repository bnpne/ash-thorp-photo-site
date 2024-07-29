<script setup>
import gsap from 'gsap'

const { $lenis, $load, $toHome, $loadElements, $loadDetail } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const photos = ref(null)
const activePhoto = ref(null)
const activeIndex = ref(null)
const photoArray = ref(null)

// Query Sanity
const query = groq`*[_type=='main']{..., photos[]->{..., photo{..., asset->}, audio{..., asset->}}}`
const { data } = useSanityQuery(query)

// Data Store
const dataStore = useData()

watch(() => route.params.slug, () => {
  if (route.params.slug !== undefined && route.params.slug !== null) {
    photoArray.value.forEach((photo, i) => {
      if (route.params.slug === photo.slug.current) {
        activeIndex.value = i
        activePhoto.value = photo
      }
    })
  }
})

onMounted(async () => {
  window.addEventListener('keydown', async (e) => {
    if (e.key === 'Escape') {
      router.push('/')
    }
    if (e.key === 'ArrowLeft') {
      if (activeIndex.value !== null) {
        // -1

        let prevIndex
        if (activeIndex.value === 0) {
          prevIndex = dataStore.value.photos.length - 1
        } else {
          prevIndex = activeIndex.value - 1
        }

        if (prevIndex !== undefined) {
          await navigateTo(`/${dataStore.value.photos[prevIndex].slug?.current}`)
        }
      }
    }
    if (e.key === 'ArrowRight') {
      if (activeIndex.value !== null) {
        // 1

        let nextIndex
        if (activeIndex.value === dataStore.value.photos.length - 1) {
          nextIndex = 0
        } else {
          nextIndex = activeIndex.value + 1
        }

        if (nextIndex !== undefined) {
          await navigateTo(`/${dataStore.value.photos[nextIndex].slug?.current}`)
        }
      }
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

      photoArray.value = photos
      await nextTick()
      let index
      if (route.path !== '/' && route.path !== '/info') {
        photos.forEach((photo, i) => {
          if (route.params.slug === photo.slug.current) {
            index = i
            activeIndex.value = i
            activePhoto.value = photo
          }
        })
        if (index !== undefined) {
          let scrollBounds = photos[index].element.getBoundingClientRect()
          $lenis.scrollTo(scrollBounds.top - window.innerHeight, {
            immediate: true, force: true, lock: true, onComplete:
              $loadDetail(index)
          })
        }
      } else {
        activePhoto.value = null
        activeIndex.value = null
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
            '<+=.009'
          )
          tl.from(
            anima,
            {
              value: 0,
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
