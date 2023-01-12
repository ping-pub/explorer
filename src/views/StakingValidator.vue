<template>
  <div>
    <b-card class="border-primary">
      <b-row>
        <!-- User Info: Left col -->
        <b-col
          cols="21"
          xl="6"
          class="d-flex justify-content-between flex-column"
        >
          <!-- User Avatar & Action Buttons -->
          <div class="d-flex justify-content-start">
            <b-avatar
              :src="validator.avatar"
              :variant="`light-primary`"
              size="104px"
              rounded
            />
            <div class="d-flex flex-column ml-1">
              <div class="mb-1">
                <h4 class="mb-0">
                  {{ validator.description.moniker }}
                </h4>
                <span class="card-text">{{ validator.description.website }}</span>
              </div>
              <div class="d-flex flex-wrap">
                <b-button
                  v-b-modal.operation-modal
                  variant="primary"
                  class="mr-25 mb-25"
                >
                  Delegate
                </b-button>
              </div>
            </div>
          </div>

          <!-- User Stats -->
          <div class="d-flex flex-wrap align-items-center mt-2">
            <div class="d-flex align-items-center mr-2">
              <b-avatar
                variant="light-primary"
                rounded
              >
                <feather-icon
                  icon="DiscIcon"
                  size="18"
                />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ tokenFormatter(validator.tokens) }}
                </h5>
                <small>Bonded Tokens</small>
              </div>
            </div>

            <div class="d-flex align-items-center mr-2">
              <b-avatar
                variant="light-warning"
                rounded
              >
                <feather-icon
                  icon="DivideCircleIcon"
                  size="18"
                />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ percentFormat(selfDelegation.balance.amount/validator.tokens) }}%
                </h5>
                <small>Self Delegation</small>
              </div>
            </div>

            <div
              v-if="mintInflation"
              class="d-flex align-items-center"
            >
              <b-avatar
                variant="light-success"
                rounded
              >
                <feather-icon
                  icon="TrendingUpIcon"
                  size="18"
                />
              </b-avatar>
              <div class="ml-1">
                <h5 class="mb-0">
                  {{ apr(validator.commission.rate) }}
                </h5>
                <small>Annual Profit</small>
              </div>
            </div>
          </div>
        </b-col>

        <!-- Right Col: Table -->
        <b-col
          cols="12"
          xl="6"
        >
          <table class="mt-2 mt-xl-0 w-100">
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="UserIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Identity</span>
              </th>
              <td class="pb-50">
                <small>{{ validator.description.identity || '-' }}</small>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="CheckIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Status</span>
              </th>
              <td class="pb-50 text-capitalize">
                <span>{{ String(validator.status).replace('BOND_STATUS_', '') }}</span>
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="StarIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Unbond Height</span>
              </th>
              <td class="pb-50 text-capitalize">
                {{ validator.unbonding_height || '-' }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="StarIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Unbond Time</span>
              </th>
              <td class="pb-50 text-capitalize">
                {{ timeFormat(validator.unbonding_time) }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="FlagIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Min Self Delegation</span>
              </th>
              <td class="pb-50">
                {{ parseFloat(validator.min_self_delegation) }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon
                  icon="AlertCircleIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Jailed</span>
              </th>
              <td class="pb-50">
                {{ validator.jailed || '-' }}
              </td>
            </tr>
            <tr>
              <th>
                <feather-icon
                  icon="PhoneIcon"
                  class="mr-75"
                />
                <span class="font-weight-bold">Contact</span>
              </th>
              <td>
                {{ validator.security_contact || '-' }}
              </td>
            </tr>
          </table>
        </b-col>
      </b-row>

      <b-card-footer
        v-if="validator.description.details"
        class="mt-1 pl-0 pr-0"
      >
        {{ validator.description.details || '' }}
      </b-card-footer>
    </b-card>
    <!-- First Row -->
    <b-row class="match-height">
      <b-col
        lg="4"
        md="12"
      >
        <staking-commission-component :data="validator.commission" />
      </b-col>
      <b-col
        lg="4"
        md="12"
      >
        <staking-reward-component
          :data="distribution"
          :validator="validator.operator_address"
          :address="accountAddress"
        />
      </b-col>
      <b-col
        lg="4"
        md="12"
      >
        <staking-address-component
          :hex-address="hexAddress"
          :operator-address="validator.operator_address"
          :consensus-pubkey="validator.consensus_pubkey"
          :account-address="accountAddress"
          :valcons-address="valconsAddress"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card title="Transactions">
          <b-table
            :items="txs"
            striped
            hover
            responsive="sm"
            stacked="sm"
          >
            <template #cell(height)="data">
              <router-link :to="`../blocks/${data.item.height}`">
                {{ data.item.height }}
              </router-link>
            </template>
            <template #cell(txhash)="data">
              <router-link :to="`../tx/${data.item.txhash}`">
                {{ formatHash(data.item.txhash) }}
              </router-link>
            </template>
          </b-table>
          <b-pagination
            v-if="Number(transactions.page_total) > 1"
            :total-rows="transactions.total_count"
            :per-page="transactions.limit"
            :value="transactions.page_number"
            class="mt-1"
            @change="pageload"
          />
        </b-card>
      </b-col>
    </b-row>
    <operation-modal
      type="Delegate"
      :validator-address="validator.operator_address"
    />
    <div id="txevent" />
  </div>
</template>

<script>
import {
  BCard, BButton, BAvatar, BRow, BCol, BTable, BCardFooter, VBTooltip, VBModal, BBadge, BPagination,
} from 'bootstrap-vue'

import {
  percent, formatToken, StakingParameters, Validator, operatorAddressToAccount, consensusPubkeyToHexAddress, toDay, abbrMessage, abbrAddress, valoperToPrefix, pubKeyToValcons,
} from '@/libs/utils'
import { keybase } from '@/libs/fetch'
import OperationModal from '@/views/components/OperationModal/index.vue'
import StakingAddressComponent from './components/staking/StakingAddressComponent.vue'
import StakingCommissionComponent from './components/staking/StakingCommissionComponent.vue'
import StakingRewardComponent from './components/staking/StakingRewardComponent.vue'

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    BCardFooter,
    BBadge,
    BPagination,
    BTable,
    StakingAddressComponent,
    StakingCommissionComponent,
    StakingRewardComponent,
    OperationModal,
  },
  directives: {
    'b-modal': VBModal,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      commission: {
        series: [90],
        completed: 89,
        inProgress: 64,
      },
      selfDelegation: {
        balance: { amount: 0 },
      },
      latestHeight: 0,
      accountAddress: '-',
      hexAddress: '-',
      valconsAddress: '-',
      stakingPool: {},
      mintInflation: 0,
      stakingParameter: new StakingParameters(),
      validator: new Validator(),
      address: null,
      userData: {},
      blocks: Array.from('0'.repeat(100)).map(x => [Boolean(x), Number(x)]),
      distribution: {},
      transactions: {},
    }
  },
  computed: {
    txs() {
      if (this.transactions.txs) {
        return this.transactions.tx_responses.map(x => ({
          height: Number(x.height),
          txhash: x.txhash,
          msgs: abbrMessage(x.tx.body.messages),
          time: toDay(x.timestamp),
        }))
      }
      return []
    },
  },
  created() {
    this.$http.getStakingPool().then(res => { this.stakingPool = res })
    this.$http.getStakingParameters().then(res => { this.stakingParameter = res })
    this.$http.getMintingInflation().then(res => { this.mintInflation = res })
    this.address = this.$route.params.address
    this.initial()
  },
  mounted() {
    const elem = document.getElementById('txevent')
    elem.addEventListener('txcompleted', () => {
      this.initial()
    })
  },
  methods: {
    initial() {
      this.$http.getStakingValidator(this.address).then(data => {
        this.validator = data

        this.processAddress(data.operator_address, data.consensus_pubkey)
        this.$http.getTxsBySender(this.accountAddress).then(res => {
          this.transactions = res
        })

        const { identity } = data.description
        keybase(identity).then(d => {
          if (Array.isArray(d.them) && d.them.length > 0) {
            this.$set(this.validator, 'avatar', d.them[0].pictures.primary.url)
            this.$store.commit('cacheAvatar', { identity, url: d.them[0].pictures.primary.url })
          }
        })
      })
      this.$http.getValidatorDistribution(this.address).then(res => { this.distribution = res })
    },
    pageload(v) {
      this.$http.getTxsBySender(this.accountAddress, v).then(res => {
        this.transactions = res
      })
    },
    formatHash: abbrAddress,
    timeFormat(value) {
      return toDay(value)
    },
    percentFormat(value) {
      return percent(value)
    },
    processAddress(operAddress, consensusPubkey) {
      const prefix = valoperToPrefix(operAddress)
      this.accountAddress = operatorAddressToAccount(operAddress)
      this.hexAddress = consensusPubkeyToHexAddress(consensusPubkey)
      this.valconsAddress = pubKeyToValcons(consensusPubkey, prefix)
      this.$http.getStakingDelegatorDelegation(this.accountAddress, operAddress).then(d => {
        this.selfDelegation = d
      })
    },
    tokenFormatter(token) {
      return formatToken({ amount: token, denom: this.stakingParameter.bond_denom })
    },
    apr(rate) {
      return `${percent((1 - rate) * this.mintInflation)} %`
    },
    fetch_status(item, lastHeight) {
      return this.$http.getBlockByHeight(item[1]).then(res => {
        if (item[1] !== lastHeight) {
          const sigs = res.block.last_commit.signatures.find(s => s.validator_address === this.hexAddress)
          const block = this.blocks.find(b => b[1] === item[1])
          if (typeof block !== 'undefined') {
            this.$set(block, 0, typeof sigs !== 'undefined')
          }
        }
      })
    },
    fetch_latest() {
      this.$http.getLatestBlock().then(res => {
        const sigs = res.block.last_commit.signatures.find(s => s.validator_address === this.hexAddress)
        const block = this.blocks.find(b => b[1] === res.block.last_commit.height)
        if (typeof block === 'undefined') { // mei
          // this.$set(block, 0, typeof sigs !== 'undefined')
          if (this.blocks.length > 999) this.blocks.shift()
          this.blocks.push([typeof sigs !== 'undefined', res.block.last_commit.height])
        }
      })
    },
  },
}
</script>

<style></style>
