<template>
  <div class="container-md">
    <b-card>
      <b-row>
        <b-col>
          <b-input-group>
            <b-form-input
              v-model="rpc"
              placeholder="Button on both side"
            />
            <b-input-group-append>
              <b-button
                variant="outline-primary"
                @click="onchange()"
              >
                Monitor
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <div
        v-if="httpstatus !== 200"
        class="text-danger"
      >
        {{ httpstatus }}: {{ httpStatusText }}
      </div>
    </b-card>
    <b-row v-if="roundState['height/round/step']">
      <b-col
        lg="3"
        sm="6"
      >
        <dashboard-card-horizontal
          icon="ArrowUpCircleIcon"
          color="danger"

          :statistic="rate"
          statistic-title="Onboard Rate"
        />
      </b-col>
      <b-col
        lg="3"
        sm="6"
      >
        <dashboard-card-horizontal
          icon="HashIcon"
          color="success"
          :statistic="height"
          statistic-title="Height"
        />
      </b-col>
      <b-col
        lg="3"
        sm="6"
      >
        <dashboard-card-horizontal
          icon="RepeatIcon"
          :statistic="round"
          statistic-title="Round"
        />
      </b-col>
      <b-col
        lg="3"
        sm="6"
      >
        <dashboard-card-horizontal
          icon="CodeIcon"
          color="info"
          :statistic="step"
          statistic-title="Step"
        />
      </b-col>
    </b-row>
    <b-card v-if="roundState['height/round/step']">
      <b-card-title class="d-flex justify-content-between">
        <small class="text-danger">Updated at {{ format(updatetime) }}</small>
      </b-card-title>
      <div
        v-for="item in roundState.height_vote_set"
        :key="item.round"
      >
        <small>Round: {{ item.round }} {{ item.prevotes_bit_array }}</small>
        <b-card-body class="px-0">
          <b-badge
            v-for="(pre, i) in item.prevotes"
            :key="i"
            size="sm"
            style="margin: 2px;"
            :variant="color(i, pre)"
          >
            <small class="small">{{ showName(i, pre) }}</small>
          </b-badge>
        </b-card-body>
      </div>
      <b-card-footer>
        <b-button
          variant="primary"
          size="sm"
        />  Proposer Signed
        <b-button
          variant="dark"
          size="sm"
        />  Proposer Not Signed
        <b-button
          variant="success"
          size="sm"
        /> Signed
        <b-button
          variant="secondary"
          size="sm"
        /> Not Signed
      </b-card-footer>
    </b-card>

    <b-alert
      variant="info"
      show
    >
      <h4 class="alert-heading">
        Tips
      </h4>
      <div class="alert-body">
        <ul>
          <li>This tool is useful for validators to monitor who is onboard during an upgrade</li>
          <li>If you want to change the default rpc endpoint. make sure that "https" and "CORS" are enabled on your server.</li>
        </ul>
      </div>
    </b-alert>
  </div>
</template>

<script>
import {
  BAvatar, BCardFooter, BRow, BCol, BCardTitle, BAlert, BBadge,
  BCard, BCardBody, BInputGroup, BFormInput, BInputGroupAppend, BButton,
} from 'bootstrap-vue'
import fetch from 'node-fetch'
import {
  consensusPubkeyToHexAddress, getLocalChains, getCachedValidators, toDay,
} from '@/libs/utils'
import vSelect from 'vue-select'
import DashboardCardHorizontal from './components/dashboard/DashboardCardHorizontal.vue'

export default {
  components: {
    BAlert,
    BBadge,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardFooter,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BAvatar,
    BCardTitle,
    vSelect,
    DashboardCardHorizontal,
  },

  data() {
    const chains = getLocalChains()
    return {
      showPrevote: false,
      httpstatus: 200,
      httpStatusText: '',
      roundState: {},
      chains,
      vals: [],
      positions: [],
      updatetime: new Date(),
      rpc: '',
      height: '-',
      round: '-',
      step: '-',
      rate: '-',
    }
  },
  computed: {
    selected() {
      return this.$store.state.chains.selected.chain_name
    },
  },
  created() {
    this.validators()
    this.rpc = `${this.chains[this.selected].rpc[0]}/consensus_state`
    this.fetchPosition()
    this.update()
    this.timer = setInterval(this.update, 6000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    format: v => toDay(v, 'time'),
    color(i, txt) {
      if (i === this.roundState.proposer.index) {
        return txt === 'nil-Vote' ? 'dark' : 'primary'
      }
      return txt === 'nil-Vote' ? 'secondary' : 'success'
    },
    fetchPosition() {
      const dumpurl = this.rpc.replace('consensus_state', 'dump_consensus_state')
      fetch(dumpurl).then(data => {
        this.httpstatus = data.status
        this.httpStatusText = data.httpStatusText
        return data.json()
      }).then(res => {
        this.positions = res.result.round_state.validators.validators
      })
    },
    update() {
      this.rate = '0%'
      this.updatetime = new Date()
      if (this.httpstatus === 200) {
        fetch(this.rpc).then(data => {
          this.httpstatus = data.status
          this.httpStatusText = data.httpStatusText
          return data.json()
        }).then(res => {
          this.roundState = res.result.round_state
          const raw = this.roundState['height/round/step'].split('/')
          // eslint-disable-next-line prefer-destructuring
          this.height = raw[0]
          // eslint-disable-next-line prefer-destructuring
          this.round = raw[1]
          // eslint-disable-next-line prefer-destructuring
          this.step = raw[2]

          // find the highest onboard rate
          this.roundState.height_vote_set.forEach(element => {
            const rate = Number(element.prevotes_bit_array.substring(element.prevotes_bit_array.length - 4))
            if (rate > 0) {
              this.rate = `${(rate * 100).toFixed()}%`
            }
          })
        }).catch(err => {
          this.httpstatus = 500
          this.httpStatusText = err
        })
      }
    },
    validators() {
      const conf = this.chains[this.selected]
      let vals = []
      this.$http.getValidatorList(conf).then(data => {
        vals = data
      }).catch(() => {
        vals = getCachedValidators(this.selected.chain_name) || []
      }).finally(() => {
        this.vals = vals.map(x => {
          const x2 = x
          x2.hex = consensusPubkeyToHexAddress(x.consensus_pubkey)
          return x2
        })
      })
    },
    onchange() {
      this.httpstatus = 200
      this.httpStatusText = ''
      this.roundState = {}
      // this.validators()
    },
    showName(i, text) {
      if (text === 'nil-Vote') {
        if (this.positions[i]) {
          const val = this.vals.find(x => x.hex === this.positions[i].address)
          return val?.description?.moniker || i
        }
        return i
      }
      const txt = text.substring(text.indexOf(':') + 1, text.indexOf(' '))
      const sig = text.split(' ')
      const val = this.vals.find(x => x.hex.startsWith(txt))
      return `${val?.description?.moniker || txt} - ${sig[2]}`
    },
  },

}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
