<template>
  <div>
    <b-card-code
      no-body
      title="My Delegations"
    >
      <b-table
        responsive="sm"
        :items="delegations"
        :fields="validator_fields"
      />
    </b-card-code>

    <b-card-code
      no-body
      title="Validators"
    >
      <b-table
        responsive="sm"
        striped
        :items="validators"
        :fields="validator_fields"
        :sort-desc="true"
        sort-by="tokens"
      >
        <!-- Column: Validator -->
        <template #cell(description)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                icon="ChevronRightIcon"
                variant="light-primary"
                :src="data.item.avatar"
              />
            </template>
            <span class="font-weight-bold d-block text-nowrap">
              {{ data.item.description.moniker }}
            </span>
            <small class="text-muted">{{ data.item.description.website || data.item.description.identity }}</small>
          </b-media>
        </template>
      </b-table>
    </b-card-code>
  </div>
</template>

<script>
import { BTable, BMedia, BAvatar } from 'bootstrap-vue'
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import { Validator, percent } from '@/libs/data'
import { keybase } from '@/libs/fetch'

export default {
  components: {
    BCardCode,
    BTable,
    BMedia,
    BAvatar,
  },
  data() {
    return {

      sortBy: 'tokens',
      sortDesc: true,
      validators: [new Validator()],
      delegations: [new Validator()],
      validator_fields: [
        { key: 'description', label: 'Validator', sortable: true },
        {
          key: 'tokens',
          sortable: true,
          formatter: value => parseInt(value / 100000, 0),
          tdClass: 'text-right',
          thClass: 'text-right',
          sortByFormatted: true,
        },
        {
          key: 'commission',
          sortable: true,
          formatter: value => `${percent(value.rate)}%`,
          tdClass: 'text-right',
          thClass: 'text-right',
        },
        { key: 'delegator_shares', sortable: true },
      ],
    }
  },
  created() {
    this.$http.getValidatorList().then(res => {
      this.validators = res
      this.validators.forEach(i => {
        if (i.description.identity) {
          keybase(i.description.identity).then(d => {
            if (Array.isArray(d.them) && d.them.length > 0) {
              console.log(d.them[0].pictures.primary.url)
              const validator = this.validators.find(u => u.description.identity === i.description.identity)
              validator.avatar = d.them[0].pictures.primary.url
            }
          })
        }
      })
    })
  },
}
</script>
