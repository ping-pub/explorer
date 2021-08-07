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
                  size="sm"
                  variant="primary"
                >
                  Delegate
                </b-button>
                <b-button
                  size="sm"
                  variant="outline-danger"
                  class="ml-1"
                >
                  Redelegate
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
                  icon="DollarSignIcon"
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

            <div class="d-flex align-items-center">
              <b-avatar
                variant="light-warning"
                rounded
              >
                <feather-icon
                  icon="SmileIcon"
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
                {{ validator.description.identity || '-' }}
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
                {{ validator.status }}
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
        class="mt-1"
      >
        {{ validator.description.details || '' }}
      </b-card-footer>
    </b-card>
    <!-- First Row -->
    <template>
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
          <staking-reward-component :data="distribution" />
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
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card title="Uptime">
            <b-card-body class="border-top">
              <b-button
                v-for="(b,i) in blocks"
                :key="i"
                v-b-tooltip.hover.v-second
                :variant="b[0]?'primary':'outline-danger'"
                :title="b"
                rounded
                size="sm"
                class="btn-icon mb-25 mr-25"
              > &nbsp; </b-button>
            </b-card-body>
            <b-card-footer>
              <router-link :to="`../staking`">
                <b-button
                  variant="outline-primary"
                >
                  {{ $t('btn_back_list') }}
                </b-button>
              </router-link>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import {
  BCard, BButton, BAvatar, BRow, BCol, BCardBody, BCardFooter, VBTooltip,
} from 'bootstrap-vue'

import {
  percent, formatToken, StakingParameters, Validator, operatorAddressToAccount, consensusPubkeyToHexAddress, toDay,
} from '@/libs/data'
import { keybase } from '@/libs/fetch'
import StakingAddressComponent from './StakingAddressComponent.vue'
import StakingCommissionComponent from './StakingCommissionComponent.vue'
import StakingRewardComponent from './StakingRewardComponent.vue'

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    BCardBody,
    BCardFooter,
    StakingAddressComponent,
    StakingCommissionComponent,
    StakingRewardComponent,
  },
  directives: {
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
      stakingPool: {},
      mintInflation: 0,
      stakingParameter: new StakingParameters(),
      validator: new Validator(),
      userData: {},
      blocks: Array.from('0'.repeat(100)).map(x => [Boolean(x), Number(x)]),
      distribution: {},
    }
  },
  created() {
    this.$http.getStakingPool().then(res => { this.stakingPool = res })
    this.$http.getStakingParameters().then(res => { this.stakingParameter = res })
    this.$http.getMintingInflation().then(res => { this.mintInflation = res })
    const { address } = this.$route.params
    this.$http.getValidatorDistribution(address).then(res => { this.distribution = res })
    this.$http.getStakingValidator(address).then(data => {
      this.validator = data

      this.processAddress(data.operator_address, data.consensus_pubkey)

      const { identity } = data.description
      keybase(identity).then(d => {
        if (Array.isArray(d.them) && d.them.length > 0) {
          this.$set(this.validator, 'avatar', d.them[0].pictures.primary.url)
          this.$store.commit('cacheAvatar', { identity, url: d.them[0].pictures.primary.url })
        }
      })
    })
    this.initBlocks()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    timeFormat(value) {
      return toDay(value)
    },
    percentFormat(value) {
      return percent(value)
    },
    processAddress(operAddress, consensusPubkey) {
      this.accountAddress = operatorAddressToAccount(operAddress)
      this.hexAddress = consensusPubkeyToHexAddress(consensusPubkey)
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
    initBlocks() {
      this.$http.getLatestBlock().then(d => {
        const { height } = d.block.last_commit

        // update height
        const blocks = []
        for (let i = height - 99; i < height; i += 1) {
          blocks.push([false, i])
        }
        const sig = d.block.last_commit.signatures.find((s => s.validator_address === this.hexAddress))
        const exist = typeof sig !== 'undefined'
        blocks.push([exist, height])
        this.blocks = blocks

        // update uptime status
        const previous = []
        blocks.forEach(item => {
          previous.push(this.fetch_status(item))
        })
        Promise.allSettled(previous).then(() => {
          this.timer = setInterval(this.fetch_latest, 6000)
        })
      })
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
