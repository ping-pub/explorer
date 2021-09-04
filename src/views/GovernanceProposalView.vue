<template>
  <section>
    <b-card
      no-body
    >
      <b-card-header>
        <b-card-title>
          #{{ proposal.id }}
          <b-badge
            v-if="proposal.status == 1"
            pill
            variant="light-info"
            class="text-right"
          >
            Deposit
          </b-badge>
          <b-badge
            v-if="proposal.status == 2"
            pill
            variant="light-primary"
            class="text-right"
          >
            Voting
          </b-badge>
          <b-badge
            v-if="proposal.status == 3"
            pill
            variant="light-success"
            class="text-right"
          >
            Passed
          </b-badge>
          <b-badge
            v-if="proposal.status == 4"
            pill
            variant="light-danger"
            class="text-right"
          >
            Rejected
          </b-badge>
          {{ proposal.title }}
        </b-card-title>
      </b-card-header>
      <b-card-body>
        <b-table-simple
          stacked="sm"
          hover
          striped
        >
          <tbody>
            <b-tr>
              <b-td
                style="text-transform: capitalize; vertical-align: top; width:200px"
              >
                {{ $t('proposal_id') }}
              </b-td><b-td>{{ proposal.id }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>
                {{ $t('proposal_proposer') }}
              </b-td><b-td>{{ formatAddress(proposer.proposer) }} </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                {{ $t('proposal_total_deposit') }}
              </b-td><b-td>{{ proposal.total_deposit }} </b-td>
            </b-tr>
            <b-tr>
              <b-td>
                {{ $t('proposal_submit_time') }}
              </b-td><b-td>{{ proposal.submit_time }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>
                {{ $t('voting_time') }}
              </b-td><b-td>{{ proposal.voting_start_time }} - {{ proposal.voting_end_time }}</b-td>
            </b-tr>
            <b-tr>
              <b-td>
                {{ $t('proposal_type') }}
              </b-td><b-td>
                {{ proposal.type }}
              </b-td>
            </b-tr>
          </tbody>
        </b-table-simple>
        <div style="white-space: pre-line">
          <object-field-component
            :tablefield="proposal.contents"
            :small="false"
          /></div>
      </b-card-body>
      <b-card-footer>
        <router-link :to="`../gov`">
          <b-button
            variant="outline-primary"
          >
            {{ $t('btn_back_list') }}
          </b-button>
        </router-link>
        <b-button
          v-b-modal.vote-window
          :disabled="proposal.status!=2"
          variant="primary"
          class="btn float-right mg-2"
        >
          {{ $t('btn_vote') }}
        </b-button>
      </b-card-footer>
    </b-card>
    <operation-vote-component
      :proposal-id="proposal.id"
      :title="proposal.title"
    />
    <b-card no-body>
      <b-card-header>
        <b-card-title>
          Votes
        </b-card-title>
      </b-card-header>
      <b-card-body>
        <b-progress
          :max="100"
          height="2rem"
          class="mb-2"
          show-progress
        >
          <b-progress-bar
            :id="'vote-yes'+proposal.id"
            variant="success"
            :value="proposal.tally.yes"
            show-progress
          />
          <b-progress-bar
            :id="'vote-no'+proposal.id"
            variant="warning"
            :value="proposal.tally.no"
            show-progress
          />
          <b-progress-bar
            :id="'vote-veto'+proposal.id"
            variant="danger"
            :value="proposal.tally.veto"
            show-progress
          />
          <b-progress-bar
            :id="'vote-abstain'+proposal.id"
            variant="info"
            :value="proposal.tally.abstain"
            show-progress
          />
        </b-progress>
        <b-tooltip
          :target="'vote-yes'+proposal.id"
        >
          {{ proposal.tally.yes }}% voted Yes
        </b-tooltip>
        <b-tooltip
          :target="'vote-no'+proposal.id"
        >
          {{ proposal.tally.no }}% voted No
        </b-tooltip>
        <b-tooltip
          :target="'vote-veto'+proposal.id"
        >
          {{ proposal.tally.veto }}% voted No With Veta
        </b-tooltip>
        <b-tooltip
          :target="'vote-abstain'+proposal.id"
        >
          {{ proposal.tally.abstain }}% voted Abstain
        </b-tooltip>
        <b-table
          stacked="sm"
          :fields="votes_fields"
          :items="votes"
          striped
        />
      </b-card-body>
    </b-card>
    <b-card no-body>
      <b-card-header>
        <b-card-title>
          Deposits ({{ proposal.total_deposit }})
        </b-card-title>
      </b-card-header>
      <b-card-body>
        <b-table
          stacked="sm"
          :items="deposits"
          :fields="deposit_fields"
          striped
        />
      </b-card-body>
      <b-card-footer>
        <router-link :to="`../gov`">
          <b-button
            variant="outline-primary"
          >
            {{ $t('btn_back_list') }}
          </b-button>
        </router-link>
        <b-button
          :disabled="proposer.status!=2"
          variant="primary"
          class="btn float-right mg-2"
        >
          {{ $t('btn_vote') }}
        </b-button>
      </b-card-footer>
    </b-card>
  </section>
</template>

<script>
import {
  BCard, BCardBody, BCardFooter, BButton, BTable, BTableSimple, BTr, BTd, BCardTitle, BCardHeader,
  BProgressBar, BProgress, BTooltip, BBadge,
} from 'bootstrap-vue'
// import fetch from 'node-fetch'

import { getCachedValidators, getStakingValidatorByAccount, tokenFormatter } from '@/libs/data/data'
import { Proposal, Proposer } from '@/libs/data'
import ObjectFieldComponent from './ObjectFieldComponent.vue'
import OperationVoteComponent from './OperationVoteComponent.vue'
// import { formatToken } from '@/libs/data/data'

export default {
  components: {
    BCard,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BButton,
    BTable,
    BTableSimple,
    BCardHeader,
    BTr,
    BTd,
    BProgressBar,
    BProgress,
    BTooltip,
    BBadge,
    ObjectFieldComponent,
    OperationVoteComponent,
  },
  data() {
    return {
      proposal: new Proposal(),
      proposer: new Proposer(),
      deposits: [],
      votes: [],
      votes_fields: [
        {
          key: 'voter',
          sortable: true,
          formatter: v => this.formatAddress(v),
        },
        {
          key: 'option',
          sortable: true,
          formatter: value => {
            switch (value) {
              case 1:
                return 'Yes'
              case 2:
                return 'Abstain'
              case 3:
                return 'No'
              case 4:
                return 'No With Veto'
              default:
                return value
            }
          },
        },
      ],
      deposit_fields: [
        {
          key: 'depositor',
          formatter: v => this.formatAddress(v),
        },
        {
          key: 'amount',
          sortable: true,
          formatter: tokenFormatter,
        },
      ],
    }
  },

  created() {
    const pid = this.$route.params.proposalid

    this.$http.getGovernance(pid).then(p => {
      if (p.status === 2) {
        this.$http.getGovernanceTally(pid, 0).then(t => p.updateTally(t))
      }
      this.proposal = p
    })

    if (!getCachedValidators()) {
      this.$http.getValidatorList()
    }

    this.$http.getGovernanceProposer(pid).then(res => {
      this.proposer = res
    })
    this.$http.getGovernanceDeposits(pid).then(res => {
      this.deposits = res
    })
    this.$http.getGovernanceVotes(pid).then(res => {
      this.votes = res
    })
  },
  methods: {
    formatAddress(v) {
      return getStakingValidatorByAccount(this.$http.config.chain_name, v)
    },
  },
}
</script>

<style>

</style>
