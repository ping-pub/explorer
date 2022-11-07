<template>
  <b-card>
    <b-card-title
      class="mb-0"
      style="min-height:55px;"
    >
      #{{ p.id }}.
      <b-badge
        pill
        variant="light-primary"
      >
        {{ formatType(p.contents['@type']) }}
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
          Status
        </p>
        <h6 class="mb-0">
          <span v-if="p.status == 1">
            Deposit
          </span>
          <span v-else-if="p.status == 2">
            Voting
          </span>
          <span v-else-if="p.status == 3">
            Passed
          </span>
          <span v-else-if="p.status == 4">
            Rejected
          </span>
          <span v-else>{{ p.status }}</span>
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
    <div>
      <div class="scale">
        <div class="box">
          <b-progress
            :max="totalPower && p.status === 2? 100 * (totalPower/p.tally.total) :100"
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
              variant="danger"
              :value="percent(p.tally.no)"
              :label="`${percent(p.tally.no).toFixed()}%`"
              show-progress
            />
            <b-progress-bar
              :id="'vote-veto'+p.id"
              class="bg-danger bg-darken-4"
              :value="percent(p.tally.veto)"
              :label="`${percent(p.tally.veto).toFixed()}%`"
              show-progress
            />
            <b-progress-bar
              :id="'vote-abstain'+p.id"
              variant="secondary"
              :value="percent(p.tally.abstain)"
              :label="`${percent(p.tally.abstain).toFixed()}%`"
              show-progress
            />
          </b-progress>
          <div
            v-if="tallyParam"
            v-b-tooltip.hover
            title="Threshold"
            class="box overlay"
            :style="`left:${scaleWidth(p)}%;`"
          />
          <div
            v-if="tallyParam && p.status === 2"
            v-b-tooltip.hover
            title="Quorum"
            class="box overlay"
            :style="`left:${Number(tallyParam.quorum) * 100}%; border-color:black`"
          />
        </div>
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
      </div>
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
    </div></b-card>
</template>

<script>
import {
  BCard, BCardTitle, BCardFooter, BButton, BProgressBar, BProgress, BBadge, BTooltip, BRow, BCol, VBModal, VBTooltip,
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
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    p: {
      type: Object,
      default: () => ({}),
    },
    totalPower: {
      type: Number,
      default: 0,
    },
    tallyParam: {
      type: Object,
      default: null,
    },
  },
  methods: {
    scaleWidth(p) {
      if (this.tallyParam) {
        if (p.status === 2) {
          return Number(this.tallyParam.quorum) * Number(this.tallyParam.threshold) * (1 - p.tally.abstain) * 100
        }
        return Number(this.tallyParam.threshold) * (1 - p.tally.abstain) * 100
      }
      return 50
    },
    selectProposal(modal, pid, title) {
      this.$parent.operationModalType = modal
      this.$parent.selectedProposalId = Number(pid)
      this.$parent.selectedTitle = title
    },
    formatType(v) {
      const txt = String(v).replace('Proposal', '')
      const index = txt.lastIndexOf('.')
      return index > 0 ? txt.substring(index + 1) : txt
    },
    percent: v => percent(v),
    formatDate: v => dayjs(v).format('YYYY-MM-DD'),
    formatToken: v => tokenFormatter(v, {}),
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
