<template>
  <section>
    <b-card>
      <b-card-header>
        <b-card-title>
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
          #{{ proposal.id }} {{ proposal.title }}
        </b-card-title>
      </b-card-header>
      <b-card-body>
        <b-table-simple>
          <b-tr>
            <b-td lg="2">
              {{ $t('proposal_id') }}
            </b-td><b-td>{{ proposal.id }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ $t('proposal_proposer') }}
            </b-td><b-td>{{ proposer.proposer }} </b-td>
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
              {{ $t('proposal_voting_start_time') }}
            </b-td><b-td>{{ proposal.voting_start_time }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ $t('proposal_voting_end_time') }}
            </b-td><b-td>{{ proposal.voting_end_time }}</b-td>
          </b-tr>
          <b-tr>
            <b-td>
              {{ $t('proposal_type') }}
            </b-td><b-td>{{ proposal.type }}</b-td>
          </b-tr>
          <b-tr
            v-for="(value, name) in proposal.contents"
            :key="name"
          >
            <b-td style="text-transform: capitalize; vertical-align: top;">
              {{ name.replaceAll('_',' ') }}
            </b-td>
            <b-td v-if="!Array.isArray(value)">
              {{ value }}
            </b-td>
            <b-td v-if="Array.isArray(value) && name === 'amount'">
              <span
                v-for="token in value"
                :key="token.amount"
              >
                {{ token.amount }} {{ token.denom }}
              </span>
            </b-td>
            <b-td v-if="Array.isArray(value) && name != 'amount'">
              <b-table :items="value">
                <!-- A custom formatted column -->
                <template #cell(amount)="data">
                  <span
                    v-for="token in data.value"
                    :key="token.amount"
                  >
                    {{ token.amount }} {{ token.denom }}
                  </span>
                </template>
              </b-table>
            </b-td>
          </b-tr>
        </b-table-simple>
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

    <b-card>
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
          :fields="votes_fields"
          :items="votes"
        />
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-header>
        <b-card-title>
          Deposits ({{ proposal.total_deposit }})
        </b-card-title>
      </b-card-header>
      <b-card-body>
        <b-table
          :items="deposits"
          :fields="deposit_fields"
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

import { tokenFormatter } from '@/libs/data/data'
import { Proposal, Proposer } from '@/libs/data'
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
  },
  data() {
    return {
      proposal: new Proposal(),
      proposer: new Proposer(),
      deposits: [],
      votes: [],
      votes_fields: [
        { key: 'voter', sortable: true },
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
        'depositor',
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
        this.$http.getGovernanceTally(pid, 0).then(t => p.updateTally(t)).catch(e => console.log('failed on update voting tally:', e))
      }
      this.proposal = p
    })

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

  // asyncComputed: {
  //   proposal: {
  //     get() {
  //       const pid = this.$route.params.proposalid
  //       // const api = new ChainAPI(this.$route)
  //       return this.$http.getGovernance(pid).then(p => {
  //         if (p.status === 2) {
  //           this.$http.getGovernanceTally(pid, 0).then(t => p.updateTally(t)).catch(e => console.log('failed on update voting tally:', e))
  //         }
  //         return p
  //       })
  //     },
  //     default: new Proposal(),
  //   },
  //   proposer: {
  //     get() {
  //       const pid = this.$route.params.proposalid
  //       // const api = new ChainAPI(this.$route)
  //       return this.$http.getGovernanceProposer(pid)
  //     },
  //     default: new Proposer(),
  //   },
  //   deposits: {
  //     get() {
  //       const pid = this.$route.params.proposalid
  //       // const api = new ChainAPI(this.$route)
  //       return this.$http.getGovernanceDeposits(pid)
  //     },
  //     default: [],
  //   },
  //   votes: {
  //     get() {
  //       const pid = this.$route.params.proposalid
  //       // const api = new ChainAPI(this.$route)
  //       return this.$http.getGovernanceVotes(pid)
  //     },
  //     default: [],
  //   },
  // },
}
</script>

<style>

</style>
