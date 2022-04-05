<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Sender"
          label-for="Account"
        >
          <b-input-group class="mb-25">
            <b-form-input
              :value="address"
              readonly
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Available Token"
          label-for="Token"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Token"
          >
            <b-form-select
              v-model="token"
              @change="tokenChange"
            >
              <template #first>
                <b-form-select-option
                  value=""
                >
                  -- Please select a token --
                </b-form-select-option>
              </template>
              <b-form-select-option
                v-for="item in balance"
                :key="item.denom"
                :value="item.denom"
              >
                {{ format(item) }}
              </b-form-select-option>
            </b-form-select>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Amount"
          label-for="Amount"
        >
          <validation-provider
            v-slot="{ errors }"
            rules="required|regex:^([0-9\.]+)$"
            name="amount"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="Amount"
                v-model="amount"
                :state="errors.length > 0 ? false:null"
                placeholder="Input a number"
                type="number"
              />
              <b-input-group-append is-text>
                {{ printDenom() }}
              </b-input-group-append>
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          :label="`Destination: ${targetChainId}`"
          label-for="destination"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="destination"
          >
            <v-select
              v-model="destination"
              name="destination"
              :options="destinationOptions"
              placeholder="Select a channel"
              @input="onChannelChange()"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Recipient"
          label-for="Recipient"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="recipient"
          >
            <b-input-group class="mb-25">
              <b-form-input
                id="Recipient"
                v-model="recipient"
                :state="errors.length > 0 ? false:null"
                placeholder="Input a destination address"
              />
            </b-input-group>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BRow, BCol, BInputGroup, BInputGroupAppend, BFormInput, BFormGroup, BFormSelect, BFormSelectOption,

} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken, formatTokenDenom, getUnitAmount,
} from '@/libs/utils'
import vSelect from 'vue-select'
import { coin } from '@cosmjs/amino'
import dayjs from 'dayjs'
import { toHex } from '@cosmjs/encoding'
import { sha256 } from '@cosmjs/crypto'

export default {
  name: 'TransforDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    vSelect,

    ValidationProvider,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
    balance: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      targetChainId: '',
      token: '',
      amount: null,
      recipient: null,
      IBCDenom: {},
      paths: {},
      destination: {},
      channels: [],

      required,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
    }
  },
  computed: {
    destinationOptions() {
      if (!this.token && this.token === '') return []
      const options = this.channels.map(x => ({ port_id: x.port_id, channel_id: x.channel_id, label: `${x.chain_id ? x.chain_id : ''} ${x.port_id}/${x.channel_id}` }))
      if (this.token.startsWith('ibc/')) {
        const query = this.paths[this.token]
        return query ? options.filter(x => x.channel_id === query.channel_id) : options
      }
      return options
    },

    msg() {
      const timeout = dayjs().add(4, 'hour')
      return [
        {
          typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
          value: {
            sourcePort: this.destination.port_id,
            sourceChannel: this.destination.channel_id,
            token: coin(Number(getUnitAmount(this.amount, this.token)), this.token),
            sender: this.address,
            receiver: this.recipient,
            timeoutTimestamp: String(timeout.utc().valueOf() * 1000000),
          },
        },
      ]
    },
    balanceOptions() {
      return this.setupBalance()
    },
    selectedChain() {
      return this.$store.state.chains.selected
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'IBC Transfer Tokens',
      historyName: 'transfer',
    })
    this.setActionName()
    this.loadData()
  },
  methods: {
    loadData() {
      this.destination = null
      this.channels = []
      this.token = ''
      this.targetChainId = ''
      if (this.address) {
        this.$http.getAllIBCDenoms(this.selectedChain).then(x => {
          x.denom_traces.forEach(trace => {
            const hash = toHex(sha256(new TextEncoder().encode(`${trace.path}/${trace.base_denom}`)))
            const ibcDenom = `ibc/${hash.toUpperCase()}`
            // add base_denom to cache
            this.$set(this.IBCDenom, ibcDenom, trace.base_denom)
            // store channel/part for ibc denoms
            const path = trace.path.split('/')
            if (path.length >= 2) {
              this.paths[ibcDenom] = {
                channel_id: path[path.length - 1],
                port_id: path[path.length - 2],
              }
            }
          })
        })

        this.$http.getIBCChannels(this.selectedChain, null).then(ret => {
          const chans = ret.channels.filter(x => x.state === 'STATE_OPEN').map(x => ({ channel_id: x.channel_id, port_id: x.port_id }))
          this.$set(this, 'channels', chans)
        })
      }
    },
    setupBalance() {
      if (this.balance && this.balance.length > 0) {
        this.token = this.balance[0].denom
        return this.balance
      }
      return []
    },
    tokenChange() {
      // eslint-disable-next-line prefer-destructuring
      this.destination = this.destinationOptions[0]
      this.recipient = null
      this.setActionName()
      this.onChannelChange()
    },

    setActionName() {
      this.$emit('update', {
        actionName: this.token.startsWith('ibc') ? 'Withdraw' : 'Deposit',
      })
    },

    format(v) {
      return formatToken(v, this.IBCDenom)
    },
    printDenom() {
      return formatTokenDenom(this.IBCDenom[this.token] || this.token)
    },
    onChannelChange() {
      this.$http.getIBCChannelClientState(this.destination.channel_id, this.destination.port_id, this.selectedChain).then(cs => {
        this.targetChainId = cs.identified_client_state.client_state.chain_id
      })
    },
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
