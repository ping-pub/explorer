<template>
  <div>
    <b-card-code
      no-body
      title="My Delegations"
    >
      <b-table
        responsive="sm"
        :items="items"
      />
    </b-card-code>

    <b-card-code
      no-body
      title="Validators"
    >
      <b-table
        responsive="sm"
        :items="items"
      />
    </b-card-code>
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue'
import BCardCode from '@core/components/b-card-code/BCardCode.vue'

export default {
  components: {
    BCardCode,
    BTable,
  },
  data() {
    return {
      items: [
        {
          age: 40, first_name: 'Dickerson', last_name: 'Macdonald', Occupation: 'Job',
        },
        {
          age: 21, first_name: 'Larsen', last_name: 'Shaw', Occupation: 'Job',
        },
        {
          age: 89, first_name: 'Geneva', last_name: 'Wilson', Occupation: 'Bussiness',
        },
        {
          age: 38, first_name: 'Jami', last_name: 'Carney', Occupation: 'Bussiness',
        },
        {
          age: 40, first_name: 'James', last_name: 'Thomson', Occupation: 'Job',
        },
      ],
    }
  },
}
</script>
