<template>
  <div class="text-center">

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
                      <h3>${{ formatBalance(balances[acc.addr]) }}</h3>
                    </div>
                    <small
                      class="pl-1 float-right text-muted text-overflow "
                      @click="copy(acc.addr)"
                    >
                      {{ formatAddr(acc.addr) }}
                    </small>
                  </b-col>
                </b-row>
                <b-row v-if="balances[acc.addr]">
                  <b-col>
                    <b-tabs
                      active-nav-item-class="font-weight-bold text-second"
                    >
                      <b-tab title="Balance">
                        <div
                          v-for="b,i in balances[acc.addr]"
                          :key="i"
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="ml-25 font-weight-bolder text-uppercase">
                            {{ formatDenom(b.denom) }}
                          </div>
                          <div class="d-flex flex-column text-right">
                            <span class="font-weight-bold mb-0">{{ formatAmount(b.amount) }}</span>
                            <span class="font-small-2 text-muted text-nowrap">${{ formatCurrency(b.amount, b.denom) }}</span>
                          </div>
                        </div>
                      </b-tab>
                    </b-tabs>
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
import chainAPI from '@/libs/fetch'
import {
  BCard, BCardHeader, BCardTitle, BCardBody, VBModal, BRow, BCol, BTabs, BTab, BAvatar, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import {
  formatTokenAmount, formatTokenDenom, getLocalAccounts, getLocalChains,
} from '@/libs/data'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import OperationTransferComponent from './OperationTransferComponent.vue'
import OperationTransfer2Component from './OperationTransfer2Component.vue'

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
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      selectedAddress: '',
      selectedName: '',
      transferWindow: false,
      accounts: [],
      balances: {},
      ibcDenom: {},
      quotes: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.accounts = getLocalAccounts()
      const chains = getLocalChains()
      if (this.accounts) {
        Object.keys(this.accounts).forEach(acc => {
          this.accounts[acc].address.forEach(add => {
            chainAPI.getBankBalance(chains[add.chain].api, add.addr).then(res => {
              if (res && res.length > 0) {
                this.$set(this.balances, add.addr, res)
                res.forEach(token => {
                  let symbol
                  if (token.denom.startsWith('ibc')) {
                    chainAPI.getIBCDenomTraceText(chains[add.chain].api, token.denom).then(denom => {
                      this.$set(this.ibcDenom, token.denom, denom)
                      symbol = formatTokenDenom(denom)
                    })
                  } else {
                    symbol = formatTokenDenom(token.denom)
                  }
                  if (symbol) {
                    if (!this.quotes[symbol]) {
                      chainAPI.fetchTokenQuote(symbol).then(quote => {
                        this.$set(this.quotes, symbol, quote)
                      })
                    }
                  }
                })
              }
            })
          })
        })
      }
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
      const userCurrency = 'USD'
      const quote = this.quotes[d2]
      if (quote && quote.quote) {
        const { price } = quote.quote[userCurrency]
        return parseFloat((qty * price).toFixed(2))
      }
      return 0
    },
    formatBalance(v) {
      if (v) {
        const ret = v.map(x => this.formatCurrency(x.amount, x.denom)).reduce((t, c) => t + c)
        return parseFloat(ret.toFixed(2))
      }
      return 0
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
