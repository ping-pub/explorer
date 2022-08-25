<template>
  <div class="container-md">
    <full-header />
    <b-card class="d-flex justify-content-start my-1">
      <b-breadcrumb :items="navs" />
    </b-card>

    <b-card>
      <b-row>
        <b-col
          sm="12"
          md="4"
        >
          <v-select
            v-model="selected"
            :options="Object.values(chains)"
            label="chain_name"
            @input="onchange"
          >
            <template #no-options="">
              Please select a chain.
            </template>
            <template #option="{ chain_name, logo }">
              <b-avatar
                :src="logo"
                size="16"
                variant="light-primary"
                class="align-middle mr-50"
              />
              <span> {{ chain_name.toUpperCase() }}</span>
            </template>
          </v-select>
        </b-col>
        <b-col>
          <b-input-group>
            <b-form-input
              v-model="rpc"
              placeholder="Button on both side"
            />
            <b-input-group-append>
              <b-button
                variant="outline-primary"
                @click="update()"
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
    <b-card
      v-if="roundState['height/round/step']"
      :title="`Height/Round/Step: ${roundState['height/round/step']}`"
    >
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
    <app-footer class="mb-1" />
  </div>
</template>

<script>
import {
  BAvatar, BCardFooter, BRow, BCol,
  BBreadcrumb, BCard, BCardBody, BInputGroup, BFormInput, BInputGroupAppend, BButton,
} from 'bootstrap-vue'
import fetch from 'node-fetch'
import { consensusPubkeyToHexAddress, getLocalChains } from '@/libs/utils'
import vSelect from 'vue-select'
import AppFooter from '@/@core/layouts/components/AppFooter.vue'
import FullHeader from './components/FullHeader.vue'

export default {
  components: {
    FullHeader,
    BBreadcrumb,
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
    vSelect,
    AppFooter,
  },

  data() {
    const chains = getLocalChains()
    return {
      navs: [
        {
          text: 'Tools',
        },
        {
          text: 'Consensus Monitor',
        },
      ],
      showPrevote: false,
      httpstatus: 200,
      httpStatusText: '',
      roundState: {},
      chains,
      vals: [],
      positions: [],
    }
  },
  computed: {
    selected() {
      return this.$route.query.chain || this.chains[Object.keys(this.chains)[0]].chain_name
    },
    rpc() {
      return `${this.chains[this.selected].rpc[0]}/consensus_state`
    },
  },
  created() {
    this.validators()
  },
  methods: {
    color(i, txt) {
      if (i === this.roundState.proposer.index) {
        return txt === 'nil-Vote' ? 'outline-primary' : 'primary'
      }
      return txt === 'nil-Vote' ? 'outline-secondary' : 'success'
    },
    update() {
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
    },
    validators() {
      const conf = this.chains[this.selected]
      this.$http.getValidatorList(conf).then(data => {
        this.vals = data.map(x => {
          const x2 = x
          x2.hex = consensusPubkeyToHexAddress(x.consensus_pubkey)
          return x2
        })
      })
    },
    onchange(v) {
      this.httpstatus = 200
      this.httpStatusText = ''
      this.roundState = {}
      this.selected = v.chain_name
      this.rpc = `${v.rpc[0]}/consensus_state`
      // used for mapping nil-vote validators
      fetch(`${v.rpc[0]}/validators?per_page=100`).then(data => data.json()).then(res2 => {
        this.positions = res2.result.validators
        if (res2.result.total > 100) {
          fetch(`${v.rpc[0]}/validators?page=2&per_page=100`).then(data => data.json()).then(res => {
            this.positions = this.positions.concat(res.result.validators)
          })
        }
      }).catch(err => {
        this.httpstatus = 500
        this.httpStatusText = err
      })
      this.validators()
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
