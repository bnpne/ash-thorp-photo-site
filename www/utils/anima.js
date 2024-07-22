// TWEENS
import gsap from 'gsap'
import * as THREE from 'three'

export const toPhoto = ({photos, target, camera}) => {
  let targetPhoto = photos[target]

  let targetPosition = new THREE.Vector3()
  targetPhoto.mesh.getWorldPosition(targetPosition)

  let tl = gsap.timeline({
    paused: true,
    ease: 'custom',
    onUpdate: () => {},
  })

  // Calculate the offset to move the target plane to the origin (0, 0, 0)
  let offset = new THREE.Vector3().subVectors(
    targetPosition,
    new THREE.Vector3(0, 0, 0),
  )

  // Adjust camera position to counteract the offset
  let newCameraPosition = new THREE.Vector3().addVectors(
    camera.position,
    offset,
  )
  let zoomFactor = 6.2
  newCameraPosition.z /= zoomFactor

  // Animate the camera movement
  tl.to(
    camera.position,
    {
      x: newCameraPosition.x,
      y: newCameraPosition.y,
      z: newCameraPosition.z,
      duration: 1.5,
      ease: 'custom',
    },
    '<',
  )

  photos.forEach((photo, i) => {
    if (i !== target) {
      let o = photo.mesh.material.uniforms.opacity
      let z = photo.mesh.position
      tl.to(
        o,
        {
          value: 0,
          ease: 'custom',
          duration: 1.5,
        },
        '<',
      )
      // tl.to(
      //   z,
      //   {
      //     z: -100,
      //     ease: 'custom',
      //     duration: 1.5,
      //   },
      //   '<',
      // )
    }
  })

  tl.to(
    [document.body],
    {
      background: '#000000',
      duration: 1.5,
      color: '#ffffff',
      ease: 'custom',
    },
    '<',
  )
  tl.to(
    ['.n'],
    {
      duration: 1.5,
      color: '#ffffff',
      ease: 'custom',
    },
    '<',
  )

  return tl
}

export const toNextPhoto = ({prev, target, camera, photos}) => {
  let tl = gsap.timeline({
    paused: true,
    ease: 'custom',
    onUpdate: () => {},
  })

  let targetPhoto = photos[prev]

  let targetPosition = new THREE.Vector3()
  targetPhoto.mesh.getWorldPosition(targetPosition)

  let nextPhoto = photos[target]
  let nextPosition = new THREE.Vector3()
  nextPhoto.mesh.getWorldPosition(nextPosition)

  // Calculate the offset to move to the next photo
  let offset = new THREE.Vector3().subVectors(nextPosition, targetPosition)

  // Calculate the new camera position by adding the offset
  let newCameraPosition = new THREE.Vector3().addVectors(
    camera.position,
    offset,
  )

  tl.to(
    camera.position,
    {
      x: newCameraPosition.x,
      y: newCameraPosition.y,
      duration: 1,
      ease: 'custom',
    },
    '<',
  )

  photos.forEach((photo, i) => {
    if (i === prev) {
      let o = photo.mesh.material.uniforms.opacity
      tl.to(
        o,
        {
          value: 0,
          ease: 'custom',
          duration: 1,
        },
        '<',
      )
    }
    if (i === target) {
      let o = photo.mesh.material.uniforms.opacity
      tl.to(
        o,
        {
          value: 1,
          ease: 'custom',
          duration: 1,
        },
        '<',
      )
    }
  })

  return tl
}
