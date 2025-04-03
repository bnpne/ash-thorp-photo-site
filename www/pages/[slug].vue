<script setup>
import gsap from "gsap";
definePageMeta({
  pageTransition: {
    css: false,
    name: "detail",
    mode: "out-in",
    onEnter(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() });
      intro
        .from(
          el,
          {
            opacity: 0,
            duration: 1,
            ease: "easeOutQuint",
          },
          "<",
        )
      intro.to('.n', { color: '#ffffff', ease: 'easeOutQuint', duration: .6 }, '<')
      intro.to([document.body], { color: '#ffffff', background: '#000000', ease: 'easeOutQuint', duration: .6 }, '<')

      intro.play();
    },
    onLeave(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() });
      intro
        .to(
          el,
          {
            opacity: 0,
            duration: 1,
            ease: "easeOutQuint",
          },
        )

      intro.play();
    },
  },
});

const route = useRoute();
const slug = ref(null);
const dataStore = useData();
const allPhotos = ref(null);
const pageData = ref(null)
const isUntitled = ref(false);
const audio = ref(null);
const audioIsPlaying = ref(false);
const loaded = ref(false);
const index = ref();
const app = useNuxtApp();
const ss = ref(null);
const gradient = reactive({ lightVibrant: null, darkVibrant: null });
const gradientElement = ref(null);
const metadataActive = ref(false);
const metadata = ref(null);
const waiting = useWaiting();
const { isMobile } = useDevice();


const triggerAudio = () => {
  if (audio.value !== null) {
    if (audioIsPlaying.value === false) {
      audioIsPlaying.value = true;
      audio.value.play();
    } else {
      audioIsPlaying.value = false;
      audio.value.pause();
    }
  }
};

const imageLoaded = () => {
  loaded.value = true;
};

const toggleMetadata = () => {
  metadataActive.value === true
    ? (metadataActive.value = false)
    : (metadataActive.value = true);

  if (metadataActive.value === true) {
    gsap.to(gradientElement.value, {
      opacity: 1,
      ease: "easeOutQuint",
      duration: 0.6,
    });
  } else {
    gsap.to(gradientElement.value, {
      opacity: 0,
      ease: "easeOutQuint",
      duration: 0.6,
    });
  }
};

const query = groq`*[_type=='photoBase' && slug.current == $slug][0]{
    ...,
    photo{..., asset->}, 
    audio{..., asset->}
  }`;
const { data } = useSanityQuery(query, { slug: route.params.slug });

onMounted(async () => {
  console.log(data.value)
  gsap.set([document.body], { color: '#ffffff', background: '#000000' })

  if (data.value.photo.asset.metadata.palette.dominant) {
    let darkVibrant =
      data.value.photo.asset.metadata.palette.darkVibrant.background;
    let darkMuted =
      data.value.photo.asset.metadata.palette.darkMuted.background;
    let lightMuted =
      data.value.photo.asset.metadata.palette.lightMuted.background;
    let lightVibrant =
      data.value.photo.asset.metadata.palette.lightVibrant.background;

    gradient.darkVibrant = darkVibrant;
    gradient.darkMuted = darkMuted;
    gradient.lightMuted = lightMuted;
    gradient.lightVibrant = lightVibrant;

    if (gradientElement.value) {
      gradientElement.value.style.background = `linear-gradient(70deg, ${gradient.lightVibrant}, ${gradient.lightMuted}, ${gradient.darkMuted})`;
    }
  }


  // if (pageData.value) {
  //   // create gradient
  //   if (pageData.value.photo.asset.metadata.palette.dominant) {
  //     let darkVibrant =
  //       pageData.value.photo.asset.metadata.palette.darkVibrant.background;
  //     let darkMuted =
  //       pageData.value.photo.asset.metadata.palette.darkMuted.background;
  //     let lightMuted =
  //       pageData.value.photo.asset.metadata.palette.lightMuted.background;
  //     let lightVibrant =
  //       pageData.value.photo.asset.metadata.palette.lightVibrant.background;
  //
  //     gradient.darkVibrant = darkVibrant;
  //     gradient.darkMuted = darkMuted;
  //     gradient.lightMuted = lightMuted;
  //     gradient.lightVibrant = lightVibrant;
  //
  //     if (gradientElement.value) {
  //       gradientElement.value.style.background = `linear-gradient(70deg, ${gradient.lightVibrant}, ${gradient.lightMuted}, ${gradient.darkMuted})`;
  //     }
  //   }
  //
  //   // intro animation
  //   let intro = gsap.timeline({ paused: true });
  //
  //   if (isMobile === true) {
  //     intro.to(
  //       [document.body],
  //       {
  //         background: "#000000",
  //         duration: 1,
  //         color: "#ffffff",
  //         ease: "custom",
  //       },
  //       "<",
  //     );
  //     intro.to(
  //       [".n"],
  //       {
  //         duration: 1,
  //         color: "#ffffff",
  //         ease: "custom",
  //       },
  //       "<",
  //     );
  //   }
  //
  //   intro
  //     .to(
  //       ".d-i",
  //       {
  //         opacity: 1,
  //         duration: waiting.value ? 1 : 0.6,
  //         delay: waiting.value ? 1.2 : 0,
  //         ease: "easeOutQuint",
  //       },
  //       "<",
  //     )
  //     .from(
  //       ".d-container",
  //       {
  //         opacity: 0,
  //         duration: waiting.value ? 1 : 0.6,
  //         ease: "easeOutQuint",
  //       },
  //       "<",
  //     );
  //
  //   intro.play();
  //
  //   // handle audio
  //   if (pageData.value.audio !== null) {
  //     audio.value = new Audio(pageData.value.audio.asset.url);
  //     audio.value.loop = true;
  //   }
  // }
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});
</script>

<template>
  <div id="page" v-if='data' class="d">
    <div class="d-c">
      <div class="d-container">
        <div :class="{ active: loaded === false }" class="d-container-im">
          <img :style="{ 'height': '100%', 'aspect-ratio': `${data.photo.asset.metadata.dimensions.aspectRatio}` }"
            :src="data.photo.asset.metadata.lqip" alt="">
        </div>
        <div :class="{ active: loaded === true }" class="d-container-im" >
          <div ref="gradientElement" class="d-container-im-o" :style="{
            'aspect-ratio':
              data.photo.asset.metadata.dimensions.aspectRatio,
          }">
            <div class="d-container-im-m">

            </div>
          </div>
          <img class="d-container-im-e" @click="toggleMetadata" :onload="imageLoaded"
            :src="`${data.photo.asset.url + '?auto=format&w=2000'}`" alt="" />
        </div>
      </div>
      <div class="d-i">
        <p class="d-i-t">{{ data.title }}</p>
        <p @click="triggerAudio" class="d-i-a" v-if="data.audio">
          <span v-if="audioIsPlaying === false"> Play Audio </span>
          <span v-else> Pause Audio </span>
        </p>
        <div v-if="data.photo.asset.metadata" class="d-i-m">
          <div class="d-i-m-i">
            <span :style="{ 'text-transform': 'none' }" v-if="data.photo.asset.metadata?.exif?.FNumber">
              f/{{ data.photo.asset.metadata.exif.FNumber }}
            </span>
            <span v-if="
              data.photo.asset.metadata?.exif?.ExposureTime && ss !== null
            ">
              {{ ss }}
            </span>
            <span v-if="data.photo.asset.metadata?.exif?.ISO">
              ISO {{ data.photo.asset.metadata.exif.ISO }}
            </span>
            <span v-if="data.photo.asset.metadata?.exif">
              CS {{ data.photo.asset.metadata.exif.ColorSpace }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.navigate {
  display: flex;
  position: fixed;
  z-index: 2;
  height: calc(100% - desktop-vw(40px));
  width: calc(100% - desktop-vw(40px));
  justify-content: space-between;
  pointer-events: none;

  @include mobile() {
    /* display: none; */
    height: calc(100% - mobile-vw(20px));
    width: calc(100% - mobile-vw(20px));
  }

  &-l,
  &-r {
    height: 100%;
    width: 10%;
    pointer-events: auto;

    @include mobile() {
      width: 50%;
    }
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

    @include mobile() {
      padding: mobile-vw(20px);
    }

    &-im {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transition: 300ms opacity ease-out;

      &.active {
        opacity: 1;
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

        @include mobile() {
          padding: mobile-vw(10px);
          font-size: mobile-vw(8px);
          line-height: mobile-vw(12px);
        }

        &-l {
          display: flex;
          flex-direction: column;
          gap: desktop-vw(10px);
          position: relative;

          @include mobile() {
            gap: 0;
          }

          &>li {
            position: relative;
            display: flex;
            flex-direction: column;

            &:last-child {
              margin-top: desktop-vw(40px);

              @include mobile() {
                margin-top: mobile-vw(40px);
              }
            }

            span {
              display: block;

              &:not(:first-child) {
                &:not(:last-child) {
                  margin-left: desktop-vw(20px);

                  @include mobile() {
                    margin-left: mobile-vw(20px);
                  }
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
    z-index: 4;
    align-items: flex-end;

    &-t {
      flex: 0 0 calc((100% / 12) * 2 + desktop-vw(20px));

      @include mobile() {
        flex: 0 0 25%;
      }
    }

    &-a {
      cursor: pointer;

      flex: 0 0 calc((100% / 12) * 1 + desktop-vw(20px));

      display: flex;
      align-items: center;
      gap: desktop-vw(12px);

      @include mobile() {
        flex: 0 0 25%;
      }

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
