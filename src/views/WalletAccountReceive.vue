<template>
  <div class="d-flex justify-content-center">
    <b-card>
      <b-card-header class="d-flex justify-content-center">
        <h2>Pay Me</h2>
      </b-card-header>
      <b-card-body class="d-flex justify-content-center flex-column">
        <vue-qr :text="address" />
        <div>
          {{ address }}
          <feather-icon
            icon="CopyIcon"
            size="12"
            @click="copy()"
          />
        </div>
        <b-button
          v-if="fromAddress"
          v-b-modal.operation-modal
          block
          variant="success"
          class="mt-2"
        >
          <feather-icon icon="SendIcon" />
          Go To Pay
        </b-button>
        <b-button
          v-else
          block
          class="mt-2"
          variant="primary"
          to="/wallet/import"
        >
          Connect Wallet
        </b-button>
      </b-card-body>
    </b-card>
    <operation-modal
      :address="fromAddress"
      :to-address="address"
      type="Transfer"
    />
  </div>
</template>

<script>

import VueQr from 'vue-qr'

import {
  BCard, BCardHeader, BCardBody, BFormInput, BButton,
} from 'bootstrap-vue'
import OperationModal from '@/views/components/OperationModal/index.vue'
import { getLocalAccounts } from '@/libs/utils'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BButton,
    BCard,
    BCardHeader,
    BCardBody,
    BFormInput,
    VueQr,
    OperationModal,
  },
  data() {
    const { address } = this.$route.params
    return {
      address,
    }
  },
  computed: {
    fromAddress() {
      const key = this.$store?.state?.chains?.defaultWallet
      if (key) {
        const accounts = getLocalAccounts() || {}
        const account = Object.entries(accounts)
          .map(v => ({ wallet: v[0], address: v[1].address.find(x => x.chain === this.$store.state.chains.selected.chain_name) }))
          .filter(v => v.address)
          .find(x => x.wallet === key)
        if (account) {
          return account.address.addr
        }
      }
      return null
    },
  },
  methods: {
    copy() {
      this.$copyText(this.address).then(() => {
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
