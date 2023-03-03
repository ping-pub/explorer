<template>
  <div>
    <b-card title="Query NFT">
      <b-form-group>
        <b-form-input
          v-if="isWasm"
          v-model="contractId"
          placeholder="Wasm Contract Id: e.g. stars1y26zydcynhdz3t93wzsx4ww9nh9fz9gup6s5k45jqn7nsl36kefsdhdnvv"
        />
        <b-form-input
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
  BCard, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import ObjectFieldComponent from './components/ObjectFieldComponent'

export default {
  components: {
    BButton,
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
    }
  },
  computed: {
    chainName() {
      return this.$store.state.chains.selected.chain_name
    },
    isWasm() {
      return ['juno', 'stargaze'].includes(this.chainName)
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
        this.$http.getWasmQuery(this.contractId, `{"all_nft_info":{"token_id": "${this.tokenId}"}}`)
          .then(res => {
            this.data = res
          })
      } else {
        this.$http.getNFTDenom(this.tokenId).then(res => {
          this.data = res.denom
        })
      }
    },
  },
}
</script>
