import R from '~/R'

export default defineNuxtPlugin(app => {
  const _canvas = ref(null)
  let RInstance = null

  const setup = canvas => {
    _canvas.value = canvas

    if (_canvas.value) {
      RInstance = new R(_canvas.value)
    }
  }

  const load = async content => {
    // toRaw
    let raw = toRaw(content)
    await RInstance.loadPhotos(raw).then(p => {
      if (p.length === raw.length) {
        startEngine()
      }
    })
  }

  const startEngine = () => {
    RInstance.startEngine()
  }

  const stopEngine = () => {
    RInstance.stopEngine()
  }

  return {
    provide: {
      setup,
      load,
      startEngine,
      stopEngine,
    },
  }
})
