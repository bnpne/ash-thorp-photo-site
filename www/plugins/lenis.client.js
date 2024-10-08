import Lenis from 'lenis'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

export default defineNuxtPlugin(app => {
  const lenis = new Lenis({
    lerp: 1,
  })

  gsap.registerPlugin(CustomEase)
  CustomEase.create('easeOutQuint', '0.22, 1, 0.36, 1')
  CustomEase.create('easeInQuint', '0.64, 0, 0.78, 0')
  CustomEase.create('easeInOutQuint', '0.83, 0, 0.17, 1')
  CustomEase.create('easeInOutCubic', '0.65, 0, 0.35, 1')
  CustomEase.create('easeInOutQuart', '0.77, 0, 0.18, 1')
  CustomEase.create('custom', '0.81, 0, 0.34, .98')
  CustomEase.create('custom2', '0.79, 0.14, 0.15, 0.86')

  gsap.ticker.add(time => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // lenis.on('scroll', e => {
  // })

  return {
    provide: {
      lenis,
    },
  }
})
