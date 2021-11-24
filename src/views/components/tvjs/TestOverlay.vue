<script>
/* eslint-disable */
// Spline renderer. (SMAs, EMAs, TEMAs...
// you know what I mean)
// TODO: make a real spline, not a bunch of lines...

// Adds all necessary stuff for you.
import { Overlay } from 'trading-vue-js'

export default {
  name: 'TestOverlay',
  mixins: [Overlay],
  data() {
    return {
      COLORS:
            [
              '#5691ce', '#612ff9',
              '#d50b90', '#ff2316',
            ],
    }
  },
  // Define internal setting & constants here
  computed: {
    sett() {
      return this.$props.settings
    },
    line_width() {
      return this.sett.lineWidth || 3
    },
    color() {
      const n = this.$props.num % 5
      return this.sett.color || this.COLORS[n]
    },
    data_index() {
      return this.sett.dataIndex || 1
    },
  },
  methods: {
    meta_info() {
      return { author: 'CyberFist', version: '1.0.0' }
    },
    // Here goes your code. You are provided with:
    // { All stuff is reactive }
    // $props.layout -> positions of all chart elements +
    //  some helper functions (see layout_fn.js)
    // $props.interval -> candlestick time interval
    // $props.sub -> current subset of candlestick data
    // $props.data -> your indicator's data subset.
    //  Comes "as is", should have the following format:
    //  [[<timestamp>, ... ], ... ]
    // $props.colors -> colors (see TradingVue.vue)
    // $props.cursor -> current position of crosshair
    // $props.settings -> indicator's custom settings
    //  E.g. colors, line thickness, etc. You define it.
    // $props.num -> indicator's layer number (of All
    // layers in the current grid)
    // $props.id -> indicator's id (e.g. EMA_0)
    // ~
    // Finally, let's make the canvas dirty!
    draw(ctx) {
      ctx.lineWidth = this.line_width
      ctx.strokeStyle = this.color
      ctx.beginPath()

      const { layout } = this.$props
      const i = this.data_index

      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0])
        const y = layout.$2screen(p[i])
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    },

    // For all data with these types overlay will be
    // added to the renderer list. And '$props.data'
    // will have the corresponding values. If you want to
    // redefine the default behviour for a prticular
    // indicator (let's say EMA),
    // just create a new overlay with the same type:
    // e.g. use_for() { return ['EMA'] }.
    use_for() { return ['TestOverlay'] },

    // Colors for the legend, should have the
    // same dimention as a data point (excl. timestamp)
    data_colors() { return [this.color] },
  },

}
</script>
