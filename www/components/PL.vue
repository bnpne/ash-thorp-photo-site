<script setup>
</script>

<template>
  <div class='pl'>
    <p class='pl-t'>
      <span>A</span>
      <span>S</span>
      <span>H</span>
      <span>&nbsp;</span>
      <span>T</span>
      <span>H</span>
      <span>O</span>
      <span>R</span>
      <span>P</span>
    </p>
  </div>
</template>

<style lang="scss">
.pl {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9999999;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-t {
    overflow: hidden;

    &>span {
      display: inline-block;
      opacity: 0;
    }
  }
}
</style>
