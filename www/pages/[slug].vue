<script setup>
import gsap from "gsap";
import { format } from "date-fns";
definePageMeta({
  middleware: [
    function (to, from) {
      const waiting = useWaiting();
      if (from.path === "/") {
        waiting.value = true;
      } else {
        waiting.value = false;
      }
    },
  ],
  pageTransition: {
    css: false,
    name: "detail",
    mode: "out-in",
    onEnter(el, done) {
      done();
    },
    onLeave(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() });
      intro
        .to(
          ".d-i",
          {
            opacity: 0,
            duration: 0.6,
            ease: "easeOutQuint",
          },
          "<"
        )
        .to(
          ".d-container-im",
          {
            opacity: 0,
            duration: 0.6,
            ease: "easeOutQuint",
          },
          "<"
        );

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



const handleNavLeft = async () => {
  // -1
  let prevIndex;
  if (index.value === 0) {
    prevIndex = allPhotos.value.length - 1;
  } else {
    prevIndex = index.value - 1;
  }

  if (prevIndex !== undefined) {
    await navigateTo(`/${allPhotos.value[prevIndex].slug?.current}`);
  }
};

const handleNavRight = async () => {
  // 1
  let nextIndex;
  if (index.value === allPhotos.value.length - 1) {
    nextIndex = 0;
  } else {
    nextIndex = index.value + 1;
  }

  if (nextIndex !== undefined) {
    await navigateTo(`/${allPhotos.value[nextIndex].slug?.current}`);
  }
};

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

const decimalToFraction = (decimal) => {
  if (decimal % 1 === 0) {
    return `${decimal}/1`;
  }

  const tolerance = 1.0e-6;
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1;
  let b = decimal;
  do {
    let a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

  return `${h1}/${k1}`;
};

const setImages = () => {
  if (allPhotos.value) {
    allPhotos.value.forEach((photo, i) => {
      if (photo.slug && photo.slug.current === slug.value) {
        index.value = i;
        pageData.value = photo;
      }
    });
  }
};


const query = groq`*[_type=='main']{
  ..., collections[]{
    ...,
    photos[]->{..., photo{..., asset->}, audio{..., asset->}}
  }}`;
const { data } = useLazySanityQuery(query);

onMounted(async () => {
  slug.value = route.params.slug
  if (data) {
    const collections = data.value[0].collections;
    const pa = Object.values(collections)
      .flat()
      .flatMap((collection) => toRaw(collection.photos));

    allPhotos.value = pa

    setImages()
  }
  await nextTick();

  if (pageData.value) {
    // create metadata
    let m = {
      title: pageData.value.title,
      audio: {
        id: pageData.value?.audio?.asset.assetId,
        path: pageData.value?.audio?.asset.path,
      },
      exif: pageData.value.photo.asset.metadata.exif ? {
        ApertureValue: pageData.value.photo.asset.metadata.exif.ApertureValue
          ? pageData.value.photo.asset.metadata.exif.ApertureValue
          : "null",
        BrightnessValue: pageData.value.photo.asset.metadata.exif.BrightnessValue
          ? pageData.value.photo.asset.metadata.exif.BrightnessValue
          : "null",
        DateDigitized: pageData.value.photo.asset.metadata.exif.DateTimeDigitized
          ? pageData.value.photo.asset.metadata.exif.DateTimeDigitized
          : "null",
        ExposureMode: pageData.value.photo.asset.metadata.exif.ExposureMode
          ? pageData.value.photo.asset.metadata.exif.ExposureMode
          : "null",
        ExposureTime: pageData.value.photo.asset.metadata.exif.ExposureTime
          ? pageData.value.photo.asset.metadata.exif.ExposureTime
          : "null",
        FStop: pageData.value.photo.asset.metadata.exif.FNumber
          ? pageData.value.photo.asset.metadata.exif.FNumber
          : "null",
        Flash: pageData.value.photo.asset.metadata.exif.Flash
          ? pageData.value.photo.asset.metadata.exif.Flash
          : "null",
        FocalLength: pageData.value.photo.asset.metadata.exif.FocalLength
          ? pageData.value.photo.asset.metadata.exif.FocalLength
          : "null",
        "35mmFocalLength": pageData.value.photo.asset.metadata.exif
          .FocalLengthIn35mmFormat
          ? pageData.value.photo.asset.metadata.exif.FocalLengthIn35mmFormat
          : "null",
        ISO: pageData.value.photo.asset.metadata.exif.ISO
          ? pageData.value.photo.asset.metadata.exif.ISO
          : "null",
        LensMake: pageData.value.photo.asset.metadata.exif.LensMake
          ? pageData.value.photo.asset.metadata.exif.LensMake
          : "null",
        LensModel: pageData.value.photo.asset.metadata.exif.LensModel
          ? pageData.value.photo.asset.metadata.exif.LensModel
          : "null",
        LensSpecification: pageData.value.photo.asset.metadata.exif.LensSpecification
          ? pageData.value.photo.asset.metadata.exif.LensSpecification
          : "null",
        Sharpness: pageData.value.photo.asset.metadata.exif.Sharpness
          ? pageData.value.photo.asset.metadata.exif.Sharpness
          : "null",
        ShutterSpeedValue: pageData.value.photo.asset.metadata.exif.ShutterSpeedValue
          ? pageData.value.photo.asset.metadata.exif.ShutterSpeedValue
          : "null",
        WhiteBalance: pageData.value.photo.asset.metadata.exif.WhiteBalance
          ? pageData.value.photo.asset.metadata.exif.WhiteBalance
          : "null",
        ColorSpace: pageData.value.photo.asset.metadata.exif.ColorSpace
          ? pageData.value.photo.asset.metadata.exif.ColorSpace
          : "null",
        FocalPlane: {
          x: pageData.value.photo.asset.metadata.exif.FocalPlaneXResolution,
          y: pageData.value.photo.asset.metadata.exif.FocalPlaneYResolution,
        },
      } : 'null',
      palette: {
        dominant: pageData.value.photo.asset.metadata.palette.dominant.background,
        muted: pageData.value.photo.asset.metadata.palette.muted.background,
        vibrant: pageData.value.photo.asset.metadata.palette.vibrant.background,
      },
      photoId: pageData.value.photo.asset.assetId,
      path: pageData.value.photo.asset.path,
      size: pageData.value.photo.asset.size,
      mime: pageData.value.photo.asset.mimeType,
      blurHash: pageData.value.photo.asset.metadata.blurHash,
      alpha: pageData.value.photo.asset.metadata.hasAlpha,
    };
    m = JSON.stringify(m);
    m = JSON.parse(m);
    metadata.value = m;

    // create gradient
    if (pageData.value.photo.asset.metadata.palette.dominant) {
      let darkVibrant =
        pageData.value.photo.asset.metadata.palette.darkVibrant.background;
      let darkMuted =
        pageData.value.photo.asset.metadata.palette.darkMuted.background;
      let lightMuted =
        pageData.value.photo.asset.metadata.palette.lightMuted.background;
      let lightVibrant =
        pageData.value.photo.asset.metadata.palette.lightVibrant.background;

      gradient.darkVibrant = darkVibrant;
      gradient.darkMuted = darkMuted;
      gradient.lightMuted = lightMuted;
      gradient.lightVibrant = lightVibrant;

      if (gradientElement.value) {
        gradientElement.value.style.background = `linear-gradient(70deg, ${gradient.lightVibrant}, ${gradient.lightMuted}, ${gradient.darkMuted})`;
      }
    }

    // handle exposure time
    if (pageData.value.photo.asset.metadata?.exif?.ExposureTime) {
      let decimal = pageData.value.photo.asset.metadata.exif.ExposureTime;

      let fraction = decimalToFraction(decimal);

      ss.value = fraction;
    }

    // intro animation
    let intro = gsap.timeline({ paused: true });

    if (isMobile === true) {
      intro.to(
        [document.body],
        {
          background: "#000000",
          duration: 1,
          color: "#ffffff",
          ease: "custom",
        },
        "<"
      );
      intro.to(
        [".n"],
        {
          duration: 1,
          color: "#ffffff",
          ease: "custom",
        },
        "<"
      );
    }

    intro
      .to(
        ".d-i",
        {
          opacity: 1,
          duration: waiting.value ? 1 : 0.6,
          delay: waiting.value ? 1.2 : 0,
          ease: "easeOutQuint",
        },
        "<"
      )
      .from(
        ".d-container",
        {
          opacity: 0,
          duration: waiting.value ? 1 : 0.6,
          ease: "easeOutQuint",
        },
        "<"
      );

    intro.play();

    // handle audio
    if (pageData.value.audio !== null) {
      audio.value = new Audio(pageData.value.audio.asset.url);
      audio.value.loop = true;
    }
  }
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});
</script>

<template>
  <div id="page" class="d">
    <div v-if="pageData" class="d-c">
      <div class="navigate">
        <div @click="handleNavLeft" class="navigate-l"></div>
        <div @click="handleNavRight" class="navigate-r"></div>
      </div>
      <div class="d-container">
        <div :class="{ active: loaded === false }" class="d-container-im">
          <!-- <img :style="{ 'height': '100%', 'aspect-ratio': `${data.photo.asset.metadata.dimensions.aspectRatio}` }" -->
          <!--   :src="data.photo.asset.metadata.lqip" alt=""> -->
        </div>
        <div :class="{ active: loaded === true }" class="d-container-im" >
          <div ref="gradientElement" class="d-container-im-o" :style="{
            'aspect-ratio': pageData.photo.asset.metadata.dimensions.aspectRatio,
          }">
            <div class="d-container-im-m" v-if='pageData.photo.asset.metadata?.exif'>
              <ul class="d-container-im-m-l">
                <li v-if="metadata.title">Title: "{{ metadata.title }}",</li>
                <li v-if="metadata.photoId">Id: {{ metadata.photoId }},</li>
                <li v-if="metadata.audio">
                  <template v-if="!audio">
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
                <li v-if="metadata.exif.ISO !== 'null'">
                  <template v-if="metadata.exif.ISO === 'null'">
                    <span>EXIF: {</span>
                    <span>Null</span>
                    <span>},</span>
                  </template>
                  <template v-else>
                    <span>EXIF: {</span>
                    <span>Date Digitized:
                      {{
                        format(
                          new Date(metadata.exif.DateDigitized),
                          "MM-dd-yyy HH:mm:ss a"
                        )
                      }},</span>
                    <span>Lens Make: {{ metadata.exif.LensMake }},</span>
                    <span>Lens Model: {{ metadata.exif.LensModel }},</span>
                    <span>Lens Specification:
                      {{ metadata.exif.LensSpecification }},</span>
                    <span>Brightness: {{ metadata.exif.BrightnessValue }},</span>
                    <span>Sharpness: {{ metadata.exif.Sharpness }},</span>
                    <span>White Balance: {{ metadata.exif.WhiteBalance }},</span>
                    <span>ISO: {{ metadata.exif.ISO }},</span>
                    <span>Aperture: {{ metadata.exif.ApertureValue }},</span>
                    <span>F Stop: {{ metadata.exif.FStop }},</span>
                    <span>Shutter Speed:
                      {{ metadata.exif.ShutterSpeedValue }},</span>
                    <span>Focal Length: {{ metadata.exif.FocalLength }},</span>
                    <span>Focal Plane: {{ metadata.exif.FocalPlane.x }},
                      {{ metadata.exif.FocalPlane.y }},</span>
                    <span>Exposure Time: {{ metadata.exif.ExposureTime }},</span>
                    <span>Exposure Mode: {{ metadata.exif.ExposureMode }},</span>
                    <span>Flash:
                      {{ metadata.exif.Flash === 1 ? "True" : "False" }},</span>
                    <span>35mm Focal Length:
                      {{ metadata.exif["35mmFocalLength"] }},</span>
                    <span>},</span>
                  </template>
                </li>
                <li v-if="metadata.palette">
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
          <img class="d-container-im-e" @click="pageData.photo.asset.metadata?.exif && toggleMetadata" :onload="imageLoaded"
            :src="`${pageData.photo.asset.url + '?auto=format&w=2000'}`" alt="" />
        </div>
      </div>
      <div class="d-i">
        <p class="d-i-t">{{ pageData.title }}</p>
        <p @click="triggerAudio" class="d-i-a" v-if="pageData.audio">
          <span v-if="audioIsPlaying === false"> Play Audio </span>
          <span v-else> Pause Audio </span>
        </p>
        <div v-if="pageData.photo.asset.metadata" class="d-i-m">
          <div class="d-i-m-i" v-if='pageData.photo.asset.metadata.exif'>
            <span :style="{ 'text-transform': 'none' }" v-if="pageData.photo.asset.metadata.exif.FNumber">
              f/{{ pageData.photo.asset.metadata.exif.FNumber }}
            </span>
            <span v-if="pageData.photo.asset.metadata.exif.ExposureTime && ss !== null">
              {{ ss }}
            </span>
            <span v-if="pageData.photo.asset.metadata.exif.ISO">
              ISO {{ pageData.photo.asset.metadata.exif.ISO }}
            </span>
            <span v-if="pageData.photo.asset.metadata.exif">
              CS {{ pageData.photo.asset.metadata.exif.ColorSpace }}
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transition: 300ms opacity ease-out;

      &.active {
        opacity: 1;
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
    opacity: 0;
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
