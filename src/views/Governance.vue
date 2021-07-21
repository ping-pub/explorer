<template>
  <section>
    <b-row>
      <!-- left align -->
      <b-col
        md="6"
      >
        <b-card>
          <b-card-title class="mb-0">
            <b-badge
              pill
              variant="light-primary"
              class="text-right"
            >
              Passed
            </b-badge> #1. With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content
          </b-card-title>
          <b-card-body md="12">
            <div class="gov-wrapper">
              <div class="gov">
                <p class="card-text mb-25">
                  Start Date
                </p>
                <h6 class="mb-0">
                  2020-05-06
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  End Date
                </p>
                <h6 class="mb-0">
                  2020-05-06
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  Proposer
                </p>
                <h6 class="mb-0">
                  Ping.pub
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  Deposit
                </p>
                <h6 class="mb-0">
                  840.99
                </h6>
              </div>
              <div class="gov">
                <p class="card-text mb-25">
                  Turnout
                </p>
                <h6 class="mb-0">
                  84.86%
                </h6>
              </div>
            </div>
          </b-card-body>

          <b-progress
            :max="max"
            height="2rem"
            class="mb-2"
            show-progress
          >
            <b-progress-bar
              id="vote-yes"
              variant="success"
              :value="values[0]"
              show-progress
            />
            <b-progress-bar
              id="vote-no"
              variant="warning"
              :value="values[1]"
              show-progress
            />
            <b-progress-bar
              id="vote-veto"
              variant="danger"
              :value="values[2]"
              show-progress
            />
            <b-progress-bar
              id="vote-abstain"
              variant="info"
              :value="values[3]"
              show-progress
            />
          </b-progress>
          <b-tooltip
            target="vote-yes"
          >
            {{ values[0] }} voted Yes
          </b-tooltip>
          <b-tooltip
            target="vote-no"
          >
            {{ values[1] }} voted No
          </b-tooltip>
          <b-tooltip
            target="vote-veto"
          >
            {{ values[2] }} voted Veta
          </b-tooltip>
          <b-tooltip
            target="vote-abstain"
          >
            {{ values[3] }} voted Abstain
          </b-tooltip>
          <b-card-footer>
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
            >
              Detail
            </b-button>
            <b-button
              variant="primary"
              class="btn float-right mg-2"
            >
              Vote
            </b-button>
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
    <b-row>

      <b-col
        md="12"
        class="mb-1"
      >
        <b-card
          title="# 1. Special title treatment"
          class="mb-3"
        >
          <b-card-text>
            # 1. With supporting text below as a natural lead-in to additional content.
          </b-card-text>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
          >
            Vote
          </b-button>
        </b-card>
      </b-col>
      <!-- center align -->
      <b-col
        md="6"
        lg="4"
      >
        <b-card
          title="Special title treatment"
          class="text-center"
        >
          <b-card-text>
            With supporting text below as a natural lead-in to additional content
          </b-card-text>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
          >
            Go somewhere
          </b-button>
        </b-card>
      </b-col>

      <!-- right align -->
      <b-col
        md="6"
        lg="4"
      >
        <b-card
          class="text-right"
          title="Special title treatment"
        >
          <b-card-text>
            With supporting text below as a natural lead-in to additional content.
          </b-card-text>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
          >
            Go somewhere
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import {
  BRow, BCol, BCard, BCardTitle, BCardText, BCardBody, BCardFooter, BButton, BProgressBar, BProgress, BBadge, BTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import store from '@/store'

console.log(store.state.chains)

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BButton,
    BCardFooter,
    BCardText,
    BProgressBar,
    BProgress,
    BBadge,
    BCardTitle,
    BTooltip,
    BCardBody,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      values: [15, 50, 10, 5],
      max: 100,
    }
  },
}
</script>

<style scoped>
.gov-wrapper {
    display: flex;
    justify-content:center;
    align-items:center;
}
.gov-wrapper .gov:not(:last-child) {
    margin-right: .7rem;
}
.dark-layout .gov-wrapper .gov {
    background-color: #161d31;
}
.gov-wrapper .gov {
    padding: .5rem;
    margin-bottom: .7rem;
    text-align: center;
    background-color: #f8f8f8;
    border-radius: .357rem;
}

.gov-wrapper .gov {
    width: 8.4rem;
}
</style>
