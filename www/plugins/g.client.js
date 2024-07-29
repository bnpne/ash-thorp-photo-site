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

  const loadElements = async elements => {
    return new Promise(async resolve => {
      await RInstance.loadElements(elements).then(photos => resolve(photos))
    })
  }

  const handleScroll = () => {
    app.$lenis.on('scroll', ({scroll}) => {
      RInstance.updateScroll(scroll)
    })
  }

  const toHome = () => {
    RInstance.toHome()
  }

  const toDetail = () => {
    RInstance.toDetail()
  }

  const loadDetail = index => {
    RInstance.loadDetail(index)
  }

  const toNextDetail = direction => {
    // -1 left, 1 right
    RInstance.toNextDetail(direction)
  }

  return {
    provide: {
      setup,
      loadDetail,
      toNextDetail,
      load,
      loadElements,
      startEngine,
      stopEngine,
      toHome,
      toDetail,
    },
  }
})
