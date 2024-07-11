import * as THREE from 'three'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

export const createImageMaterial = ({
  color = new THREE.Color('white'),
  scale = 1, // Vector 2 or Array
  imageBounds = [1, 1], // Vector 2 or Array
  texture = null, // Image texture
  zoom = 1, // Number
  grayscale = false, // Boolean
  opacity = 1, // Number
  transparent = true, // Boolean
  strength = 2,
  sizes = null,
}) => {
  const planeBounds = Array.isArray(scale)
    ? [scale[0], scale[1]]
    : [scale, scale]

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tex: {value: texture},
      color: {value: color},
      scale: {value: planeBounds},
      imageBounds: {value: imageBounds},
      zoom: {value: zoom},
      grayscale: {value: grayscale},
      opacity: {value: opacity},
      strength: {value: strength},
      sizes: {value: sizes},
    },
    transparent: transparent,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  })

  return material
}
