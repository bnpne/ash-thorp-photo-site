import * as THREE from 'three'
import Sizes from './Sizes'
import Photo from './Photo'
import gsap from 'gsap'

import {useRouter} from 'vue-router'
import {useNuxtApp} from '#app'

import {toDetailAnima, toHomeAnima} from '~/utils/anima'

const CAMERA_POS_Z = 500

export default class R {
  constructor(canvas) {
    this.canvas = canvas
    this.sizes = new Sizes()
    this.photoArray = []
    this.elements = []
    this.scroll = 0
    this.activePhoto = null
    this.isDetail = false
    this.inTransition = false
    this.toDetailTl = null
    this.toHomeTl = null
    this.scrollMemory

    this.router = useRouter()

    this.app = useNuxtApp()

    this.init()
    this.listeners()
  }

  /**
   * Initialize
   */
  init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.sizes.width / this.sizes.height,
      10,
      1000,
    )
    this.camera.position.z = CAMERA_POS_Z
    this.camera.fov = this.calcFov()
    this.camera.updateProjectionMatrix()

    this.scene.add(this.camera)

    this.resize()
  }

  /**
   * Load Photos
   */
  loadPhotos(photos) {
    return new Promise(resolve => {
      photos.forEach((photo, i) => {
        // Create photo element
        let p = new Photo({data: photo, index: i})
        this.photoArray[i] = p

        this.scene.add(p.mesh)
      })

      resolve(this.photoArray)
    })
  }

  loadElements(elements) {
    return new Promise(resolve => {
      this.elements = elements

      if (this.photoArray.length === this.elements.length) {
        this.photoArray.forEach((photo, i) => {
          photo.addElement(this.elements[photo.index])
        })
      }

      resolve(this.photoArray)
    })
  }

  /**
   * Handle Scroll
   */
  updateScroll(scroll) {
    if (this.inTransition === false && this.isDetail === false) {
      this.scroll = scroll

      if (this.photoArray.length > 0) {
        this.photoArray.forEach(photo => photo.updateScroll(this.scroll))
      }
    }
  }

  /**
   * Animations
   */
  toHome() {
    this.toHomeTl = toHomeAnima({photos: this.photoArray})
    this.toHomeTl.eventCallback('onComplete', () => {
      this.isDetail = false
      this.inTransition = false
      this.app.$lenis.scrollTo(this.scrollMemory, {
        immediate: true,
        force: true,
        lock: true,
      })
      this.app.$lenis.start()
    })

    this.toHomeTl.play()
  }

  toDetail() {
    this.scrollMemory = this.app.$lenis.scroll
    let isInfo = false
    this.toDetailTl = toDetailAnima({photos: this.photoArray, info: isInfo})
    this.toDetailTl.eventCallback('onStart', () => {
      this.isDetail = true
      this.inTransition = true
      this.app.$lenis.stop()
    })

    this.toDetailTl.play()
  }

  loadDetail() {
    this.scrollMemory = this.app.$lenis.scroll
    let isInfo = false
    this.toDetailTl = toDetailAnima({photos: this.photoArray, info: isInfo})
    this.toDetailTl.eventCallback('onStart', () => {
      this.isDetail = true
      this.inTransition = true
      this.app.$lenis.stop()
    })

    this.toDetailTl.play()
  }

  toInfo() {
    this.scrollMemory = this.app.$lenis.scroll
    let isInfo = true
    this.toDetailTl = toDetailAnima({photos: this.photoArray, info: isInfo})
    this.toDetailTl.eventCallback('onStart', () => {
      this.isDetail = true
      this.inTransition = true
      this.app.$lenis.stop()
    })

    this.toDetailTl.play()
  }

  /**
   * Resize
   */
  resize() {
    this.camera.aspect = this.sizes.aspect
    this.camera.fov = this.calcFov()
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)

    this.photoArray.forEach(photo => {
      photo.resize()
    })
  }

  /**
   * Listeners
   */
  listeners() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  /**
   * Render Loop
   */
  startEngine() {
    requestAnimationFrame(this.raf)
  }

  stopEngine() {
    cancelAnimationFrame(this.raf)
  }

  raf = () => {
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this.raf)
  }

  /**
   * FUNCTIONS
   */

  /**
   * Calculate Field of View
   */
  calcFov() {
    return (2 * Math.atan(this.sizes.height / 2 / CAMERA_POS_Z) * 180) / Math.PI
  }
}
