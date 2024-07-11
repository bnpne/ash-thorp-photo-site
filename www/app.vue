<script setup>
const { $load, $startEngine } = useNuxtApp()

// Query Sanity
const query = groq`*[_type=='main']{..., photos[]->{..., photo{..., asset->}}}`
const { data } = useSanityQuery(query)

// Data Store
const dataStore = useData()

onMounted(() => {
  if (data) {
    dataStore.value = data.value[0]
    let photos = dataStore.value.photos
    $load(photos)
  }
})
</script>

<template>
  <main id='main'>
    <NuxtPage />
    <Canvas />
  </main>
</template>
