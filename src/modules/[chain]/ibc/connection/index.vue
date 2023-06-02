<script lang="ts" setup>
import router from '@/router'
const props = defineProps(['chain']);
console.log("props:", props)
router.push(`/${props.chain}/ibc/connection/connection-0`)
</script>