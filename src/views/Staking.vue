<template>
  <div>
    <b-card
      v-if="pingVals && pingVals.length > 0"
      title="❤️ Support SkyNet | Explorers By Staking With Us ❤️"
    >
      <b-table
        :items="pingVals"
        :fields="validator_fields"
        :sort-desc="true"
        sort-by="tokens"
        striped
        hover
        responsive="sm"
      >
        <!-- A virtual column -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <!-- Column: Validator -->
        <template #cell(description)="data">
          <b-media
            vertical-align="center"
            class="text-truncate"
            style="max-width:320px;"
          >
            <template #aside>
              <b-avatar
                v-if="data.item.avatar"
                v-b-tooltip.hover.v-primary
                v-b-tooltip.hover.right="data.item.description.details"
                size="32"
                variant="light-primary"
                :src="data.item.avatar"
              />
              <b-avatar
                v-if="!data.item.avatar"
                v-b-tooltip.hover.v-primary
                v-b-tooltip.hover.right="data.item.description.details"
              >
                <feather-icon icon="ServerIcon" />
              </b-avatar>
            </template>
            <span class="font-weight-bolder d-block text-nowrap">
              <router-link
                :to="`./staking/${data.item.operator_address}`"
              >
                {{ data.item.description.moniker }}
              </router-link>
            </span>
            <small
              class="text-muted"
            >{{ data.item.description.website || data.item.description.identity }}</small>
          </b-media>
        </template>
        <!-- Token -->
        <template #cell(tokens)="data">
          <div
            v-if="data.item.tokens > 0"
            class="d-flex flex-column"
          >
            <span class="font-weight-bold mb-0">{{ tokenFormatter(data.item.tokens, stakingParameters.bond_denom) }}</span>
            <span class="font-small-2 text-muted text-nowrap d-none d-lg-block">{{ percent(data.item.tokens/stakingPool) }}%</span>
          </div>
          <span v-else>{{ data.item.delegator_shares }}</span>
        </template>
        <!-- Token -->
        <template #cell(changes)="data">
          <small
            v-if="data.item.changes>0"
            class="text-success"
          >+{{ data.item.changes }}</small>
          <small v-else-if="data.item.changes===0">-</small>
          <small
            v-else
            class="text-danger"
          >{{ data.item.changes }}</small>
        </template>
        <template #cell(operation)="data">
          <b-button
            v-b-modal.delegate-window
            :name="data.item.operator_address"
            variant="primary"
            size="sm"
            @click="selectValidator(data.item.operator_address)"
          >
            Delegate
          </b-button>
        </template>
      </b-table>
    </b-card>
    <b-card
      no-body
    >
      <b-card-header class="d-flex justify-content-between">
        <b-form-group class="mb-0">
          <b-form-radio-group
            id="btn-radios-1"
            v-model="selectedStatus"
            button-variant="outline-primary"
            :options="statusOptions"
            buttons
            name="radios-btn-default"
            @change="getValidatorListByStatus"
          />
        </b-form-group>
        <b-card-title class="d-none d-sm-block">
          <span>Validators {{ validators.length }}/{{ stakingParameters.max_validators }} </span>
        </b-card-title>
      </b-card-header>
      <b-card-body class="pl-0 pr-0 pb-0">
        <b-table
          class="mb-0"
          :items="list"
          :fields="validator_fields"
          :sort-desc="true"
          sort-by="tokens"
          striped
          hover
          responsive="sm"
        >
          <!-- A virtual column -->
          <template #cell(index)="data">
            <b-badge :variant="rankBadge(data)">
              {{ data.index + 1 }}
            </b-badge>
          </template>
          <!-- Column: Validator -->
          <template #cell(description)="data">
            <b-media
              vertical-align="center"
              class="text-truncate"
              style="max-width:320px;"
            >
              <template #aside>
                <b-avatar
                  v-if="data.item.avatar"
                  v-b-tooltip.hover.v-primary
                  v-b-tooltip.hover.right="data.item.description.details"
                  size="32"
                  variant="light-primary"
                  :src="data.item.avatar"
                />
                <b-avatar
                  v-if="!data.item.avatar"
                  v-b-tooltip.hover.v-primary
                  v-b-tooltip.hover.right="data.item.description.details"
                >
                  <feather-icon icon="ServerIcon" />
                </b-avatar>
              </template>
              <span class="font-weight-bolder d-block text-nowrap">
                <router-link
                  :to="`./staking/${data.item.operator_address}`"
                >
                  {{ data.item.description.moniker }}
                </router-link>
              </span>
              <small
                class="text-muted"
              >{{ data.item.description.website || data.item.description.identity }}</small>
            </b-media>
          </template>
          <!-- Token -->
          <template #cell(tokens)="data">
            <div
              v-if="data.item.tokens > 0"
              class="d-flex flex-column"
            >
              <span class="font-weight-bold mb-0">{{ tokenFormatter(data.item.tokens, stakingParameters.bond_denom) }}</span>
              <span class="font-small-2 text-muted text-nowrap d-none d-lg-block">{{ percent(data.item.tokens/stakingPool) }}%</span>
            </div>
            <span v-else>{{ data.item.delegator_shares }}</span>
          </template>
          <!-- Token -->
          <template #cell(changes)="data">
            <small
              v-if="data.item.changes>0"
              class="text-success"
            >+{{ data.item.changes }}</small>
            <small v-else-if="data.item.changes===0">-</small>
            <small
              v-else
              class="text-danger"
            >{{ data.item.changes }}</small>
          </template>
          <template #cell(operation)="data">
            <b-button
              v-b-modal.delegate-window
              :name="data.item.operator_address"
              variant="primary"
              size="sm"
              @click="selectValidator(data.item.operator_address)"
            >
              Delegate
            </b-button>
          </template>
        </b-table>
      </b-card-body>
      <template #footer>
        <small class="d-none d-md-block">
          <b-badge variant="danger">
              &nbsp;
          </b-badge>
          Top 33%
          <b-badge variant="warning">
              &nbsp;
          </b-badge>
          Top 67% of Voting Power
        </small>
      </template>
    </b-card>
    <operation-delegate-component :validator-address="validator_address" />
  </div>
</template>

<script>
import {
  BTable, BMedia, BAvatar, BBadge, BCard, BCardHeader, BCardTitle, VBTooltip, BCardBody, BButton, BFormRadioGroup, BFormGroup,
} from 'bootstrap-vue'
import {
  percent, StakingParameters, formatToken,
} from '@/libs/utils'
import { keybase } from '@/libs/fetch'
// import { toHex } from '@cosmjs/encoding'
// import fetch from 'node-fetch'
import OperationDelegateComponent from './OperationDelegateComponent.vue'

export default {
  components: {
    BCard,
    BTable,
    BMedia,
    BAvatar,
    BBadge,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    OperationDelegateComponent,
    BFormRadioGroup,
    BFormGroup,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      keys: [
        'akashvaloper1zfcmwh56kmz4wqqg2t8pxrm228dx2c6hzh0ewm',
        'cerberusvaloper1r34mlqewsxrde38vp3tzwh3rk5vt6ez0slzuvu',
        'chihuahuavaloper1y6m72uxs6hhsudxqpq73rsdgkjh6nhkqef8pej',
        'cosmos1zfcmwh56kmz4wqqg2t8pxrm228dx2c6h9wvc8t',
        'desmosvaloper17ue85ck027c4grv7nuks7k7p4fqnlc55uqhskj',
        'dewebvaloper1v4f0kjaj0ywz9j3fnt97ffj9af7lygnjnc9srx',
        'evmosvaloper1uvespdsgqjr3s09v747224zre33vs8kl82h497',
        'gravityvaloper1zfcmwh56kmz4wqqg2t8pxrm228dx2c6hs487gh',
        'junovaloper1me5ts52qg98s76nketn5gckj9p6nu9zc79a68u',
        'omniflixvaloper1nrqnmd2g5s4e974n9fxn8t6e83lh6yxqgzlv4r',
        'osmovaloper1zfcmwh56kmz4wqqg2t8pxrm228dx2c6hhzhtx7',
        'tgrade1ylrt7dqjz0vmr3h2e53q3h74jrjxfwf4ehk635',
        'umeevaloper1p4hx7khq8udesprg69xj6snmgafxppglpl5kr8',
      ],
      islive: true,
      validator_address: null,
      mintInflation: 0,
      stakingPool: 1,
      stakingParameters: new StakingParameters(),
      validators: [],
      delegations: [],
      changes: {},
      validator_fields: [
        {
          key: 'index',
          label: '#',
          tdClass: 'd-none d-md-block',
          thClass: 'd-none d-md-block',
        },
        { key: 'description', label: 'Validator' },
        {
          key: 'tokens',
          label: 'Voting Power',
          sortable: true,
          tdClass: 'text-right',
          thClass: 'text-right',
          sortByFormatted: true,
        },
        {
          key: 'changes',
          label: '24H Changes',
        },
        {
          key: 'commission',
          formatter: value => `${percent(value.rate)}%`,
          tdClass: 'text-right',
          thClass: 'text-right',
        },
        {
          key: 'operation',
          label: '',
          tdClass: 'text-right',
          thClass: 'text-right',
        },
      ],
      statusOptions: [
        { text: 'Active', value: ['BOND_STATUS_BONDED'] },
        { text: 'Inactive', value: ['BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING'] },
      ],
      selectedStatus: ['BOND_STATUS_BONDED'],
    }
  },
  computed: {
    pingVals() {
      return this.list.filter(x => this.keys.includes(x.operator_address))
    },
    list() {
      return this.validators.map(x => {
        const xh = x
        const change = this.changes[x.consensus_pubkey.value]
        if (change) {
          xh.changes = change.latest - change.previous
        }
        return xh
      })
    },
  },
  created() {
    this.$http.getValidatorListByHeight('latest').then(data => {
      let height = Number(data.block_height)
      if (height > 14400) {
        height -= 14400
      } else {
        height = 1
      }
      const changes = []
      data.validators.forEach(x => {
        changes[x.pub_key.value] = { latest: Number(x.voting_power), previous: 0 }
      })
      this.$http.getValidatorListByHeight(height).then(previous => {
        previous.validators.forEach(x => {
          if (changes[x.pub_key.value]) {
            changes[x.pub_key.value].previous = Number(x.voting_power)
          } else {
            changes[x.pub_key.value] = { latest: 0, previous: Number(x.voting_power) }
          }
        })
        this.$set(this, 'changes', changes)
      })
    })
    this.$http.getStakingParameters().then(res => {
      this.stakingParameters = res
    })
    this.getValidatorListByStatus(this.selectedStatus)
  },
  beforeDestroy() {
    this.islive = false
  },
  methods: {
    getValidatorListByStatus(statusList) {
      this.validators = []
      statusList.forEach(status => {
        this.$http.getValidatorListByStatus(status).then(res => {
          const identities = []
          const temp = res
          let total = 0
          for (let i = 0; i < temp.length; i += 1) {
            total += temp[i].tokens
            const { identity } = temp[i].description
            const url = this.$store.getters['chains/getAvatarById'](identity)
            if (url) {
              temp[i].avatar = url
            } else if (identity && identity !== '') {
              identities.push(identity)
            }
          }
          this.stakingPool = total
          this.validators.push(...temp)

          // fetch avatar from keybase
          let promise = Promise.resolve()
          identities.forEach(item => {
            promise = promise.then(() => new Promise(resolve => {
              this.avatar(item, resolve)
            }))
          })
        })
      })
    },
    selectValidator(da) {
      this.validator_address = da
    },
    percent,
    tokenFormatter(amount, denom) {
      return formatToken({ amount, denom }, {}, 0)
    },
    rankBadge(data) {
      const { index, item } = data
      if (index === 0) {
        window.sum = item.tokens
      } else {
        window.sum += item.tokens
      }
      const rank = window.sum / this.stakingPool
      if (rank < 0.333) {
        return 'danger'
      }
      if (rank < 0.67) {
        return 'warning'
      }
      return 'primary'
    },
    avatar(identity, resolve) {
      if (this.islive) {
        keybase(identity).then(d => {
          resolve()
          if (Array.isArray(d.them) && d.them.length > 0) {
            const pic = d.them[0].pictures
            if (pic) {
              const validator = this.validators.find(u => u.description.identity === identity)
              this.$set(validator, 'avatar', pic.primary.url)
              this.$store.commit('cacheAvatar', { identity, url: pic.primary.url })
            }
          }
        })
      }
    },
  },
}
</script>
