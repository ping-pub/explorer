<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      finish-button-text="Submit"
      back-button-text="Previous"
      @on-complete="formSubmitted"
    >
      <!-- Device tab -->
      <tab-content
        title="Device"
        :before-change="validationFormDevice"
      >
        <validation-observer
          ref="deviceRules"
          tag="form"
        >
          <b-row>
            <b-col md="12">
              <b-form-group
                label="Select a device to import accounts"
                label-for="device"
              >
                <validation-provider
                  #default="{ errors }"
                  name="device"
                  rules="required"
                >
                  <div class="demo-inline-spacing">
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="keplr"
                      checked
                    >
                      Keplr
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="ledger"
                      disabled
                    >
                      Ledger Nano
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="nmemonic"
                      disabled
                    >
                      Nmemonic
                    </b-form-radio>
                  </div>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- address  -->
      <tab-content
        title="Accounts"
        :before-change="validationFormAddress"
      >
        <validation-observer
          ref="accountRules"
          tag="form"
        >
          <b-row>
            <b-col md="12">
              <b-form-group
                label="Account Name"
                label-for="account_name"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Account Name"
                  rules="required"
                >
                  <b-form-input
                    id="account_name"
                    v-model="name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Keplr"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                label="Import Address For Chains:"
              >
                <validation-provider
                  #default="{ errors }"
                  name="addrs"
                  rules="required"
                >
                  <div class="demo-inline-spacing text-uppercase">
                    <b-row>
                      <b-col
                        v-for="item, key in chains"
                        :key="key"
                        cols="3"
                        class="mb-25"
                      >
                        <b-form-checkbox
                          v-model="selected"
                          name="addrs"
                          :value="key"
                        >
                          <b-avatar
                            :src="item.logo"
                            size="18"
                            variant="light-primary"
                            rounded=""
                          />
                          {{ item.chain_name }}
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </div>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <tab-content
        title="Confirmation"
      >
        <div class="d-flex border-bottom mb-2">
          <feather-icon
            icon="UserIcon"
            size="19"
            class="mb-50"
          />
          <h4 class="mb-0 ml-50">
            {{ name }}
          </h4>
        </div>

        <b-row class="mb-2">
          <b-col
            v-for="i in addresses"
            :key="i.addr"
            cols="12"
          >
            <b-input-group class="mb-25">
              <b-input-group-prepend is-text>
                <b-avatar
                  :src="i.logo"
                  size="18"
                  variant="light-primary"
                  rounded
                />
              </b-input-group-prepend>
              <b-form-input :value="i.addr" />
            </b-input-group>
          </b-col>
        </b-row>
      </tab-content>
    </form-wizard>

  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BFormCheckbox,
  BAvatar,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'
import { required } from '@validations'
import store from '@/store'
import { addressDecode, addressEnCode } from '@/libs/data'
import { Bech32 } from '@cosmjs/encoding'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormCheckbox,
    BInputGroup,
    BInputGroupPrepend,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  data() {
    return {
      device: 'keplr',
      name: '',
      options: {},
      required,
      selected: [],
      accounts: null,
    }
  },
  computed: {
    chains() {
      const config = JSON.parse(localStorage.getItem('chains'))
      return config
    },

    addresses() {
      if (!this.accounts) return []
      const { data } = addressDecode(this.accounts[0].address)
      return this.selected.map(x => {
        const { logo, addr_prefix } = this.chains[x]
        const addr = addressEnCode(addr_prefix, data)
        return { chain: x, addr, logo }
      })
    },
  },
  created() {
    const { selected } = store.state.chains
    if (selected && selected.chain_name) {
      this.selected.push(selected.chain_name)
    }
  },
  methods: {
    async cennectKeplr() {
      if (!window.getOfflineSigner || !window.keplr) {
        // eslint-disable-next-line no-alert
        alert('Please install keplr extension')
        return null
      }
      const chainId = 'cosmoshub'
      await window.keplr.enable(chainId)
      const offlineSigner = window.getOfflineSigner(chainId)
      return offlineSigner.getAccounts()
    },
    formSubmitted() {
      const string = localStorage.getItem('accounts')
      const accounts = string ? JSON.parse(string) : {}

      accounts[this.name] = {
        name: this.name,
        device: this.device,
        address: this.addresses,
      }
      localStorage.setItem('accounts', JSON.stringify(accounts))

      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Address Saved!',
          icon: 'EditIcon',
          variant: 'success',
        },
      })
    },
    async validationFormDevice() {
      await this.cennectKeplr().then(accounts => {
        if (accounts) {
          this.accounts = accounts
          const key = Bech32.decode(accounts[0].address)
          console.log(accounts, key)
        }
      })
      return new Promise((resolve, reject) => {
        this.$refs.deviceRules.validate().then(success => {
          if (success) {
            resolve(true)
          }
          reject()
        })
      })
    },
    validationFormAddress() {
      return new Promise((resolve, reject) => {
        this.$refs.accountRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
  },
}
</script>

<style lang="scss">
  @import '@core/scss/vue/pages/ui-feather.scss';
  @import '@core/scss/vue/libs/vue-wizard.scss';
</style>
