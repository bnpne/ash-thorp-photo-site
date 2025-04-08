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
const audio = ref(null);
const audioIsPlaying = ref(false);
const loaded = ref(false);
const ss = ref(null);
const gradient = reactive({ lightVibrant: null, darkVibrant: null });
const gradientElement = ref(null);
const metadataActive = ref(false);
const all = ref(null)
const thisIndex = ref(null)
const nextIndex = ref(null)
const prevIndex = ref(null)
const coverImg = ref(null)

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

    coverImg.value.style.pointerEvents = 'none'
    gradientElement.value.style.pointerEvents = 'auto'
  } else {
    gsap.to(gradientElement.value, {
      opacity: 0,
      ease: "easeOutQuint",
      duration: 0.6,
    });
    coverImg.value.style.pointerEvents = 'auto'
    gradientElement.value.style.pointerEvents = 'none'
  }
};

const handleNavRight = async () => {
  await navigateTo(`/${all.value[nextIndex.value].slug}`)
}

const handleNavLeft = async () => {
  await navigateTo(`/${all.value[prevIndex.value].slug}`)
}

// Define the event handler once
const handleKeyDown = (e) => {
  if (e.key === 'ArrowRight') {
    handleNavRight();
  }
  if (e.key === 'ArrowLeft') {
    handleNavLeft();
  }
};


const query = groq`
  {
    "case": *[_type == 'photoBase' && slug.current == $slug][0] {
      ...,
      photo{..., asset->}, 
      negative{..., asset->}, 
      audio{..., asset->}
    },
    "all": *[_type == 'main'][0] {
      collections[] {
        photos[]-> {
          slug,
        }
      }
    }
  }
`
const { data } = useSanityQuery(query, { slug: route.params.slug });

onMounted(async () => {
  gsap.set([document.body], { color: '#ffffff', background: '#000000' })

  if (data.value.all) {
    all.value = toRaw(data.value).all?.collections
      .map(a => a.photos.map(p => ({ slug: p.slug.current })))
      .flat();


    all.value.forEach((a, i) => {
      if (a.slug === route.params.slug) {
        thisIndex.value = i

        if (i === all.value.length - 1) {
          nextIndex.value = 0
        } else {
          nextIndex.value = i + 1
        }

        if (i === 0) {
          prevIndex.value = all.value.length - 1
        } else {
          prevIndex.value = i - 1
        }
      }
    })
  }

  window.addEventListener('keydown', handleKeyDown);

  if (data.value.case.photo.asset.metadata.palette.dominant) {
    let darkVibrant =
      data.value.case.photo.asset.metadata.palette.darkVibrant.background;
    let darkMuted =
      data.value.case.photo.asset.metadata.palette.darkMuted.background;
    let lightMuted =
      data.value.case.photo.asset.metadata.palette.lightMuted.background;
    let lightVibrant =
      data.value.case.photo.asset.metadata.palette.lightVibrant.background;

    gradient.darkVibrant = darkVibrant;
    gradient.darkMuted = darkMuted;
    gradient.lightMuted = lightMuted;
    gradient.lightVibrant = lightVibrant;

    if (gradientElement.value && !data.value.case.negative) {
      gradientElement.value.style.background = `linear-gradient(70deg, ${gradient.lightVibrant}, ${gradient.lightMuted}, ${gradient.darkMuted})`;
    }

    if (data.value.case.negative) {
      console.log('here')
      gradientElement.value.style.backgroundImage = `url("${data.value.case.negative.asset.url}?auto=format&w=2000")`;
      gradientElement.value.style.backgroundPosition = 'center'
      gradientElement.value.style.backgroundSize = 'contain'
    }
  }

  if (loaded.value === false) loaded.value = true
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div id="page" v-if='data?.case' class="d">
    <div class="d-c">
      <div class="navigate">
        <div @click="handleNavLeft" class="navigate-l"></div>
        <div @click="handleNavRight" class="navigate-r"></div>
      </div>
      <div class="d-container">
        <div :class="{ active: loaded === false }" class="d-container-im">
          <img :style="{ 'height': '100%', 'aspect-ratio': `${data.case.photo.asset.metadata.dimensions.aspectRatio}` }"
            :src="data.case.photo.asset.metadata.lqip" alt="">
        </div>
        <div :class="{ active: loaded === true }" class="d-container-im">
          <template v-if='data.case?.negative'>
            <div ref="gradientElement" class="d-container-im-o" data-lenis-prevent :style="{
              'aspect-ratio':
                data.case.photo.asset.metadata.dimensions.aspectRatio,
            }">
              <div class="d-container-im-m" v-if='data.case.ghostMeta'
                :style="{ mixBlendMode: 'difference', background: 'black', color: 'white' }">
                <GhostMetadata :blocks='data.case.ghostMeta' @click="toggleMetadata" />
              </div>
            </div>
          </template>
          <template v-else>
            <div ref="gradientElement" class="d-container-im-o" data-lenis-prevent :style="{
              'aspect-ratio':
                data.case.photo.asset.metadata.dimensions.aspectRatio,
            }">
              <div class="d-container-im-m" v-if='data.case.ghostMeta'>
                <GhostMetadata :blocks='data.case.ghostMeta' @click="toggleMetadata" />
              </div>
            </div>
          </template>

          <img ref='coverImg' class="d-container-im-e" @click="toggleMetadata" :onload="imageLoaded"
            :src="`${data.case.photo.asset.url + '?auto=format&w=2000'}`" alt="" />
        </div>
      </div>
      <div class="d-i">
        <p class="d-i-t">{{ data.case.title }}</p>
        <p @click="triggerAudio" class="d-i-a" v-if="data.case.audio">
          <span v-if="audioIsPlaying === false"> Play Audio </span>
          <span v-else> Pause Audio </span>
        </p>
        <div v-if="data.case.photo.asset.metadata" class="d-i-m">
          <div class="d-i-m-i">
            <span :style="{ 'text-transform': 'none' }" v-if="data.case.photo.asset.metadata?.exif?.FNumber">
              f/{{ data.case.photo.asset.metadata.exif.FNumber }}
            </span>
            <span v-if="
              data.case.photo.asset.metadata?.exif?.ExposureTime && ss !== null
            ">
              {{ ss }}
            </span>
            <span v-if="data.case.photo.asset.metadata?.exif?.ISO">
              ISO {{ data.case.photo.asset.metadata.exif.ISO }}
            </span>
            <span v-if="data.case.photo.asset.metadata?.exif">
              CS {{ data.case.photo.asset.metadata.exif.ColorSpace }}
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
        overflow: scroll;

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

  .negative {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
