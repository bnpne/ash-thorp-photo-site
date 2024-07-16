<template>
  <nav class='n'>
    <div class='n-c'>
      <NuxtLink to='/'>ASH THORP</NuxtLink>
    </div>
    <div class='n-c'>
      <NuxtLink to='/'>Info</NuxtLink>
      <NuxtLink to='/'>Email</NuxtLink>
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

  &-c {
    display: flex;
    flex-direction: row;
    gap: desktop-vw(100px);
  }
}
</style>
