<template>
  <b-modal
    :id="modalId"
    ref="queryModal"
    :title="title"
  >
    <div>
      <b-alert
        v-if="isError"
        variant="danger"
        show
      >
        {{ response }}
      </b-alert>
      <b-form-textarea
        v-if="!response && !isError"
        id="textarea"
        v-model="query"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
      />
      <pre v-if="response && !isError">{{ response }}</pre>
    </div>
    <template v-slot:modal-footer>
      <b-button
        v-if="!response"
        variant="primary"
        @click="submitData"
      >
        {{ $t('queryContractModal.submit') }}
      </b-button>
      <b-button
        v-if="response"
        variant="primary"
        @click="resetForm"
      >
        {{ $t('queryContractModal.reset') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {
  BFormTextarea,
  BButton,
  BAlert,
} from 'bootstrap-vue'

export default {
  components: {
    BFormTextarea,
    BButton,
    BAlert,
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    selectedChainName: {
      type: String,
      default: null,
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      response: '',
      title: this.$t('queryContractModal.title'),
      query: '',
    }
  },
  computed: {
    selectedChain() {
      let config = null
      const allChains = localStorage.getItem('chains')
      const selectedChain = localStorage.getItem('selected_chain')
      if (allChains && selectedChain) {
        config = JSON.parse(allChains)[selectedChain]
      }
      return config
    },
  },
  methods: {
    resetForm() {
      this.showInput = true
      this.showResponse = false
      this.inputValue = ''
      this.response = ''
      this.isError = false
    },
    async submitData() {
      this.showInput = false
      this.showResponse = true
      try {
        const x = JSON.parse(this.query)
        if (typeof x !== 'object') {
          throw new Error('Query must be valid JSON!')
        }
      } catch (e) {
        this.isError = true
        this.response = `Query must be valid JSON! Error: ${e.message}`
        return
      }
      try {
        const res = await this.$http.queryContract(this.address, this.query, this.selectedChain)
        this.response = JSON.stringify(res.data, null, 2)
        this.isError = false
      } catch (error) {
        this.isError = true
        this.response = `Error: ${error.message}`
      }
    },
  },
}
</script>
