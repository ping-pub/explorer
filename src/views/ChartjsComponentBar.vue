<script>
import { Bar, mixins } from 'vue-chartjs'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // options: {
      //   plugins: {
      //     legend: {
      //       display: false,
      //       labels: {
      //         color: 'rgb(255, 99, 132)',
      //       },
      //     },
      //   },
      // },
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
}
</script>
