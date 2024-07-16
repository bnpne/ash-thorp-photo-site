<script setup>
import gsap from 'gsap'

const { $load } = useNuxtApp()

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
    <PL />
    <Nav />
    <NuxtPage />
    <Canvas />
  </main>
</template>
