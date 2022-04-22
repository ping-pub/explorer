<template>
  <div>
    <markdown-it-vue
      class="md-body"
      :content="content"
    />
  </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

export default {
  name: 'MarkdownView',
  components: {
    MarkdownItVue,
  },
  props: {
    content: {
      type: String,
      default: () => '',
    },
  },
}
</script>
