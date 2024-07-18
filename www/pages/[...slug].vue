<script setup>
const route = useRoute()
const slug = ref(null)
const dataStore = useData()
const data = ref(null)
const isUntitled = ref(false)

watch(() => dataStore.value, () => {
  if (dataStore.value.photos) {
    dataStore.value.photos.forEach(photo => {
      if (isUntitled.value === false) {
        if (photo.slug && photo.slug.current === slug.value) {
          data.value = photo
        }
      } else {
        if (i === parseFloat(slug.value)) {
          data.value = photo
        }
      }
    })
  }
})

onMounted(() => {
  let splt = route.params.slug[0].split('-')
  if (splt.includes('untitled')) {
    isUntitled.value = true
    slug.value = splt[1]
  } else {
    isUntitled.value = false
    slug.value = route.params.slug[0]
  }


  if (dataStore.value) {
    dataStore.value.photos.forEach((photo, i) => {
      if (isUntitled.value === false) {
        if (photo.slug && photo.slug.current === slug.value) {
          data.value = photo
        }
      } else {
        if (i === parseFloat(slug.value)) {
          data.value = photo
        }
      }
    })
  }

  console.log(data.value)
})
</script>

<template>
  <div id='page' class='d'>
    <div v-if='data' class='d-c'>
    </div>
  </div>
</template>

<style lang='scss'>
.d {}
</style>
