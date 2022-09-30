<script>
import {
  BNav, BNavItem, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import DarkToggler from '@/@core/layouts/components/app-navbar/components/DarkToggler.vue'
import Locale from '@/@core/layouts/components/app-navbar/components/Locale.vue'

export default {
  components: {
    BNav,
    BNavItem,
    BButton,
    DarkToggler,
    Locale,
  },
  directives: {
    Ripple,
  },
}
</script>
