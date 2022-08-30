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
                Moniter
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
    <b-card v-if="roundState['height/round/step']">
      <b-card-title class="d-flex justify-content-between">
        <span>Height/Round/Step: {{ roundState['height/round/step'] }}</span>
        <small class="text-danger">Updated at {{ format(updatetime) }}</small>
      </b-card-title>
      <div
        v-for="item in roundState.height_vote_set"
        :key="item.round"
      >
        Round: {{ item.round }} {{ item.precommits_bit_array }}
        <b-card-body class="px-0">
          <b-button
            v-for="(pre, i) in item.precommits"
            :key="i"
            size="sm"
            style="margin: 2px;"
            :variant="color(i, pre)"
          >
            <small>{{ showName(i, pre) }}</small>
          </b-button>
        </b-card-body>
      </div>
      <b-card-footer>
        <b-button
          variant="primary"
          size="sm"
        />  Proposer Signed
        <b-button
          variant="outline-primary"
          size="sm"
        />  Proposer Not Signed
        <b-button
          variant="success"
          size="sm"
        /> Signed
        <b-button
          variant="outline-secondary"
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
        <span>If you want to change the default rpc endpoint. make sure that "https" and "CORS" are enabled on your server.</span>
      </div>
    </b-alert>
  </div>
</template>

<script>
import {
  BAvatar, BCardFooter, BRow, BCol, BCardTitle, BAlert,
  BCard, BCardBody, BInputGroup, BFormInput, BInputGroupAppend, BButton,
} from 'bootstrap-vue'
import fetch from 'node-fetch'
import {
  consensusPubkeyToHexAddress, getLocalChains, getCachedValidators, toDay,
} from '@/libs/utils'
import vSelect from 'vue-select'

export default {
  components: {
    BAlert,
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
    this.timer = setInterval(this.update, 6000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    format: v => toDay(v, 'time'),
    color(i, txt) {
      if (i === this.roundState.proposer.index) {
        return txt === 'nil-Vote' ? 'outline-primary' : 'primary'
      }
      return txt === 'nil-Vote' ? 'outline-secondary' : 'success'
    },
    update() {
      this.updatetime = new Date()
      if (this.httpstatus === 200) {
        fetch(this.rpc).then(data => {
          this.httpstatus = data.status
          this.httpStatusText = data.httpStatusText
          return data.json()
        }).then(res => {
          this.roundState = res.result.round_state
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
      const val = this.vals.find(x => x.hex.startsWith(txt))
      return val?.description?.moniker || txt
    },
  },

}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
