<script setup>
useHead({
  title: "ALT SEEN",
  // description: 'c/o Ben Paine',
  meta: [
    {
      charset: "UTF-8",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "white",
    },
  ],
});
useSeoMeta({
  title: "ALT SEEN",
  ogTitle: "ALT SEEN",
  // description: 'c/o Ben Paine',
  // ogDescription: 'c/o Ben Paine',
  ogImage: "https://www.altseen.com/atp-og.png",
  twitterCard: "summary_large_image",
});

import gsap from "gsap";

const route = useRoute()


onMounted(async () => {

  window.addEventListener('keydown', async (e) => {
    if (route.path !== '/' && route.path !== '/info') {
      if (e.key === 'Escape') {
        await navigateTo('/')
      }
    }
  })

  await nextTick();

  // Play preloader
  let plt = gsap.utils.toArray(".pl-t span");
  let tl = gsap.timeline({
    paused: true,
  });
  tl.to(
    plt,
    {
      opacity: 1,
      delay: 0.5,
      stagger: {
        each: 0.3,
        from: "edges",
      },
    },
    "<",
  ).to(
    ".pl",
    {
      opacity: 0,
      duration: 1,
      ease: "easeOutQuint",
    },
    ">+=.6",
  );

  tl.from(
    ["#title"],
    {
      opacity: 0,
      duration: 1,
      ease: "easeOutQuint",
    },
    "<",
  );


  tl.play();
});
</script>

<template>
  <main id="main">
    <PL />
    <Nav />
    <NuxtPage />
  </main>
</template>
