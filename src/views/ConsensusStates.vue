<template>
  <div class="container-md">
    <full-header />
    <b-card class="d-flex justify-content-start my-1">
      <b-breadcrumb :items="navs" />
    </b-card>

    <b-card>
      <b-input-group>
        <b-input-group-prepend>
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
              <span> {{ chain_name }}</span>
            </template>
          </v-select>
        </b-input-group-prepend>
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
        <b-card-body nobody>
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
    </b-card>
  </div>
</template>

<script>
import {
  BAvatar,
  BBreadcrumb, BCard, BCardBody, BInputGroup, BFormInput, BInputGroupAppend, BInputGroupPrepend, BButton,
} from 'bootstrap-vue'
import fetch from 'node-fetch'
import { consensusPubkeyToHexAddress, getLocalChains } from '@/libs/utils'
import vSelect from 'vue-select'
import FullHeader from './components/FullHeader.vue'

export default {
  components: {
    FullHeader,
    BBreadcrumb,
    BCard,
    BCardBody,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroupPrepend,
    BButton,
    BAvatar,
    vSelect,
  },

  data() {
    const chains = getLocalChains()
    const selected = 'cosmos'
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
      rpc: chains[selected].rpc[0],
      httpstatus: 200,
      httpStatusText: '',
      roundState: {},
      selected,
      chains,
      vals: [],
      positions: [],
    }
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
