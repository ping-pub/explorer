<template>
  <b-card
    class="card-transaction"
    no-body
  >
    <b-card-header>
      <b-card-title>Outstanding Rewards</b-card-title>
      <feather-icon
        icon="MoreVerticalIcon"
        size="18"
        class="cursor-pointer"
      />
    </b-card-header>

    <b-card-body>
      <div
        v-for="d in data.self_bond_rewards"
        :key="d.amount"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar
              rounded
              size="42"
              variant="light-success"
            />
          </b-media-aside>
          <b-media-body>
            <h6 class="transaction-title">
              {{ formatNumber(d.amount) }}
            </h6>
            <small>{{ d.denom }} </small>
          </b-media-body>
        </b-media>
        <small
          class="text-success d-none d-xl-block "
        >
          Reward
        </small>
      </div>
      <div
        v-for="d in data.val_commission"
        :key="d.amount"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar
              rounded
              size="42"
              variant="light-primary"
            >
              <feather-icon
                size="18"
                icon="ServerIcon"
              />
            </b-avatar>
          </b-media-aside>
          <b-media-body>
            <h6 class="transaction-title">
              {{ formatNumber(d.amount) }}
            </h6>
            <small>{{ d.denom }}</small>
          </b-media-body>
        </b-media>
        <small
          class="text-primary d-none d-xl-block"
        >
          Commission
        </small>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BMediaBody, BMedia, BMediaAside, BAvatar,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BAvatar,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      transactionData: [
        {
          mode: 'Wallet',
          types: 'Starbucks',
          avatar: 'PocketIcon',
          avatarVariant: 'light-primary',
          payment: '-$74',
          deduction: true,
        },
        {
          mode: 'Bank Transfer',
          types: 'Add Money',
          avatar: 'CheckIcon',
          avatarVariant: 'light-success',
          payment: '+$480',
          deduction: false,
        },
        {
          mode: 'Paypal',
          types: 'Add Money',
          avatar: 'DollarSignIcon',
          avatarVariant: 'light-danger',
          payment: '+$480',
          deduction: false,
        },
        {
          mode: 'Mastercard',
          types: 'Ordered Food',
          avatar: 'CreditCardIcon',
          avatarVariant: 'light-warning',
          payment: '-$23',
          deduction: true,
        },
        {
          mode: 'Transfer',
          types: 'Refund',
          avatar: 'TrendingUpIcon',
          avatarVariant: 'light-info',
          payment: '+$98',
          deduction: false,
        },
      ],
    }
  },
  methods: {
    formatNumber(value) {
      return Number(value).toFixed(2)
    },
  },
}
</script>
