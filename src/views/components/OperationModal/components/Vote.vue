<template>
  <div>
    <b-row>
      <b-col>
        <h4>{{ proposalId }}. {{ proposalTitle }}</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Voter"
          label-for="Account"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Voter"
          >
            <b-form-input
              v-model="address"
              readonly
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group
          label="Option"
          label-for="option"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="option"
          >
            <div class="demo-inline-spacing">

              <b-form-radio
                v-model="option"
                name="option"
                value="1"
                class="custom-control-success"
              >
                Yes
              </b-form-radio>
              <b-form-radio
                v-model="option"
                name="option"
                value="3"
                class="custom-control-warning"
              >
                No
              </b-form-radio>
              <b-form-radio
                v-model="option"
                name="option"
                value="4"
                class="custom-control-danger"
              >
                No With Veto
              </b-form-radio>
              <b-form-radio
                v-model="option"
                name="option"
                value="2"
                class="custom-control-secondary"
              >
                Abstain
              </b-form-radio>
            </div>
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BRow, BCol, BFormGroup, BFormInput,
  BFormRadio,
} from 'bootstrap-vue'
import {
  required, email, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import {
  formatToken,
} from '@/libs/utils'

export default {
  name: 'VoteDialogue',
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormRadio,
    ValidationProvider,
    BFormInput,
  },
  props: {
    proposalId: {
      type: Number,
      required: true,
    },
    proposalTitle: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      option: null,

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
      return [{
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          voter: this.address,
          proposalId: this.proposalId,
          option: Number(this.option),
        },
      }]
    },
  },
  mounted() {
    this.$emit('update', {
      modalTitle: 'Vote',
      historyName: 'vote',
    })
  },
  methods: {

    format(v) {
      return formatToken(v)
    },

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
