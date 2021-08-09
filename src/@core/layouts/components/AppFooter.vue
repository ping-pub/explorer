<template>
  <p class="clearfix mb-0">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      Powered By
      <b-link
        class="ml-25 font-weight-bolder"
        href="#"
        target="_blank"
      >Ping.pub</b-link>
    </span>

    <span class="float-md-right d-none d-md-block">Buy me a cup of coffee.
      <span
        v-b-popover.hover.topleft="'Atom: cosmos1ev0vtddkl7jlwfawlk06yzncapw2x9quyxx75u'"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        title="Thanks for your donation!"
        variant="outline-primary"
      >
        <feather-icon
          icon="HeartIcon"
          size="21"
          class="text-danger stroke-current"
        />
      </span>
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
