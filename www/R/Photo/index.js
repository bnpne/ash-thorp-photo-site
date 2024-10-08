import * as THREE from 'three'
import {createImageMaterial} from '../Material/imageMaterial'
import {calcViewWidth} from '../utils'
import Sizes from '../Sizes'

export default class Photo {
  constructor({data, index}) {
    this.element = null
    this.scroll = 0
    this.isDetail = false

    // Image Transform
    const IMG_TRANSFORM = '?auto=format&w=300'

    // Data
    this.data = data

    // Photo Index
    this.index = index

    // Title
    this.title = data.title

    this.slug = data.slug

    // File Information
    this.file = {
      url: data.photo.asset.url + IMG_TRANSFORM,
      name: data.photo.asset.originalFilename,
    }

    // Metadata
    this.metadata = {
      blurHash: data.photo.asset.metadata.blurHash,
      lqip: data.photo.asset.metadata.lqip,
      dimensions: data.photo.asset.metadata.dimensions,
    }

    // Palette
    this.palette = {
      darkMuted: {
        background: data.photo.asset.metadata.palette.darkMuted.background,
        foreground: data.photo.asset.metadata.palette.darkMuted.foreground,
        population: data.photo.asset.metadata.palette.darkMuted.population,
        title: data.photo.asset.metadata.palette.darkMuted.title,
      },
      darkVibrant: {
        background: data.photo.asset.metadata.palette.darkVibrant.background,
        foreground: data.photo.asset.metadata.palette.darkVibrant.foreground,
        population: data.photo.asset.metadata.palette.darkVibrant.population,
        title: data.photo.asset.metadata.palette.darkVibrant.title,
      },
      dominant: {
        background: data.photo.asset.metadata.palette.dominant.background,
        foreground: data.photo.asset.metadata.palette.dominant.foreground,
        population: data.photo.asset.metadata.palette.dominant.population,
        title: data.photo.asset.metadata.palette.dominant.title,
      },
      lightMuted: {
        background: data.photo.asset.metadata.palette.lightMuted.background,
        foreground: data.photo.asset.metadata.palette.lightMuted.foreground,
        population: data.photo.asset.metadata.palette.lightMuted.population,
        title: data.photo.asset.metadata.palette.lightMuted.title,
      },
      lightVibrant: {
        background: data.photo.asset.metadata.palette.lightVibrant.background,
        foreground: data.photo.asset.metadata.palette.lightVibrant.foreground,
        population: data.photo.asset.metadata.palette.lightVibrant.population,
        title: data.photo.asset.metadata.palette.lightVibrant.title,
      },
      vibrant: {
        background: data.photo.asset.metadata.palette.vibrant.background,
        foreground: data.photo.asset.metadata.palette.vibrant.foreground,
        population: data.photo.asset.metadata.palette.vibrant.population,
        title: data.photo.asset.metadata.palette.vibrant.title,
      },
      muted: {
        background: data.photo.asset.metadata.palette.muted.background,
        foreground: data.photo.asset.metadata.palette.muted.foreground,
        population: data.photo.asset.metadata.palette.muted.population,
        title: data.photo.asset.metadata.palette.muted.title,
      },
    }

    this.scale = {
      x: 0,
      y: 0,
    }

    this.pos = {
      x: 0,
      y: 0,
    }

    this.sizes = new Sizes()

    this.init()
  }

  init() {
    this.texture = new THREE.TextureLoader().load(this.file.url)
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = createImageMaterial({
      texture: this.texture,
      imageBounds: [
        this.metadata.dimensions.width,
        this.metadata.dimensions.height,
      ],
      opacity: 1,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.key = this.index
    this.mesh.frustumCulled = false

    this.resize()
  }

  addElement(element) {
    this.element = element
    this.setScale()
    this.setPosition()
  }

  setScale() {
    // let b = calcViewWidth(150, this.sizes)

    if (this.element) {
      let bounds = this.element.getBoundingClientRect()

      // if (this.metadata.dimensions.aspectRatio >= 1) {
      //   this.scale.x = bounds.width
      //   this.scale.y = bounds.width / this.metadata.dimensions.aspectRatio
      // } else if (this.metadata.dimensions.aspectRatio < 1) {
      //   this.scale.x = bounds.height * this.metadata.dimensions.aspectRatio
      //   this.scale.y = bounds.height
      // }

      this.scale.x = bounds.width
      this.scale.y = bounds.height

      this.mesh.material.uniforms.scale.value = [this.scale.x, this.scale.y]
      // if (this.index === 0) {
      //   console.log(bounds, this.scale)
      // }

      this.mesh.scale.set(this.scale.x, this.scale.y, 1)
      // if (this.index === 0) {
      //   console.log({
      //     boundsWidth: bounds.width,
      //     boundsHeight: bounds.height,
      //     meshWidth: this.mesh.scale.x,
      //     meshHeight: this.mesh.scale.y,
      //   })
      // }
    }
  }

  setPosition() {
    if (this.element) {
      let bounds = this.element.getBoundingClientRect()
      let x = bounds.left - this.sizes.width / 2 + bounds.width / 2
      // let x = bounds.left - this.sizes.width / 2 + this.mesh.scale.x / 2
      let y =
        -this.scroll -
        bounds.top +
        this.sizes.height / 2 -
        bounds.height / 2 +
        this.scroll

      if (this.isDetail === false) {
        this.mesh.position.x = x
        this.mesh.position.y = y
      } else {
        this.mesh.position.x = x
        this.mesh.position.y = y + 100
      }
    }
  }

  updateScroll(scroll) {
    this.scroll = scroll
    let bounds = this.element.getBoundingClientRect()
    let y =
      -this.scroll -
      bounds.top +
      this.sizes.height / 2 -
      bounds.height / 2 +
      this.scroll

    this.mesh.position.y = y
  }

  resize() {
    this.setScale()
    this.setPosition()
  }
}
