import * as THREE from 'three'
import {createImageMaterial} from '../Material/imageMaterial'
import {calcViewWidth} from '../utils'
import Sizes from '../Sizes'

export default class Photo {
  constructor({data, index}) {
    console.log(data)
    // Image Transform
    const IMG_TRANSFORM = '?auto=format&w=2000'

    // Data
    this.data = data

    // Photo Index
    this.index = index

    // Title
    this.title = data.title

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
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.frustumCulled = false

    this.resize()
  }

  setScale() {
    if (this.metadata.dimensions.aspectRatio > 0) {
      let w = calcViewWidth(150, this.sizes)
      let h = w / this.metadata.dimensions.aspectRatio

      this.scale.x = w
      this.scale.y = h
    } else {
      let h = calcViewWidth(150, this.sizes)
      let w = h * this.metadata.dimensions.aspectRatio

      this.scale.x = w
      this.scale.y = h
    }

    if (this.scale.x > 0 && this.scale.y > 0) {
      this.mesh.scale.set(this.scale.x, this.scale.y, 1)
    }
  }

  setPosition() {
    this.mesh.position.set(500 * this.index, 0, 0)
  }

  resize() {
    this.setScale()
    this.setPosition()
  }
}
