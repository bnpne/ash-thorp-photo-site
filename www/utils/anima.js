// TWEENS
import gsap from 'gsap'
import * as THREE from 'three'

const calcViewWidth = (pixels, sizes) => {
  return (pixels * sizes) / 1728
}

export const toPhoto = ({photos, target, camera}) => {
  let tl = gsap.timeline({
    paused: true,
  })

  let targetPhoto = photos[target]
  let b = calcViewWidth(window.innerHeight * 0.9, window.innerWidth)

  let tsx, tsy, scalar
  let ar = targetPhoto.metadata.dimensions.aspectRatio
  let animaScale = targetPhoto.mesh.scale
  let animaPos = targetPhoto.mesh.position

  if (ar >= 1) {
    tsx = b
    tsy = b / ar

    scalar = targetPhoto.mesh.scale.x / b
  } else if (ar < 1) {
    tsx = b * ar
    tsy = b

    scalar = targetPhoto.mesh.scale.y / b
  }

  let targetPosition = new THREE.Vector3()
  targetPhoto.mesh.getWorldPosition(targetPosition)

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
  tl.to(camera.position, {
    duration: 1.2,
    ease: 'easeInOutCubic',
    x: newCameraPosition.x,
    y: newCameraPosition.y,
    z: newCameraPosition.z,
    onUpdate: function () {
      // camera.lookAt(targetPosition)
      console.log(camera.position.z)
    },
  })

  return tl
}
