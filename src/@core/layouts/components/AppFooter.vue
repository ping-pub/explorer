<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-none d-md-block d-md-inline-block mt-25">
      Powered By
      <b-link
        class="ml-25 font-weight-bolder"
        href="https://pointnetwork.io/"
        target="_blank"
      >Point Network</b-link>
    </span>
  </p>
</template>

<script>
import { BLink, VBPopover } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  name: 'AppFooter',
  components: {
    BLink,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
}
</script>
