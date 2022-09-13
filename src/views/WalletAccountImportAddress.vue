<template>
  <div>
    <b-alert
      variant="danger"
      :show="true"
      dismissible
    >
      <h4 class="alert-heading">
        DISCLAIMER:
      </h4>
      <div class="alert-body">
        <span>Ping.pub is maintained by the community, Everyone could add a chain to ping.pub. Some of those blockchains are not fully tested, Use at your own risk.</span>
      </div>
    </b-alert>
    <form-wizard
      ref="wizard"
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      finish-button-text="Save"
      back-button-text="Previous"
      class="steps-transparent mb-3 md"
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
                  <b-form-radio-group
                    v-model="device"
                    stacked
                  >

                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="keplr"
                      checked
                      class="mb-1 mt-1"
                    >
                      Keplr
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="ledger"
                      class="mb-1"
                    >
                      Ledger via WebUSB
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="ledger2"
                      class="mb-1"
                    >
                      Ledger via Bluetooth
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="metamask"
                      class="mb-1 d-none"
                    >
                      Metamask
                    </b-form-radio>
                    <b-form-radio
                      v-model="device"
                      name="device"
                      value="address"
                    >
                      Address (Observe Only)
                    </b-form-radio>
                  </b-form-radio-group>
                  <b-form-input
                    v-if="device === 'address'"
                    v-model="address"
                    class="mt-1"
                    name="address"
                    placeholder="cosmos1ev0vtddkl7jlwfawlk06yzncapw2x9quyxx75u"
                  />
                  <small class="text-danger">{{ debug }}{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col
              v-if="device.startsWith('ledger')"
              md="12"
            >
              <b-form-group
                label="HD Path"
                label-for="hdpath"
              >
                <validation-provider
                  #default="{ errors }"
                  name="HD Path"
                  rules="required"
                >
                  <b-form-input
                    v-model="hdpath"
                    class="mt-1"
                    name="hdpath"
                    placeholder="m/44'/60/0'/0/0"
                  />
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
                    placeholder="Ping Nano X"
                    :readonly="edit"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col
              v-if="hdpath"
              md="12"
            >
              <b-form-group
                label="HD Path"
                label-for="ir"
              >
                <b-form-input
                  id="ir"
                  :value="hdpath"
                  readonly
                />
              </b-form-group>
            </b-col>
            <b-col
              v-if="accounts"
              md="12"
            >
              <b-form-group
                label="Public Key"
                label-for="ir"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Public Key"
                  rules="required"
                >
                  <b-form-input
                    id="ir"
                    :value="formatPubkey(accounts.pubkey)"
                    readonly
                    :state="errors.length > 0 ? false:null"
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
                        xs="12"
                        md="4"
                        lg="3"
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
                          <span
                            v-b-tooltip.hover.v-primary
                            :title="`Coin Type: ${item.coin_type}`"
                            :class="hdpath.startsWith(`m/44'/${item.coin_type}`)?'text-success':'text-danger'"
                          > {{ item.chain_name }}</span>
                        </b-form-checkbox>
                      </b-col>
                    </b-row>
                  </div>
                  <small class="text-success">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-alert
                show
                variant="info"
              >
                <div class="alert-heading">
                  IMPORTANT
                </div>
                <div class="alert-body">
                  <div>
                    If you don't have Ledger, Do not import those addresses in <b class="text-danger">RED</b>. Because these addresses are derived from different coin_type which is not as same as the official one
                  </div>
                </div>
              </b-alert>
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
            {{ name }} <small> {{ hdpath }}</small>
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

    <b-alert
      variant="secondary"
      :show="!accounts && device === 'keplr'"
    >
      <h4 class="alert-heading">
        Enable Keplr For {{ chainId }}
      </h4>
      <div class="alert-body p-1">
        <span>If Keplr has not added <code>{{ chainId }}</code>, We can enable it here.</span>
        <b-form-textarea
          :value="keplr"
          rows="10"
          class="mt-1 mb-1"
        />
        <div
          v-if="error"
          class="text-danger"
        >
          {{ error }}
        </div>
        <b-button
          variant="primary"
          @click="suggest()"
        >
          Enable Keplr
        </b-button>
      </div>
    </b-alert>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import MetaMaskSigner from '@/libs/client/MetaMaskSigner'
import {
  BAlert,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BFormCheckbox,
  BAvatar,
  BInputGroup,
  BInputGroupPrepend,
  BFormRadioGroup,
  VBTooltip,
  BFormTextarea,
  BButton,
} from 'bootstrap-vue'
import { required } from '@validations'
import {
  addressDecode, addressEnCode, getLedgerAddress, getLocalAccounts,
} from '@/libs/utils'
import { toHex } from '@cosmjs/encoding'
import { stringToPath } from '@cosmjs/crypto'

export default {
  components: {
    BAlert,
    BButton,
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
    BFormTextarea,
    BInputGroup,
    BInputGroupPrepend,
    BFormRadioGroup,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      debug: '',
      device: 'keplr',
      address: '',
      hdpath: "m/44'/60/0'/0/0",
      name: '',
      options: {},
      required,
      selected: [],
      accounts: null,
      exludes: [], // HD Path is NOT supported,
      edit: false,
      keplr: '',
      chainId: '',
      error: null,
    }
  },
  computed: {
    chains() {
      const config = JSON.parse(localStorage.getItem('chains'))

      this.exludes.forEach(x => {
        delete config[x]
      })
      return config
    },
    addresses() {
      if (this.accounts && this.accounts.address) {
        const { data } = addressDecode(this.accounts.address)
        return this.selected.map(x => {
          if (this.chains[x]) {
            const { logo, addr_prefix, coin_type } = this.chains[x]
            const addr = addressEnCode(addr_prefix, data, coin_type)
            return {
              chain: x, addr, logo, hdpath: this.hdpath,
            }
          }
          return null
        }).filter(x => x != null)
      }
      return []
    },
  },
  mounted() {
    const { selected } = this.$store.state.chains
    // this.chain = selected
    this.$http.getLatestBlock().then(res => {
      this.chainId = res.block.header.chain_id
      this.keplr = this.initParamsForKeplr(this.chainId, selected)
    })
    if (selected && selected.chain_name && !this.exludes.includes(selected.chain_name)) {
      this.selected.push(selected.chain_name)
    }
    const name = new URLSearchParams(window.location.search).get('name')
    const wallets = getLocalAccounts()
    if (name && wallets && wallets[name]) {
      const wallet = wallets[name]
      this.device = wallet.device
      this.name = wallet.name
      this.edit = true
      if (wallet.address) {
        wallet.address.forEach(a => {
          if (!this.selected.includes(a.chain)) {
            this.selected.push(a.chain)
          }
        })
        this.address = wallet.address[0].addr
        this.hdpath = wallet.address[0].hdpath
        if (this.localAddress()) {
          this.$refs.wizard.nextTab()
        }
      }
    } else {
      this.hdpath = `m/44'/${selected.coin_type}/0'/0/0`
    }
  },
  methods: {
    suggest() {
      if (window.keplr) {
        window.keplr.experimentalSuggestChain(JSON.parse(this.keplr)).catch(e => {
          this.error = e
        })
      }
    },
    initParamsForKeplr(chainid, chain) {
      return JSON.stringify({
        chainId: chainid,
        chainName: 'Point',
        rpc: Array.isArray(chain.rpc) ? chain.rpc[0] : chain.rpc,
        rest: Array.isArray(chain.api) ? chain.api[0] : chain.api,
        bip44: {
          coinType: chain.coin_type,
        },
        coinType: chain.coin_type,
        bech32Config: {
          bech32PrefixAccAddr: chain.addr_prefix,
          bech32PrefixAccPub: `${chain.addr_prefix}pub`,
          bech32PrefixValAddr: `${chain.addr_prefix}valoper`,
          bech32PrefixValPub: `${chain.addr_prefix}valoperpub`,
          bech32PrefixConsAddr: `${chain.addr_prefix}valcons`,
          bech32PrefixConsPub: `${chain.addr_prefix}valconspub`,
        },
        currencies: [
          {
            coinDenom: chain.assets[0].symbol,
            coinMinimalDenom: chain.assets[0].base,
            coinDecimals: chain.assets[0].exponent,
            coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
          },
        ],
        feeCurrencies: [
          {
            coinDenom: chain.assets[0].symbol,
            coinMinimalDenom: chain.assets[0].base,
            coinDecimals: chain.assets[0].exponent,
            coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
          },
        ],
        stakeCurrency: {
          coinDenom: chain.assets[0].symbol,
          coinMinimalDenom: chain.assets[0].base,
          coinDecimals: chain.assets[0].exponent,
          coinGeckoId: chain.assets[0].coingecko_id || 'unknown',
        },
        gasPriceStep: {
          low: 5000000000,
          average: 25000000000,
          high: 40000000000,
        },
        features: chain.keplr_features || [],
      }, null, '\t')
    },
    formatPubkey(v) {
      if (typeof (v) === 'string') {
        return v
      }
      if (v) {
        return toHex(v)
      }
      return ''
    },
    async connect() {
      const transport = this.device === 'ledger' ? 'usb' : 'bluetooth'
      return getLedgerAddress(transport, this.hdpath)
    },
    async cennectKeplr() {
      if (!window.getOfflineSigner || !window.keplr) {
        this.debug = 'Please install keplr extension'
        return null
      }
      // const chainId = 'cosmoshub'
      const chainId = await this.$http.getLatestBlock().then(ret => ret.block.header.chain_id)
      await window.keplr.enable(chainId)
      const offlineSigner = window.getOfflineSigner(chainId)
      return offlineSigner.getAccounts()
    },
    async connectMetamask() {
      if (!window.ethereum) {
        this.debug = 'Please install Metamask extension'
        return null
      }
      const signer = MetaMaskSigner.create(stringToPath(this.hdpath))
      return signer.getAccounts()
    },
    localAddress() {
      if (!this.address) return false
      try {
        const { data } = addressDecode(this.address)
        if (data) {
          this.accounts = {
            address: this.address,
            pubkey: data,
          }
          return true
        }
      } catch (e) { this.debug = e }
      return false
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
      if (!this.$store.state.chains.defaultWallet) {
        this.$store.commit('setDefaultWallet', this.name)
      }

      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Address Saved!',
          icon: 'EditIcon',
          variant: 'success',
        },
      })

      this.$router.push('./accounts')
    },
    async validationFormDevice() {
      let ok = String(this.name).length > 0

      if (!ok) { // new import, otherwise it's edit mode.
        switch (this.device) {
          case 'keplr':
            await this.cennectKeplr().then(accounts => {
              if (accounts) {
              // eslint-disable-next-line prefer-destructuring
                this.accounts = accounts[0]
                ok = true
              }
            })
            break
          case 'metamask':
            await this.connectMetamask().then(accounts => {
              if (accounts) {
              // eslint-disable-next-line prefer-destructuring
                this.accounts = accounts[0]
                ok = true
              }
            }).catch(e => {
              this.debug = e
            })
            break
          case 'ledger':
          case 'ledger2':
            await this.connect().then(accounts => {
              if (accounts) {
              // eslint-disable-next-line prefer-destructuring
                this.accounts = accounts[0]
                ok = true
              }
            }).catch(e => {
              this.debug = e
            })
            break
          default:
            ok = this.localAddress()
        }
      }

      return new Promise((resolve, reject) => {
        this.$refs.deviceRules.validate().then(success => {
          if (ok && success) {
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
  // @import '@core/assets/fonts/feather/iconfont.css';
  @import '@core/scss/vue/libs/vue-wizard.scss';
</style>
