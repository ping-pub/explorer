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
  BRow,
  BCol,
  BInputGroup,
  BFormInput,
  BFormGroup,
} from 'bootstrap-vue'

export default {
  name: 'WithdrawCommissionDialogue',
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
    validatorAddress: {
      type: String,
      default: '',
    },
  },
  data() {
    return {

    }
  },
  computed: {
    msg() {
      return [
        {
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
          value: {
            delegatorAddress: this.address,
            validatorAddress: this.validatorAddress,
          },
        },
        {
          typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
          value: {
            validatorAddress: this.validatorAddress,
          },
        },
      ]
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Withdraw Validator Commission',
      historyName: 'withdraw',
    })
  },
  methods: {

  },
}
</script>
