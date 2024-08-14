import * as THREE from 'three'

class Resize extends THREE.EventDispatcher {
  constructor() {
    super()

    this.setEvents()
  }

  setEvents = () => {
    window.addEventListener('resize', () => {
      console.log('resizing')
      this.dispatchEvent({
        type: 'resize',
      })
    })
  }
}

export default Resize
