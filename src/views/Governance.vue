<template>
  <div>
    <b-row class="match-height">
      <b-col
        v-for="p in proposals"
        :key="p.id"
        lg="6"
        md="12"
      >
        <b-card>
          <b-card-title class="mb-0">
            #{{ p.id }}.
            <b-badge
              v-if="p.status == 1"
              pill
              variant="light-info"
              class="text-right"
            >
              Deposit
            </b-badge>
            <b-badge
              v-if="p.status == 2"
              pill
              variant="light-primary"
              class="text-right"
            >
              Voting
            </b-badge>
            <b-badge
              v-if="p.status == 3"
              pill
              variant="light-success"
              class="text-right"
            >
              Passed
            </b-badge>
            <b-badge
              v-if="p.status == 4"
              pill
              variant="light-danger"
              class="text-right"
            >
              Rejected
            </b-badge>
            <router-link
              :to="`./gov/${p.id}`"
            >
              {{ p.title }}
            </router-link>
          </b-card-title>
          <div class="gov-wrapper flex-wrap my-1">
            <div class="gov">
              <p class="card-text mb-25">
                Type
              </p>
              <h6 class="mb-0">
                {{ formatType(p.contents['@type']) }}
              </h6>
            </div>
            <div class="gov">
              <p class="card-text mb-25">
                Start Date
              </p>
              <h6 class="mb-0">
                {{ formatDate(p.voting_start_time) }}
              </h6>
            </div>
            <div class="gov">
              <p class="card-text mb-25">
                End Date
              </p>
              <h6 class="mb-0">
                {{ formatDate(p.voting_end_time) }}
              </h6>
            </div>
            <div class="gov">
              <p class="card-text mb-25">
                Deposit
              </p>
              <h6 class="mb-0">
                {{ formatToken(p.total_deposit) || '-' }}
              </h6>
            </div>
          </div>

          <b-progress
            :max="100"
            height="2rem"
            class="mb-2"
            show-progress
          >
            <b-progress-bar
              :id="'vote-yes'+p.id"
              variant="success"
              :value="percent(p.tally.yes)"
              show-progress
              :label="`${percent(p.tally.yes).toFixed()}%`"
            />
            <b-progress-bar
              :id="'vote-no'+p.id"
              variant="warning"
              :value="percent(p.tally.no)"
              :label="`${percent(p.tally.no).toFixed()}%`"
              show-progress
            />
            <b-progress-bar
              :id="'vote-veto'+p.id"
              variant="danger"
              :value="percent(p.tally.veto)"
              :label="`${percent(p.tally.veto).toFixed()}%`"
              show-progress
            />
            <b-progress-bar
              :id="'vote-abstain'+p.id"
              variant="info"
              :value="percent(p.tally.abstain)"
              :label="`${percent(p.tally.abstain).toFixed()}%`"
              show-progress
            />
          </b-progress>
          <b-tooltip
            :target="'vote-yes'+p.id"
          >
            {{ percent(p.tally.yes) }}% voted Yes
          </b-tooltip>
          <b-tooltip
            :target="'vote-no'+p.id"
          >
            {{ percent(p.tally.no) }}% voted No
          </b-tooltip>
          <b-tooltip
            :target="'vote-veto'+p.id"
          >
            {{ percent(p.tally.veto) }}% voted No With Veto
          </b-tooltip>
          <b-tooltip
            :target="'vote-abstain'+p.id"
          >
            {{ percent(p.tally.abstain) }}% voted Abstain
          </b-tooltip>
          <b-card-footer class="pb-0">
            <router-link
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              :to="`./gov/${p.id}`"
              variant="outline-primary"
            >
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                :href="`./gov/${p.id}`"
                variant="outline-primary"
              >
                {{ $t('btn_detail') }}
              </b-button>
            </router-link>
            <b-button
              v-if="p.status===1"
              v-b-modal.operation-modal
              variant="primary"
              class="btn float-right mg-2"
              @click="selectProposal('GovDeposit',p.id, p.title)"
            >
              {{ $t('btn_deposit') }}
            </b-button>
            <b-button
              v-if="p.status===2"
              v-b-modal.operation-modal
              variant="primary"
              class="btn float-right mg-2"
              @click="selectProposal('Vote',p.id, p.title)"
            >
              {{ $t('btn_vote') }}
            </b-button>
          </b-card-footer>
        </b-card>
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
  BCard, BCardTitle, BCardFooter, BButton, BProgressBar, BProgress, BBadge, BTooltip, BRow, BCol, VBModal,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { percent, tokenFormatter } from '@/libs/utils'
import dayjs from 'dayjs'
import OperationModal from '@/views/components/OperationModal/index.vue'

export default {
  components: {
    BCard,
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
    formatType(v) {
      const txt = String(v).replace('Proposal', '')
      const index = txt.lastIndexOf('.')
      return index > 0 ? txt.substring(index + 1) : txt
    },
    percent: v => percent(v),
    formatDate: v => dayjs(v).format('YYYY-MM-DD'),
    formatToken: v => tokenFormatter(v, {}),
    selectProposal(modal, pid, title) {
      this.operationModalType = modal
      this.selectedProposalId = Number(pid)
      this.selectedTitle = title
    },
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
