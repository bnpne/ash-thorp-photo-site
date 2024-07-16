import Lenis from 'lenis'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

export default defineNuxtPlugin(app => {
  const lenis = new Lenis({
    lerp: 1,
  })

  gsap.registerPlugin(CustomEase)
  CustomEase.create('easeOutQuint', '0.22, 1, 0.36, 1')

  gsap.ticker.add(time => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return {
    provide: {
      lenis,
    },
  }
})
