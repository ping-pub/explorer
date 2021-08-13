<template>
  <div class="text-center">

    <b-tabs
      pills
      active-nav-item-class="font-weight-bolder"
    >
      <b-tab
        v-for="item,index in accounts"
        :key="index"
      >
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
              class="card-browser-states text-truncate"
            >
              <b-card-header>
                <div>
                  <b-card-title> <span class="text-uppercase">{{ acc.chain }}</span></b-card-title>
                </div>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="18"
                  class="cursor-pointer"
                />
              </b-card-header>
              <b-card-body>
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
                    <small class="pl-1 float-right text-muted text-overflow ">
                      {{ acc.addr }}
                    </small>
                  </b-col>
                </b-row>
                <b-row v-if="balances[acc.addr]">
                  <b-col>
                    <b-tabs
                      active-nav-item-class="font-weight-bold text-second"
                    >
                      <b-tab title="Assets">
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

    <b-card
      v-b-modal.modal-center
      class="addzone"
    >
      <feather-icon icon="PlusIcon" />
      Import Accounts
    </b-card>
    <!-- modal vertical center -->
    <b-modal
      id="modal-center"
      centered
      size="lg"
      title="Add Account"
      hide-footer
      hide-header-close
      cancel-disabled
      scrollable
    >
      <form-wizard-number />
    </b-modal>

  </div>
</template>

<script>
import chainAPI from '@/libs/fetch'
import {
  BCard, BCardHeader, BCardTitle, BCardBody, VBModal, BRow, BCol, BTabs, BTab, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'
import {
  formatTokenAmount, formatTokenDenom, getLocalAccounts, getLocalChains,
} from '@/libs/data'
import FormWizardNumber from './FormWizardNumber.vue'
// import { SigningCosmosClient } from '@cosmjs/launchpad'

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
    FormWizardNumber,
    FeatherIcon,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      accounts: [],
      balances: {},
      ibcDenom: {},
      quotes: {},
    }
  },
  created() {
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
  methods: {
    formatDenom(v) {
      const denom = (v.startsWith('ibc') ? this.ibcDenom[v] : v)
      return formatTokenDenom(denom)
    },
    formatAmount(v) {
      return formatTokenAmount(v)
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
