import * as THREE from 'three'
import Sizes from './Sizes'
import Photo from './Photo'

const CAMERA_POS_Z = 500

export default class R {
  constructor(canvas) {
    this.canvas = canvas
    this.sizes = new Sizes()
    this.photoArray = []

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

  /**
   * Load Photos
   */
  createPositions() {
    // initial grid
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
