<script setup>
import gsap from 'gsap'

definePageMeta({
  pageTransition: {
    css: false,
    name: 'photo',
    mode: 'out-in',
    onEnter(el, done) {
      const { $toHome } = useNuxtApp()
      const { isMobile } = useDevice();

      if (isMobile === false) {

        $toHome()
        done()
      } else {
        let intro = gsap.timeline({ paused: true, onComplete: () => done() })
        intro.to('.h-c', { opacity: 1, ease: 'easeOutQuint', duration: .6 }, '<')
        intro.to('.n', { color: '#000000', ease: 'easeOutQuint', duration: .6 }, '<')
        intro.to([document.body], { color: '#000000', background: '#ffffff', ease: 'easeOutQuint', duration: .6 }, '<')
        intro.play()
      }
    },
    onLeave(el, done) {
      const route = useRoute()
      const { isMobile } = useDevice();
      const { $toDetail, $toInfo } = useNuxtApp()
      const info = toInfo()

      if (isMobile === false) {
        if (info.value === false || info.value === undefined) {
          $toDetail()
        } else {
          $toInfo()
        }

        done()
      }
      else {
        if (info.value === false || info.value === undefined) {
          let intro = gsap.timeline({ paused: true, onComplete: () => done() })
          intro.to('.h-c', { opacity: 0, ease: 'easeOutQuint', duration: .6 }, '<')
          intro.to('.n', { color: '#ffffff', ease: 'easeOutQuint', duration: .6 }, '<')
          intro.to([document.body], { color: '#ffffff', background: '#000000', ease: 'easeOutQuint', duration: .6 }, '<')
          intro.play()
        } else {
          gsap.to('.h-c', { opacity: 0, ease: 'easeOutQuint', duration: .6, onComplete: () => done() })
        }
      }
    },
  },
})

const dataStore = useData()
</script>

<template>
  <div>
  </div>
</template>

<style lang="scss"></style>
