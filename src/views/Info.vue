<template>
  <b-card title="Create Awesome 🙌">
    <b-card-text>This is your second page. ]] {{ $t('staking') }} </b-card-text>
    <b-card-text> {{ info }} Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.</b-card-text>
  </b-card>
</template>

<script>
import { BCard, BCardText } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
  },
  data() {
    return {
      info: 'unloaded',
    }
  },
  mounted() {
    this.$http.get('/api/node_info', { crossdomain: true }).then(response => {
      this.data.info = response.data
    }).catch(e => {
      this.errors.push(e)
    })
  },
}
</script>

<style>

</style>
