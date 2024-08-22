import * as THREE from 'three'
import Sizes from './Sizes'
import Photo from './Photo'
import {useRouter} from 'vue-router'
import {useNuxtApp} from '#app'
import {toDetailAnima, toHomeAnima} from '~/utils/anima'
import GUI from 'lil-gui'

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
    this.timer

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

    this.distance = CAMERA_POS_Z
    this.camera = new THREE.PerspectiveCamera(
      this.calcFov(),
      this.sizes.width / this.sizes.height,
      0.1,
      this.distance,
    )
    this.camera.position.z = this.distance

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
      this.photoArray.forEach(p => (p.isDetail = false))
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
      this.photoArray.forEach(p => (p.isDetail = true))
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
      this.photoArray.forEach(p => (p.isDetail = true))
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
      this.photoArray.forEach(p => (p.isDetail = true))
      this.inTransition = true
      this.app.$lenis.stop()
    })

    this.toDetailTl.play()
  }

  /**
   * Resize
   */
  resize() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.fov = this.calcFov()
      this.camera.position.z = CAMERA_POS_Z
      this.camera.updateProjectionMatrix()

      /// ORTHO
      // this.camera.left = this.sizes.width / -2
      // this.camera.right = this.sizes.width / 2
      // this.camera.top = this.sizes.height / 2
      // this.camera.bottom = this.sizes.height / -2

      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(this.sizes.pixelRatio)

      // debounce resize of planes
      this.photoArray.forEach((photo, i) => {
        photo.resize()
      })
    }, 250)
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
    return (
      2 * Math.atan(this.sizes.height / (2 * this.distance)) * (180 / Math.PI)
    )
  }
}
