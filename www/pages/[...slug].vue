<script setup>
import gsap from 'gsap'
import { format } from 'date-fns'

let ifDoWait = false
definePageMeta({
  middleware: [
    function (to, from) {
      doWait(from.path)
    }
  ],
  pageTransition: {
    css: false,
    name: 'detail',
    mode: 'out-in',
    onEnter(el, done) {
      done()
    },
    onLeave(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() })
      intro.to('.d-i', {
        opacity: 0,
        duration: 1,
        ease: 'easeOutQuint',
      }, '<')
        .to('.d-container-im', {
          opacity: 0,
          duration: 1,
          // y: '-10%',
          ease: 'easeOutQuint',
        }, '<')

      intro.play()
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
const loaded = ref(false)
const index = ref()
const app = useNuxtApp()
const ss = ref(null)
const gradient = reactive({ lightVibrant: null, darkVibrant: null })
const gradientElement = ref(null)
const metadataActive = ref(false)
const metadata = ref(null)
const waiting = doWait()

watch(() => dataStore.value, () => {
  if (dataStore.value.photos) {
    dataStore.value.photos.forEach(photo => {
      if (photo.slug && photo.slug.current === slug.value) {
        data.value = photo
      }
    })
  }
})

const handleNavLeft = async () => {
  // -1

  let prevIndex
  if (index.value === 0) {
    prevIndex = dataStore.value.photos.length - 1
  } else {
    prevIndex = index.value - 1
  }

  // console.log(dataStore.value.photos[prevIndex].slug?.current)
  if (prevIndex !== undefined) {
    await navigateTo(`/${dataStore.value.photos[prevIndex].slug?.current}`)
  }
}

const handleNavRight = async () => {
  // 1

  let nextIndex
  if (index.value === dataStore.value.photos.length - 1) {
    nextIndex = 0
  } else {
    nextIndex = index.value + 1
  }


  // console.log(dataStore.value.photos[nextIndex].slug?.current)
  if (nextIndex !== undefined) {
    await navigateTo(`/${dataStore.value.photos[nextIndex].slug?.current}`)
  }
}

const triggerAudio = () => {
  if (audio.value !== null) {
    if (audioIsPlaying.value === false) {
      audioIsPlaying.value = true
      audio.value.play()
    } else {
      audioIsPlaying.value = false
      audio.value.pause()
    }

  }
}

const imageLoaded = () => {
  loaded.value = true
}

const toggleMetadata = () => {
  metadataActive.value === true ? metadataActive.value = false : metadataActive.value = true

  if (metadataActive.value === true) {
    gsap.to(gradientElement.value, { opacity: 1, ease: 'easeOutQuint', duration: .6 })
  } else {
    gsap.to(gradientElement.value, { opacity: 0, ease: 'easeOutQuint', duration: .6 })

  }
}

const decimalToFraction = (decimal) => {
  if (decimal % 1 === 0) {
    return `${decimal}/1`;
  }

  const tolerance = 1.0E-6;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  return `${h1}/${k1}`;
}

onMounted(async () => {
  slug.value = route.params.slug[0]

  if (dataStore.value) {
    dataStore.value.photos.forEach((photo, i) => {
      if (photo.slug && photo.slug.current === slug.value) {
        index.value = i
        data.value = photo
      }
    })
  }

  await nextTick()

  // create metadata
  let m = {
    title: data.value.title,
    audio: {
      id: data.value?.audio?.asset.assetId,
      path: data.value?.audio?.asset.path
    },
    exif: {
      ApertureValue: data.value.photo.asset.metadata.exif.ApertureValue ?
        data.value.photo.asset.metadata.exif.ApertureValue : 'null',
      BrightnessValue: data.value.photo.asset.metadata.exif.BrightnessValue ?
        data.value.photo.asset.metadata.exif.BrightnessValue : 'null',
      DateDigitized: data.value.photo.asset.metadata.exif.DateTimeDigitized ?
        data.value.photo.asset.metadata.exif.DateTimeDigitized : "null",
      ExposureMode: data.value.photo.asset.metadata.exif.ExposureMode ?
        data.value.photo.asset.metadata.exif.ExposureMode : "null",
      ExposureTime: data.value.photo.asset.metadata.exif.ExposureTime ?
        data.value.photo.asset.metadata.exif.ExposureTime : 'null',
      FStop: data.value.photo.asset.metadata.exif.FNumber ? data.value.photo.asset.metadata.exif.FNumber : "null",
      Flash: data.value.photo.asset.metadata.exif.Flash ? data.value.photo.asset.metadata.exif.Flash : 'null',
      FocalLength: data.value.photo.asset.metadata.exif.FocalLength ? data.value.photo.asset.metadata.exif.FocalLength :
        'null',
      '35mmFocalLength': data.value.photo.asset.metadata.exif.FocalLengthIn35mmFormat ?
        data.value.photo.asset.metadata.exif.FocalLengthIn35mmFormat : 'null',
      ISO: data.value.photo.asset.metadata.exif.ISO ? data.value.photo.asset.metadata.exif.ISO : 'null',
      LensMake: data.value.photo.asset.metadata.exif.LensMake ? data.value.photo.asset.metadata.exif.LensMake : 'null',
      LensModel: data.value.photo.asset.metadata.exif.LensModel ? data.value.photo.asset.metadata.exif.LensModel : "null",
      LensSpecification: data.value.photo.asset.metadata.exif.LensSpecification ?
        data.value.photo.asset.metadata.exif.LensSpecification : "null",
      Sharpness: data.value.photo.asset.metadata.exif.Sharpness ? data.value.photo.asset.metadata.exif.Sharpness : "null",
      ShutterSpeedValue: data.value.photo.asset.metadata.exif.ShutterSpeedValue ?
        data.value.photo.asset.metadata.exif.ShutterSpeedValue : "null",
      WhiteBalance: data.value.photo.asset.metadata.exif.WhiteBalance ?
        data.value.photo.asset.metadata.exif.WhiteBalance : "null",
      ColorSpace: data.value.photo.asset.metadata.exif.ColorSpace ? data.value.photo.asset.metadata.exif.ColorSpace :
        'null',
      FocalPlane: {
        x: data.value.photo.asset.metadata.exif.FocalPlaneXResolution,
        y: data.value.photo.asset.metadata.exif.FocalPlaneYResolution,
      }
    },
    palette: {
      dominant: data.value.photo.asset.metadata.palette.dominant.background,
      muted: data.value.photo.asset.metadata.palette.muted.background,
      vibrant: data.value.photo.asset.metadata.palette.vibrant.background,
    },
    photoId: data.value.photo.asset.assetId,
    path: data.value.photo.asset.path,
    size: data.value.photo.asset.size,
    mime: data.value.photo.asset.mimeType,
    blurHash: data.value.photo.asset.metadata.blurHash,
    alpha: data.value.photo.asset.metadata.hasAlpha,
  }
  m = JSON.stringify(m)
  m = JSON.parse(m)
  metadata.value = m

  // create gradient
  if (data.value.photo.asset.metadata.palette.dominant) {
    let darkVibrant = data.value.photo.asset.metadata.palette.darkVibrant.background
    let darkMuted = data.value.photo.asset.metadata.palette.darkMuted.background
    let lightMuted = data.value.photo.asset.metadata.palette.lightMuted.background
    let lightVibrant = data.value.photo.asset.metadata.palette.lightVibrant.background

    gradient.darkVibrant = darkVibrant
    gradient.darkMuted = darkMuted
    gradient.lightMuted = lightMuted
    gradient.lightVibrant = lightVibrant

    if (gradientElement.value) {
      gradientElement.value.style.background = `linear-gradient(70deg, ${gradient.lightVibrant}, ${gradient.lightMuted}, ${gradient.darkMuted})`
    }
  }

  // handle exposure time
  if (data.value.photo.asset.metadata.exif.ExposureTime) {
    let decimal = data.value.photo.asset.metadata.exif.ExposureTime

    let fraction = decimalToFraction(decimal)

    ss.value = fraction
  }

  console.log(waiting.value)
  // intro animation
  let intro = gsap.timeline({ paused: true })
  intro.to('.d-i', {
    opacity: 1,
    duration: 1,
    delay: ifDoWait ? 1 : 0,
    ease: 'easeOutQuint',
  }, '<')
    .from('.d-container', {
      opacity: 0,
      // y: '10%',
      duration: 1,
      ease: 'easeOutQuint',
    }, '<')

  intro.play()


  // handle audio
  if (data.value.audio !== null) {
    audio.value = new Audio(data.value.audio.asset.url)
    audio.value.loop = true
  }

})

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
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
      <div class='d-container'>
        <div :class="{ active: loaded === false }" class='d-container-im'>
          <img :style="{ 'height': '100%', 'width': '100%' }" :src="data.photo.asset.metadata.lqip" alt="">
        </div>
        <div :class="{ active: loaded === true }" class='d-container-im'>
          <div ref='gradientElement' class='d-container-im-o'
            :style="{ 'aspect-ratio': data.photo.asset.metadata.dimensions.aspectRatio }">
            <div class='d-container-im-m' v-if='metadata'>
              <ul class='d-container-im-m-l'>
                <!-- <li v-for='(item, key) in metadata' :key='key'>{{ key }}: {{ item }}</li> -->
                <li v-if='metadata.title'>Title: "{{ metadata.title }}",</li>
                <li v-if='metadata.photoId'>Id: {{ metadata.photoId }},</li>
                <li v-if='metadata.audio'>
                  <template v-if='!audio'>
                    <span>Audio: {</span>
                    <span>Null</span>
                    <span>},</span>
                  </template>
                  <template v-else>
                    <span>Audio: {</span>
                    <span>Id: {{ metadata.audio.id }},</span>
                    <span>Path: {{ metadata.audio.path }},</span>
                    <span>},</span>
                  </template>
                </li>
                <li v-if='metadata.exif'>
                  <template v-if='metadata.exif.ISO === "null"'>
                    <span>EXIF: {</span>
                    <span>Null</span>
                    <span>},</span>
                  </template>
                  <template v-else>
                    <span>EXIF: {</span>
                    <span>Date Digitized: {{ format(new Date(metadata.exif.DateDigitized), "MM-dd-yyy HH:mm:ss a")
                      }},</span>
                    <span>Lens Make: {{ metadata.exif.LensMake }},</span>
                    <span>Lens Model: {{ metadata.exif.LensModel }},</span>
                    <span>Lens Specification: {{ metadata.exif.LensSpecification }},</span>
                    <span>Brightness: {{ metadata.exif.BrightnessValue }},</span>
                    <span>Sharpness: {{ metadata.exif.Sharpness }},</span>
                    <span>White Balance: {{ metadata.exif.WhiteBalance }},</span>
                    <span>ISO: {{ metadata.exif.ISO }},</span>
                    <span>Aperture: {{ metadata.exif.ApertureValue }},</span>
                    <span>F Stop: {{ metadata.exif.FStop }},</span>
                    <span>Shutter Speed: {{ metadata.exif.ShutterSpeedValue }},</span>
                    <span>Focal Length: {{ metadata.exif.FocalLength }},</span>
                    <span>Focal Plane: {{ metadata.exif.FocalPlane.x }}, {{ metadata.exif.FocalPlane.y }},</span>
                    <span>Exposure Time: {{ metadata.exif.ExposureTime }},</span>
                    <span>Exposure Mode: {{ metadata.exif.ExposureMode }},</span>
                    <span>Flash: {{ metadata.exif.Flash === 1 ? 'True' : 'False' }},</span>
                    <span>35mm Focal Length: {{ metadata.exif['35mmFocalLength'] }},</span>
                    <span>},</span>
                  </template>
                </li>
                <li v-if='metadata.palette'>
                  <span>Color Palette: {</span>
                  <span>Dominant: {{ metadata.palette.dominant }},</span>
                  <span>Vibrant: {{ metadata.palette.vibrant }},</span>
                  <span>Muted: {{ metadata.palette.muted }},</span>
                  <span>},</span>
                </li>
                <li>Path: {{ metadata.path }}</li>
                <li>Size: {{ metadata.size }}</li>
                <li>Blur Hash: {{ metadata.blurHash }}</li>
                <li>Has Alpha: {{ metadata.alpha }}</li>
                <li>Mime: {{ metadata.mime }}</li>
                <li>Copyright (C) Ash Thorp</li>
              </ul>
            </div>
          </div>
          <img class='d-container-im-e' @click='toggleMetadata' :onload="imageLoaded"
            :src="`${data.photo.asset.url + '?auto=format&w=2000'}`" alt="">
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
        <div v-if='data.photo.asset.metadata' class='d-i-m'>
          <div class='d-i-m-i'>
            <span :style="{ 'text-transform': 'none' }" v-if='data.photo.asset.metadata.exif.FNumber'>
              f/{{ data.photo.asset.metadata.exif.FNumber }}
            </span>
            <span v-if='data.photo.asset.metadata.exif.ExposureTime && ss !== null'>
              {{ ss }}
            </span>
            <span v-if='data.photo.asset.metadata.exif.ISO'>
              ISO {{ data.photo.asset.metadata.exif.ISO }}
            </span>
            <span v-if='data.photo.asset.metadata.exif'>
              CS {{ data.photo.asset.metadata.exif.ColorSpace }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
.navigate {
  display: flex;
  position: fixed;
  z-index: 2;
  height: calc(100% - desktop-vw(40px));
  width: calc(100% - desktop-vw(40px));
  justify-content: space-between;
  pointer-events: none;

  &-l,
  &-r {
    height: 100%;
    width: 10%;
    pointer-events: auto;
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

  &-container {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    padding: desktop-vw(80px) desktop-vw(100px);

    &-im {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      &.active {
        display: flex;
      }

      &-o {
        @include image-default();
        object-fit: contain;
        position: absolute;
        pointer-events: none;
        opacity: 0;
        top: auto;
        left: auto;
        bottom: auto;
        right: auto;
        height: unset;
      }

      &-m {
        position: relative;
        height: 100%;
        width: 100%;
        padding: desktop-vw(20px);
        color: #000000;
        /* mix-blend-mode: difference; */

        &-l {
          display: flex;
          flex-direction: column;
          gap: desktop-vw(10px);
          position: relative;

          &>li {
            position: relative;
            display: flex;
            flex-direction: column;

            &:last-child {
              margin-top: desktop-vw(40px);
            }

            span {
              display: block;

              &:not(:first-child) {
                &:not(:last-child) {
                  margin-left: desktop-vw(20px);
                }
              }
            }
          }
        }
      }

      &-e {
        @include image-default();
        object-fit: contain;
        cursor: pointer;
        height: auto;
        width: auto;

      }
    }
  }

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
    align-items: flex-end;

    &-t {
      flex: 0 0 calc((100% / 12) * 2 + desktop-vw(20px))
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

    &-m {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      &-i {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }
}
</style>
