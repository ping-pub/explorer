<template>
  <div>
    <b-card
      v-if="pingVals && pingVals.length > 0"
      title=""
      class="overflow-auto"
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
        <!-- Verified Point Validators -->
        <template #cell(point_validators)>
          <b-media
            vertical-align="center"
            class="text-truncate"
            style="max-width:320px;"
          >
            <div v-if="data.item.operator_address === 'pointvaloper1v2a2jpuzeq9xss2sk3kummfllrcaemf5wuaq7e'">
              <img v-bind:src="'/logos/point-logo.png'" alt="Point" width="40em" hight=auto />
            </div>
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
            v-b-modal.operation-modal
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
      class="overflow-auto"
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
          <!-- Verified Point Validators -->
        <template #cell(point_validators)="data">
          <b-media
            vertical-align="center"
            class="text-truncate"
            style="max-width:320px;"
          >
            <div v-if="data.item.operator_address === 'pointvaloper1v2a2jpuzeq9xss2sk3kummfllrcaemf5wuaq7e'">
              <img v-bind:src="'/logos/point-logo.png'" alt="Point" width="40em" hight=auto />
            </div>
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
              v-b-modal.operation-modal
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
      <b-card-footer class="d-none d-md-block">
        <small>
          <b-badge variant="danger">
              &nbsp;
          </b-badge>
          Top 33%
          <b-badge variant="warning">
              &nbsp;
          </b-badge>
          Top 67% of Voting Power
        </small>
      </b-card-footer>
    </b-card>
    <operation-modal
      type="Delegate"
      :validator-address="validator_address"
    />
    <div id="txevent" />
  </div>
</template>

<script>
import {
  BTable, BMedia, BAvatar, BBadge, BCard, BCardHeader, BCardTitle, VBTooltip, BCardBody, BButton, BFormRadioGroup, BFormGroup,
  BCardFooter,
} from 'bootstrap-vue'
import {
  percent, StakingParameters, formatToken,
} from '@/libs/utils'
import { keybase } from '@/libs/fetch'
import OperationModal from '@/views/components/OperationModal/index.vue'
// import { toHex } from '@cosmjs/encoding'
// import fetch from 'node-fetch'

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
    BFormRadioGroup,
    BFormGroup,
    BCardFooter,
    OperationModal,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      islive: true,
      validator_address: null,
      mintInflation: 0,
      stakingPool: 1,
      stakingParameters: new StakingParameters(),
      validators: [],
      delegations: [],
      changes: {},
      latestPower: {},
      previousPower: {},
      validator_fields: [
        {
          key: 'index',
          label: '#',
          tdClass: 'd-none d-md-block',
          thClass: 'd-none d-md-block',
        },
        {
          key: 'description',
          label: 'Validator',
        },
        {
          key: 'point_validators',
          label: 'Foundation',
          sortable: false,
          tdClass: 'text-center',
          thClass: 'text-center',
          sortByFormatted: true,
        },
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
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      selectedStatus: 'active',
      isInactiveLoaded: false,
      inactiveValidators: [],
    }
  },
  computed: {
    pingVals() {
      return this.list.filter(x => x.description.identity === '94EFE192B2C52424')
    },
    list() {
      const tab = this.selectedStatus === 'active' ? this.validators : this.inactiveValidators
      return tab.map(x => {
        const xh = x
        if (Object.keys(this.latestPower).length > 0 && Object.keys(this.previousPower).length > 0) {
          const latest = this.latestPower[x.consensus_pubkey.key] || 0
          const previous = this.previousPower[x.consensus_pubkey.key] || 0
          xh.changes = latest - previous
        }
        return xh
      })
    },
  },
  created() {
    this.$http.getStakingPool().then(pool => {
      this.stakingPool = pool.bondedToken
    })
    // set
    this.$http.getStakingParameters().then(res => {
      this.stakingParameters = res
    })
    this.initial()
  },
  beforeDestroy() {
    this.islive = false
  },
  mounted() {
    const elem = document.getElementById('txevent')
    elem.addEventListener('txcompleted', () => {
      this.initial()
    })
  },
  methods: {
    initial() {
      this.$http.getValidatorList().then(res => {
        const identities = []
        const temp = res
        for (let i = 0; i < temp.length; i += 1) {
          const { identity } = temp[i].description
          const url = this.$store.getters['chains/getAvatarById'](identity)
          if (url) {
            temp[i].avatar = url
          } else if (identity && identity !== '') {
            identities.push(identity)
          }
        }

        // fetch avatar from keybase
        let promise = Promise.resolve()
        identities.forEach(item => {
          promise = promise.then(() => new Promise(resolve => {
            this.avatar(item, resolve)
          }))
        })
        this.validators = temp
        this.getPreviousPower(this.validators.length)
      })
    },
    getPreviousPower(length) {
      this.$http.getValidatorListByHeight('latest', 0).then(data => {
        let height = Number(data.block_height)
        if (height > 14400) {
          height -= 14400
        } else {
          height = 1
        }
        data.validators.forEach(x => {
          this.$set(this.latestPower, x.pub_key.key, Number(x.voting_power))
        })
        for (let offset = 100; offset < length; offset += 100) {
          this.$http.getValidatorListByHeight('latest', offset).then(latest => {
            latest.validators.forEach(x => {
              this.$set(this.latestPower, x.pub_key.key, Number(x.voting_power))
            })
          })
        }
        for (let offset = 0; offset < length; offset += 100) {
          this.$http.getValidatorListByHeight(height, offset).then(previous => {
            previous.validators.forEach(x => {
              this.$set(this.previousPower, x.pub_key.key, Number(x.voting_power))
            })
          })
        }
      })
    },
    getValidatorListByStatus() {
      if (this.isInactiveLoaded) return
      const statusList = ['BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING']
      statusList.forEach(status => {
        this.$http.getValidatorListByStatus(status).then(res => {
          const identities = []
          const temp = res
          for (let i = 0; i < temp.length; i += 1) {
            const { identity } = temp[i].description
            const url = this.$store.getters['chains/getAvatarById'](identity)
            if (url) {
              temp[i].avatar = url
            } else if (identity && identity !== '') {
              identities.push(identity)
            }
          }

          // fetch avatar from keybase
          let promise = Promise.resolve()
          identities.forEach(item => {
            promise = promise.then(() => new Promise(resolve => {
              this.avatar(item, resolve)
            }))
          })
          this.inactiveValidators = this.inactiveValidators.concat(res)
        })
      })
      this.isInactiveLoaded = true
    },
    selectValidator(da) {
      this.validator_address = da
    },
    percent,
    tokenFormatter(amount, denom) {
      return formatToken({ amount, denom }, {}, 0)
    },
    rankBadge(data) {
      if (this.selectedStatus === 'inactive') return 'primary'
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
              const list = this.selectedStatus === 'active' ? this.validators : this.inactiveValidators
              const validator = list.find(u => u.description.identity === identity)
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
