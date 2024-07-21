import * as THREE from 'three'
import Sizes from './Sizes'
import Photo from './Photo'

import {useRouter} from 'vue-router'
import {useNuxtApp} from '#app'

const CAMERA_POS_Z = 500

export default class R {
  constructor(canvas) {
    this.canvas = canvas
    this.sizes = new Sizes()
    this.photoArray = []
    this.elements = []
    this.scroll = 0
    this.isRaycasting = false
    this.raycaster
    this.pointer
    this.activePhoto = null
    this.toDetailTimeline = null
    this.isDetail = false

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

    this.createPositions()

    this.initRaycaster()

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

  loadDetail(index) {
    this.activePhoto = this.photoArray[index]
    this.toDetailTimeline = toPhoto({
      photos: this.photoArray,
      target: index,
      camera: this.camera,
    })

    this.toDetailTimeline.eventCallback('onStart', () => {
      this.app.$lenis.stop()
      this.isDetail = true
      document.body.style.cursor = 'auto'
    })

    this.toDetailTimeline.eventCallback('onReverseComplete', () => {
      // this.app.$lenis.start()
      document.body.style.cursor = 'auto'
    })

    this.toDetailTimeline.play()
  }

  /**
   * Load Photos
   */
  createPositions() {
    // initial grid
  }

  /**
   * Handle Scroll
   */
  updateScroll(scroll) {
    this.scroll = scroll

    if (this.photoArray.length > 0) {
      this.photoArray.forEach(photo => photo.updateScroll(this.scroll))
    }
  }

  /**
   * Raycaster
   */
  initRaycaster() {
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
  }

  pointerMove(e) {
    this.pointer.x = (e.clientX / this.sizes.width) * 2 - 1
    this.pointer.y = -(e.clientY / this.sizes.height) * 2 + 1
  }

  handleIntersecting(intersects) {
    if (intersects[0] && this.isDetail === false) {
      document.body.style.cursor = 'pointer'
      this.gridHoverIndex = intersects[0]?.object.key
    } else {
      document.body.style.cursor = 'auto'
      this.gridHoverIndex = null
    }
  }

  handleClick() {
    if (
      this.isRaycasting &&
      this.gridHoverIndex !== null &&
      this.isDetail === false
    ) {
      this.activePhoto = this.photoArray[this.gridHoverIndex]
      this.toDetailTimeline = toPhoto({
        photos: this.photoArray,
        target: this.gridHoverIndex,
        camera: this.camera,
      })

      this.toDetailTimeline.eventCallback('onStart', () => {
        this.app.$lenis.stop()
        this.isDetail = true
        document.body.style.cursor = 'auto'
      })

      this.toDetailTimeline.eventCallback('onComplete', () => {
        this.router.push(`/${this.activePhoto.slug.current}`)
      })

      this.toDetailTimeline.eventCallback('onReverseComplete', () => {
        // this.app.$lenis.start()
        document.body.style.cursor = 'auto'
      })

      this.toDetailTimeline.play()
    }
  }

  toHome() {
    if (!this.toDetailTimeline.reversed()) {
      this.toDetailTimeline.reverse().then(() => {
        this.app.$lenis.start()

        this.isDetail = false
      })
    }
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
    window.addEventListener('pointermove', this.pointerMove.bind(this))
    window.addEventListener('click', this.handleClick.bind(this))
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

    if (this.raycaster) {
      this.isRaycasting = true
      this.raycaster.setFromCamera(this.pointer, this.camera)

      // calculate objects intersecting the picking ray
      this.intersects = this.raycaster.intersectObjects(this.scene.children)

      this.handleIntersecting(this.intersects)
    }

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
