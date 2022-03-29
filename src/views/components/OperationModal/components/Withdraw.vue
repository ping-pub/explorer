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
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'

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
      selectedChain: '',
      balance: [],
      delegations: [],
      feeDenom: '',

      required,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
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
        console.log(res)
        this.delegations = res.delegation_responses
      })
    },
  },
}
</script>
