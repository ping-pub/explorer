<template>
  <div class="text-center">
    <b-card
      v-if="calculateTotal > 0"
      border-variant="primary"
    >
      <b-row class="mx-0 d-flex align-items-center">
        <b-col
          md="4"
        >
          <b-dropdown
            :text="`Currency: ${currency2.toUpperCase()}`"
            size="sm"
            class="text-uppercase"
            variant="primary"
          >
            <b-dropdown-item @click="setCurrency('usd')">
              USD
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('cny')">
              CNY (人民币)
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('eur')">
              EUR (Euro)
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('jpy')">
              JPY (日本円)
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('hkd')">
              HKD (港幣)
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('sgd')">
              SGD
            </b-dropdown-item>
            <b-dropdown-item @click="setCurrency('krw')">
              KRW (대한민국원)
            </b-dropdown-item>
          </b-dropdown>
          <h2 class="my-1">
            {{ currency }}{{ calculateTotal }}
          </h2>
          <!-- chart -->
          <chart-component-doughnut
            :height="235"
            :width="235"
            :data="calculateChartDoughnut"
            class="mb-3"
          />
        </b-col>
        <b-col
          md="8"
          class="d-none d-md-block"
        >
          <chartjs-component-bar
            :height="135.0"
            :chart-data="calculateChartBar"
            :options="options"
            class="align-self-stretch"
          />
        </b-col>
      </b-row>
    </b-card>

    <b-tabs
      v-for="item,index in accounts"
      :key="index"
      pills
      active-nav-item-class="font-weight-bolder"
    >
      <b-tab>
        <template #title>
          <feather-icon icon="UserIcon" />
          <span>{{ item.name }}</span>
        </template>

        <b-row>
          <b-col
            v-for="acc, j in item.address"
            :key="j"
            sm="12"
            md="6"
            xl="4"
            :class="(balances[acc.addr])? 'order-1' : 'order-9' "
          >

            <b-card
              no-body
              class="card-browser-states"
            >
              <b-card-header>
                <div>
                  <b-card-title> <span class="text-uppercase">{{ acc.chain }}</span></b-card-title>
                </div>
                <b-dropdown
                  class="ml-1"
                  variant="link"
                  no-caret
                  toggle-class="p-0"
                  right
                >
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      size="18"
                      class="cursor-pointer"
                    />
                  </template>
                  <b-dropdown-item
                    v-if="balances[acc.addr]"
                    v-b-modal.transfer-window
                    @click="transfer(acc.addr)"
                  >
                    <feather-icon icon="SendIcon" /> Transfer
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="balances[acc.addr]"
                    v-b-modal.ibc-transfer-window
                    @click="transfer(acc.addr)"
                  >
                    <feather-icon icon="SendIcon" /> IBC Transfer
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="balances[acc.addr]"
                    :to="`/${acc.chain}/account/${acc.addr}`"
                  >
                    <feather-icon icon="TrelloIcon" /> Detail
                  </b-dropdown-item>
                  <b-dropdown-item @click="removeAddress(acc.addr)">
                    <feather-icon icon="Trash2Icon" /> Remove
                  </b-dropdown-item>
                </b-dropdown>

              </b-card-header>
              <b-card-body class="text-truncate">
                <b-row>
                  <b-col>
                    <div class="d-flex justify-content-between">
                      <b-avatar
                        :src="acc.logo"
                        size="28"
                        variant="light-primary"
                        rounded
                      />
                      <h3>{{ currency }}{{ formatBalance(acc.addr) }}</h3>
                    </div>
                    <app-collapse hover>
                      <app-collapse-item title="1">
                        <template #header>
                          <small class="text-muted">{{ formatAddr(acc.addr) }}</small>
                        </template>
                        <div
                          v-for="b,i in balances[acc.addr]"
                          :key="i"
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="ml-25 font-weight-bolder text-uppercase">
                            <b-avatar
                              variant="light-success"
                              rounded
                              title="Balance"
                            >
                              <feather-icon
                                icon="CreditCardIcon"
                                size="16"
                                class="text-success"
                              />
                            </b-avatar>
                            {{ formatDenom(b.denom) }}
                          </div>
                          <div class="d-flex flex-column text-right">
                            <span class="font-weight-bold mb-0">{{ formatAmount(b.amount) }}</span>
                            <span class="font-small-2 text-muted text-nowrap">{{ currency }}{{ formatCurrency(b.amount, b.denom) }}</span>
                          </div>
                        </div>
                        <div
                          v-for="b,i in delegations[acc.addr]"
                          :key="`d-${i}`"
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="ml-25 font-weight-bolder text-uppercase">
                            <b-avatar
                              variant="light-primary"
                              rounded
                              title="Delegations"
                            >
                              <feather-icon
                                icon="LockIcon"
                                size="16"
                                class="text-primary"
                              />
                            </b-avatar>
                            {{ formatDenom(b.denom) }}
                          </div>
                          <div class="d-flex flex-column text-right">
                            <span class="font-weight-bold mb-0">{{ formatAmount(b.amount) }}</span>
                            <span class="font-small-2 text-muted text-nowrap">{{ currency }}{{ formatCurrency(b.amount, b.denom) }}</span>
                          </div>
                        </div>
                      </app-collapse-item>
                    </app-collapse>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>

    <router-link to="./import">
      <b-card class="addzone">
        <feather-icon icon="PlusIcon" />
        Connect Wallet
      </b-card>
    </router-link>
    <operation-transfer-component
      :address.sync="selectedAddress"
    />
    <operation-transfer-2-component :address="selectedAddress" />
  </div>
</template>

<script>
import { $themeColors } from '@themeConfig'
import {
  BCard, BCardHeader, BCardTitle, BCardBody, VBModal, BRow, BCol, BTabs, BTab, BAvatar, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import {
  chartColors,
  formatTokenAmount, formatTokenDenom, getLocalAccounts, getLocalChains, getUserCurrency, getUserCurrencySign, setUserCurrency,
} from '@/libs/data'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import OperationTransferComponent from './OperationTransferComponent.vue'
import OperationTransfer2Component from './OperationTransfer2Component.vue'
import ChartComponentDoughnut from './ChartComponentDoughnut.vue'
import ChartjsComponentBar from './ChartjsComponentBar.vue'

export default {
  components: {
    BAvatar,
    BCard,
    BRow,
    BCol,
    BTabs,
    BTab,
    BCardHeader,
    BCardBody,
    BCardTitle,
    BDropdown,
    BDropdownItem,
    FeatherIcon,
    OperationTransferComponent,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    OperationTransfer2Component,
    ChartComponentDoughnut,
    ChartjsComponentBar,
    AppCollapse,
    AppCollapseItem,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      currency: getUserCurrencySign(),
      currency2: getUserCurrency(),
      selectedAddress: '',
      selectedName: '',
      transferWindow: false,
      accounts: [],
      balances: {},
      delegations: {},
      ibcDenom: {},
      quotes: {},
      options: {
        legend: {
          display: false,
        },
        // responsive: true,
        title: {
          display: true,
          text: 'Token Portfolio',
        },
        tooltips: {
          mode: 'index',
          intersect: true,
        },
        scales: {
          yAxes: [{
            // type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            type: 'logarithmic',
            display: true,
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback(val, index) {
                // Hide the label of every 2nd dataset
                return index % 5 === 0 ? `${val}` : ''
              },
              color: 'red',
            },
            offset: true,
            gridLines: {
              display: false,
              offsetGridLines: false,
            },
          }, {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
              drawOnChartArea: true,
            },
          }],
        },
      },
    }
  },
  computed: {
    calculateTotal() {
      const v = Object.values(this.balances)
      let total = 0
      if (v) {
        v.forEach(tokens => {
          const subtotal = tokens.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c)
          total += subtotal
        })
      }
      const d = Object.values(this.delegations)
      if (d) {
        d.forEach(tokens => {
          const subtotal = tokens.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c, 0)
          total += subtotal
        })
      }
      return parseFloat(total.toFixed(2))
    },
    calculateByDenom() {
      const v = Object.values(this.balances)
      const total = {}
      if (v) {
        v.forEach(tokens => {
          const subtotal = tokens.map(x => ({ denom: x.denom, sub: this.formatCurrency(x.amount, x.denom) }))
          subtotal.forEach(x => {
            const denom = this.formatDenom(x.denom)
            if (total[denom]) {
              total[denom] += x.sub
            } else {
              total[denom] = x.sub
            }
          })
        })
      }
      const d = Object.values(this.delegations)
      if (d) {
        d.forEach(tokens => {
          const subtotal = tokens.map(x => ({ denom: x.denom, sub: this.formatCurrency(x.amount, x.denom) }))
          subtotal.forEach(x => {
            const denom = this.formatDenom(x.denom)
            if (total[denom]) {
              total[denom] += x.sub
            } else {
              total[denom] = x.sub
            }
          })
        })
      }
      return total
    },
    calculateChartDoughnut() {
      const total = this.calculateByDenom
      return {
        datasets: [
          {
            labels: Object.keys(total),
            data: Object.values(total),
            backgroundColor: chartColors(),
            borderWidth: 0,
            pointStyle: 'rectRounded',
          },
        ],
      }
    },
    calculateChartBar() {
      const prices = this.calculateByDenom
      // const changes = Object.entries(prices).map(v => {
      //   console.log('entries:', v[0], v[1])
      //   const quote = this.$store.state.chains.quotes[`${v[0]}`]
      //   return quote ? (v[1] * quote[`${this.currency2}_24h_change`]) / 100 : 0
      // })
      return {
        labels: Object.keys(prices),
        datasets: [
          {
            label: 'Holdings',
            data: Object.values(prices),
            backgroundColor: $themeColors.success,
            borderWidth: 0,
            pointStyle: 'rectRounded',
            yAxisID: 'y-axis-1',
          },
          // {
          //   label: '24H Change',
          //   data: Object.values(changes),
          //   backgroundColor: $themeColors.warning,
          //   borderWidth: 0,
          //   pointStyle: 'rectRounded',
          //   // yAxisID: 'y-axis-2',
          // },
        ],
      }
    },
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (this.accounts) {
        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            this.$http.getBankBalances(add.addr, chains[add.chain]).then(res => {
              if (res && res.length > 0) {
                this.$set(this.balances, add.addr, res)
                res.forEach(token => {
                  if (token.denom.startsWith('ibc')) {
                    this.$http.getIBCDenomTrace(token.denom, chains[add.chain]).then(denom => {
                      this.$set(this.ibcDenom, token.denom, denom)
                    })
                  }
                })
              }
            })
            this.$http.getStakingDelegations(add.addr, chains[add.chain]).then(res => {
              if (res.delegation_responses) {
                const delegation = res.delegation_responses.map(x => x.balance)
                this.$set(this.delegations, add.addr, delegation)
              }
            }).catch(() => {})
          })
        })
      }
    },
    setCurrency(c) {
      setUserCurrency(c)
      this.currency2 = c
      this.currency = getUserCurrencySign()
    },
    transfer(addr) {
      this.selectedAddress = addr
    },
    completeAdd() {
      this.init()
      this.$bvModal.hide('add-account')
    },
    formatDenom(v) {
      const denom = (v.startsWith('ibc') ? this.ibcDenom[v] : v)
      return formatTokenDenom(denom)
    },
    formatAmount(v) {
      return formatTokenAmount(v)
    },
    formatAddr(v) {
      return v.substring(0, 10).concat('...', v.substring(v.length - 10))
    },
    formatCurrency(amount, denom) {
      const qty = this.formatAmount(amount)
      const d2 = this.formatDenom(denom)
      const quote = this.$store.state.chains.quotes[d2]
      if (quote) {
        const price = quote[this.currency2]
        return parseFloat((qty * price).toFixed(2))
      }
      return 0
    },
    formatBalance(v) {
      let total = 0
      const balance = this.balances[v]
      if (balance) {
        const ret = balance.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c)
        total += ret
      }
      const delegations = this.delegations[v]
      if (delegations) {
        const ret = delegations.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c, 0)
        total += ret
      }
      return parseFloat(total.toFixed(2))
    },
    removeAddress(v) {
      Object.keys(this.accounts).forEach(key => {
        const item = this.accounts[key]
        const newAddrs = item.address.filter(a => a.addr !== v)
        if (newAddrs.length > 0) {
          this.$set(item, 'address', newAddrs)
        } else {
          delete this.accounts[key]
        }
      })
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
    copy(v) {
      this.$copyText(v).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Address copied',
            icon: 'BellIcon',
          },
        })
      }, e => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: `Failed to copy address! ${e}`,
            icon: 'BellIcon',
            variant: 'danger',
          },
        })
      })
    },
  },
}
</script>

<style lang="css">
.addzone {
    border: 2px dashed #ced4da;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: none;
}
.addzone :hover {
    border: 2px dashed #7367F0;
}

</style>
