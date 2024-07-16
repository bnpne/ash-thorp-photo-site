import R from '~/R'

export default defineNuxtPlugin(app => {
  const _canvas = ref(null)
  let RInstance = null

  const setup = canvas => {
    _canvas.value = canvas

    if (_canvas.value) {
      RInstance = new R(_canvas.value)
      startEngine()
    }
  }

  const load = async content => {
    // toRaw
    let raw = toRaw(content)
    await RInstance.loadPhotos(raw).then(p => {
      if (p.length === raw.length) {
        handleScroll()
      }
    })
  }

  const startEngine = () => {
    RInstance.startEngine()
  }

  const stopEngine = () => {
    RInstance.stopEngine()
  }

  const loadElements = elements => {
    RInstance.loadElements(elements)
  }

  const handleScroll = () => {
    app.$lenis.on('scroll', ({scroll}) => {
      RInstance.updateScroll(scroll)
    })
  }

  return {
    provide: {
      setup,
      load,
      loadElements,
      startEngine,
      stopEngine,
    },
  }
})
