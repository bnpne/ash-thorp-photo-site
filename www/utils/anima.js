// TWEENS
import gsap from 'gsap'

export const toHomeAnima = ({photos}) => {
  let tl = gsap.timeline({
    paused: true,
  })

  tl.to(
    [document.body],
    {
      background: '#ffffff',
      duration: 1,
      color: '#000000',
      ease: 'custom',
    },
    '<',
  )
  tl.to(
    ['.n'],
    {
      duration: 1,
      color: '#000000',
      ease: 'custom',
    },
    '<',
  )

  photos.forEach((photo, i) => {
    let anima = photo.mesh.material.uniforms.opacity
    let pos = photo.mesh.position
    tl.to(
      pos,
      {
        y: photo.mesh.position.y - 100,
        duration: 1,
        ease: 'easeOutQuint',
      },
      i === 0 ? '<' : '<+=.005',
    )
    tl.to(
      anima,
      {
        value: 1,
        duration: 1,
        ease: 'easeOutQuint',
      },
      '<',
    )
  })

  return tl
}

export const toDetailAnima = ({photos}) => {
  let tl = gsap.timeline({
    paused: true,
  })

  tl.to(
    [document.body],
    {
      background: '#000000',
      duration: 1,
      color: '#ffffff',
      ease: 'custom',
    },
    '<',
  )
  tl.to(
    ['.n'],
    {
      duration: 1,
      color: '#ffffff',
      ease: 'custom',
    },
    '<',
  )

  photos.forEach((photo, i) => {
    let anima = photo.mesh.material.uniforms.opacity
    let pos = photo.mesh.position
    tl.to(
      pos,
      {
        y: photo.mesh.position.y + 100,
        duration: 1,
        ease: 'easeOutQuint',
      },
      '<+=.005',
    )
    tl.to(
      anima,
      {
        value: 0,
        duration: 1,
        ease: 'easeOutQuint',
      },
      '<',
    )
  })

  return tl
}
