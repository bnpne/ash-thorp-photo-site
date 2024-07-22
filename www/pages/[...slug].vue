<script setup>
import gsap from 'gsap'

definePageMeta({
  pageTransition: {
    css: false,
    name: 'photo',
    mode: 'out-in',
    onEnter(el, done) {
      done()
    },
    onLeave(el, done) {
      gsap.to('.d-i', {
        opacity: 0,
        duration: 1,
        ease: 'custom',
        onComplete: () => done()
      })
    },
  },
})

const route = useRoute()
const slug = ref(null)
const dataStore = useData()
const data = ref(null)
const isUntitled = ref(false)
const audio = ref(null)
const audioIsPlaying = ref(false)
const { $toNextDetail } = useNuxtApp()

watch(() => dataStore.value, () => {
  if (dataStore.value.photos) {
    dataStore.value.photos.forEach(photo => {
      if (photo.slug && photo.slug.current === slug.value) {
        data.value = photo
      }
    })
  }
})

const handleNavLeft = () => {
  $toNextDetail(-1)
}

const handleNavRight = () => {
  $toNextDetail(1)
}

const triggerAudio = () => {
  if (audio.value !== null) {
    console.log(audio.value)
    if (audioIsPlaying.value === false) {
      audioIsPlaying.value = true
      audio.value.play()
    } else {
      audioIsPlaying.value = false
      audio.value.pause()
    }

  }
}

onMounted(async () => {
  slug.value = route.params.slug[0]

  if (dataStore.value) {
    dataStore.value.photos.forEach((photo, i) => {
      if (photo.slug && photo.slug.current === slug.value) {
        data.value = photo
      }
    })
  }

  await nextTick()

  if (data.value.audio !== null) {
    audio.value = new Audio(data.value.audio.asset.url)
    audio.value.loop = true
  }

  gsap.to('.d-i', {
    opacity: 1,
    duration: 1,
    ease: 'custom',
  })
})
</script>

<template>
  <div id='page' class='d'>
    <div v-if='data' class='d-c'>
      <div class='navigate'>
        <div @click='handleNavLeft' class='navigate-l'>

        </div>
        <div @click='handleNavRight' class='navigate-r'>

        </div>
      </div>
      <div class='d-i'>
        <p class='d-i-t'>{{ data.title }}</p>
        <p @click='triggerAudio' class='d-i-a' v-if='data.audio'>
          <span v-if='audioIsPlaying === false'>
            Play Audio
          </span>
          <span v-else>
            Pause Audio
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
.navigate {
  display: flex;
  position: fixed;
  z-index: 2;
  height: 100%;
  width: 100%;
  justify-content: space-between;

  &-l,
  &-r {
    height: 100%;
    width: 10%;
  }

  &-l {
    cursor: w-resize;
  }

  &-r {
    cursor: e-resize;
  }

}

.d {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  &-c {
    height: 100%;
    width: 100%;
    position: relative;
    flex-grow: 1;
  }

  &-i {
    width: 100%;
    position: absolute;
    display: flex;
    bottom: 0;
    left: 0;
    text-transform: uppercase;
    opacity: 0;
    z-index: 4;

    &-t {
      flex: 0 0 calc((100% / 12) * 1 + desktop-vw(20px))
    }

    &-a {
      cursor: pointer;

      flex: 0 0 calc((100% / 12) * 1 + desktop-vw(20px));

      display: flex;
      align-items: center;
      gap: desktop-vw(12px);

      &>span {

        &>svg {
          display: inline-block;
          height: desktop-vw(12px);
          width: desktop-vw(9px);
        }
      }
    }
  }
}
</style>
