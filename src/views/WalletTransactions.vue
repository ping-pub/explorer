<template>
  <div>
    <b-table
      :items="deleTable"
      stacked="sm"
    >
      <template #cell(action)="data">
        <!-- size -->
        <b-button-group
          size="sm"
        >
          <b-button
            v-b-modal.delegate-window
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-tooltip.hover.top="'Delegate'"
            variant="outline-primary"
            @click="selectValue(data.value)"
          >
            <feather-icon icon="LogInIcon" />
          </b-button>
          <b-button
            v-b-modal.redelegate-window
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-tooltip.hover.top="'Redelegate'"
            variant="outline-primary"
            @click="selectValue(data.value)"
          >
            <feather-icon icon="ShuffleIcon" />
          </b-button>
          <b-button
            v-b-modal.unbond-window
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            v-b-tooltip.hover.top="'Unbond'"
            variant="outline-primary"
            @click="selectValue(data.value)"
          >
            <feather-icon icon="LogOutIcon" />
          </b-button>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script>
import {
  BButton, VBTooltip, BTable,
} from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BTable,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  created() {
    
  },
}
</script>
