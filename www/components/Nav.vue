<script setup>
const router = useRouter()
const app = useNuxtApp()
</script>

<template>
  <nav class='n'>
    <div class='n-c'>
      <!-- <div @click='goHome' class='n-c-h'>ASH THORP</div> -->
      <NuxtLink to='/' class='n-c-h'>ASH THORP</NuxtLink>
    </div>
    <div class='n-c'>
      <NuxtLink to='/info'>Info</NuxtLink>
      <NuxtLink to='mailto:ash@altcinc.com' target='_blank' ref='noreferrer'>Email</NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss">
.n {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: desktop-vw(20px);
  width: 100%;

  @include mobile() {
    padding: mobile-vw(10px);
  }

  &-c {
    display: flex;
    flex-direction: row;
    gap: desktop-vw(100px);

    @include mobile() {
      gap: mobile-vw(50px);
    }

    &-h {
      cursor: pointer;
    }
  }
}
</style>
