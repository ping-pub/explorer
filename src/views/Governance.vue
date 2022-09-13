<template>
  <div>
    <b-row class="match-height">
      <b-col
        v-for="p in proposals"
        :key="p.id"
        lg="6"
        md="12"
      >
        <proposal-summary-component :p="p" />
      </b-col>
    </b-row>
    <b-row v-if="next">
      <b-col>
        <b-button
          block
          variant="outline-primary"
          :disabled="loading"
          @click="getList()"
        >
          Load More
        </b-button>
      </b-col>
    </b-row>
    <operation-modal
      :type="operationModalType"
      :proposal-id="selectedProposalId"
      :proposal-title="selectedTitle"
    />
  </div>
</template>

<script>
import {
  BCardTitle, BCardFooter, BButton, BProgressBar, BProgress, BBadge, BTooltip, BRow, BCol, VBModal,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import OperationModal from '@/views/components/OperationModal/index.vue'
import ProposalSummaryComponent from './components/governance/ProposalSummaryComponent.vue'

export default {
  components: {
    BButton,
    BCardFooter,
    BProgressBar,
    BProgress,
    BBadge,
    BCardTitle,
    BTooltip,
    BRow,
    BCol,
    OperationModal,
    ProposalSummaryComponent,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      selectedProposalId: 0,
      selectedTitle: '',
      proposals: [],
      max: 1,
      operationModalType: '',
      next: '',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.getGovernanceList(this.next).then(res => {
        this.proposals = this.proposals.concat(res.proposals)
        this.updateTally(this.proposals)
        this.next = res.pagination.next_key
        this.loading = false
      })
    },
    updateTally(res) {
      const voting = res.filter(i => i.status === 2)
      if (voting.length > 0) {
        voting.forEach(p => this.$http.getGovernanceTally(p.id, 0).then(update => {
          this.$set(p, 'tally', update)
        }))
      }
    },
  },
}
</script>

<style scoped>
section {
  display: flex;
  /* flex-wrap: nowrap; */
  justify-content: space-between;
}
.card {
  flex-basis: 49%;
}
.gov-wrapper {
    display: flex;
    justify-content:center;
}
.dark-layout .gov-wrapper .gov {
    background-color: #161d31;
}
.gov-wrapper .gov {
    padding: .5rem;
    margin: .3rem;
    min-width: 7.5rem;
    text-align: center;
    background-color: #f8f8f8;
    border-radius: .357rem;
}

</style>
