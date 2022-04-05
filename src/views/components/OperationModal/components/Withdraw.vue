<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Sender"
          label-for="Account"
        >
          <b-input-group class="mb-25">
            <b-form-input
              :value="address"
              readonly
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BInputGroup, BFormInput, BFormGroup,
} from 'bootstrap-vue'

export default {
  name: 'WithdrawDialogue',
  components: {
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BFormGroup,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      account: [],
      balance: [],
      delegations: [],
      feeDenom: '',
    }
  },
  computed: {
    msg() {
      const txMsgs = []
      this.delegations.forEach(i => {
        txMsgs.push({
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: this.address,
            validatorAddress: i.delegation.validator_address,
          },
        })
      })
      return txMsgs
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Withdraw Rewards',
      historyName: 'withdraw',
    })
    this.loadData()
  },

  methods: {
    loadData() {
      this.$http.getStakingDelegations(this.address).then(res => {
        this.delegations = res.delegation_responses
      })
    },
  },
}
</script>
