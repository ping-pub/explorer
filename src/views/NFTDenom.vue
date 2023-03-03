<template>
  <div>
    <b-card title="Query NFT">
      <b-form-group>
        <b-form-radio-group
          v-if="isWasm"
          v-model="keyType"
          :aria-describedby="ariaDescribedby"
          name="radio-sub-component"
        >
          <b-form-radio value="contract">
            Search By Contract ID
          </b-form-radio>
          <b-form-radio value="ibc">
            Search From IBC Path
          </b-form-radio>
        </b-form-radio-group>
        <b-form-input
          v-if="isWasm"
          v-model="contractId"
          class="my-1"
          :placeholder="`Wasm Contract Id: e.g. ${sample}`"
        />
        <b-form-input
          v-if="!isWasm || keyType==='contract'"
          v-model="tokenId"
          placeholder="Token ID, e.g. mynft"
        />
      </b-form-group>
      <b-button @click="fetchWasmNFT()">
        Search
      </b-button>
    </b-card>
    <b-card
      v-if="data"
      title="NFT Details"
    >
      <object-field-component :tablefield="data" />
    </b-card>
    <b-card v-else>
      No NFT found!
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BFormGroup, BFormInput, BButton, BFormRadioGroup, BFormRadio,
} from 'bootstrap-vue'
import ObjectFieldComponent from './components/ObjectFieldComponent'

export default {
  components: {
    BButton,
    BFormRadio,
    BFormRadioGroup,
    BCard,
    BFormGroup,
    BFormInput,
    ObjectFieldComponent,
  },
  data() {
    return {
      data: {},
      contractId: '',
      tokenId: '',
      keyType: 'contract',
    }
  },
  computed: {
    chainName() {
      return this.$store.state.chains.selected.chain_name
    },
    isWasm() {
      return ['juno', 'stargaze'].includes(this.chainName)
    },
    sample() {
      return this.keyType === 'contract'
        ? 'stars1y26zydcynhdz3t93wzsx4ww9nh9fz9gup6s5k45jqn7nsl36kefsdhdnvv'
        : 'wasm.stars1ve46fjrhcrum94c7d8yc2wsdz8cpuw73503e8qn9r44spr6dw0lsvmvtqh/channel-207/denom'
    },
  },
  mounted() {
    const { denom } = this.$route.params
    if (denom && denom !== 'nft') {
      this.$http.getNFTDenom(denom).then(res => {
        this.data = res.denom
      })
    }
  },
  methods: {
    fetchWasmNFT() {
      if (this.isWasm) {
        if (this.keyType === 'contract') {
          this.$http.getWasmQuery(this.contractId, `{"all_nft_info":{"token_id": "${this.tokenId}"}}`)
            .then(res => {
              this.data = res.data
            })
        } else {
          const keys = this.contractId.split('/')
          if (keys.length === 3) {
            const contractId = keys[0].replace('wasm.', '')
            const query = `{"nft_contract": {"class_id" : "${this.contractId}"}}`
            this.$http.getWasmQuery(contractId, query)
              .then(contract => {
                const tokenId = keys[2]
                this.$http.getWasmQuery(contract.data, `{"all_nft_info":{"token_id": "${tokenId}"}}`)
                  .then(res => {
                    this.data = res.data
                  })
              })
          }
        }
      } else {
        this.$http.getNFTDenom(this.tokenId).then(res => {
          this.data = res.denom
        })
      }
    },
  },
}
</script>
