<script setup>
import { PortableText } from '@portabletext/vue'
import { h } from 'vue'
const props = defineProps(['blocks'])

const components = {
  block: {
    normal: ({ children }) =>
      h('p', { class: '' }, children),

    code: (props) => {
      const text = props.value.children?.[0]?.text || props.value.children
      return h(
        'pre',
        {
          class: ''
        },
        text
      )
    },

    ascii: (props) => {
      const text = props.value.children?.[0]?.text || props.value.children
      return h(
        'pre',
        {
          class: ''
        },
        text
      )
    }
  }
}
</script>

<template>
  <div v-if='props.blocks' class="ghost">
    <PortableText :value="props.blocks" :components="components" />
  </div>
</template>

<style lang="scss">
.ghost {
  font-family: 'IBM Plex Mono', monospace;
  // font-size: desktop-vw(5px);
  font-size: .55em;

  line-height: 1.15;
  white-space: pre;
  overflow: scroll;
}
</style>
