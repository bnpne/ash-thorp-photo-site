<script setup>
import gsap from 'gsap'

definePageMeta({
  pageTransition: {
    css: false,
    name: 'photo',
    mode: 'out-in',
    onEnter(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() })
      intro.from(el, { opacity: 1, ease: 'easeOutQuint', duration: .6 }, '<')
      intro.to('.n', { color: '#000000', ease: 'easeOutQuint', duration: .6 }, '<')
      intro.to([document.body], { color: '#000000', background: '#ffffff', ease: 'easeOutQuint', duration: .6 }, '<')
      intro.play()
    },
    onLeave(el, done) {
      let intro = gsap.timeline({ paused: true, onComplete: () => done() })
      intro.to(el, { opacity: 0, ease: 'easeOutQuint', duration: .6 }, '<')
      intro.play()
    },
  },
})


// Query Sanity
const query = groq`*[_type=='main'][0]{
  ..., collections[]{
    ...,
    photos[]->{..., photo{..., asset}, audio{..., asset->}}
  }}`;
const { data } = useLazySanityQuery(query);

onMounted(() => {
  console.log(data.value)
})
</script>

<template>
  <div ref="grid" v-if="data" class="h">
    <div class="h-m" v-if='data?.collections' v-for="collection in data?.collections">
      <div id="title" class="h-t">
        <h2>{{ collection.title }}</h2>
      </div>
      <div v-if="collection.photos" class="h-c">
        <NuxtLink v-for="photo in collection.photos" :to="`/${photo.slug.current}`" class="p">
          <SanityImage :asset-id="photo.photo.asset._ref" auto="format" w='500' />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.h {
  // padding: desktop-vw(20px);
  min-height: 100vh;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: desktop-vw(40px);
  padding: desktop-vw(80px) desktop-vw(20px);

  @include mobile() {
    padding: mobile-vw(80px) mobile-vw(10px);
    min-height: 100svh;
  }

  &-m {

    display: flex;
    flex-direction: column;
    gap: desktop-vw(40px);
  }

  &-c {
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 calc((100vw / 12) + desktop-vw(20px));
    gap: calc(((100vw - (((100vw / 12) + desktop-vw(20px)) * 2) - desktop-vw(40px)) - (desktop-vw(150px) * 8)) / 7);

    @include mobile() {
      margin: 0;
      gap: mobile-vw(40px);
      flex-direction: column;
      flex-wrap: nowrap;
    }
  }

  &-t {
    margin: 0 calc((100vw / 12) + desktop-vw(20px));

    @include mobile() {
      margin: 0;
    }
  }
}

.p {
  display: block;
  height: desktop-vw(150px);
  width: desktop-vw(150px);

  &:hover {
    img {
      filter: invert(1);
    }
  }

  @include mobile() {
    height: mobile-vw(400px);
    width: 100%;

  }

  &>img {
    transition: filter 300ms ease-out;
    @include image-default();
    width: 100%;
    object-fit: cover;
  }
}
</style>
