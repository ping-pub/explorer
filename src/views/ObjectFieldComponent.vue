<template>
  <b-table-simple
    v-if="typeof tablefield === 'object'"
    hover
    small
    striped
    responsive
  >
    <b-tr
      v-for="(value, name) in tablefield"
      :key="name"
    >
      <b-td
        style="text-transform: capitalize; vertical-align: top; width:200px"
      >
        {{ name }}
      </b-td>
      <b-td v-if="isTokenField(value)">
        {{ formatTokens( value ) }}
      </b-td>
      <b-td v-else-if="Array.isArray(value)">
        <array-field-component :tablefield="value" />
      </b-td>
      <b-td
        v-else-if="typeof (value) ==='object'"
        hover
      >
        <b-tabs>
          <b-tab
            v-for="key in Object.keys(value)"
            :key="key"
            :title="key"
            variant="danger"
          >
            <array-field-component
              v-if="Array.isArray(value[key])"
              :tablefield="value[key]"
            />
            <object-field-component
              v-else-if="typeof value[key] === 'object'"
              :tablefield="value[key]"
            />
            <span v-else>{{ formatText(value[key]) }} </span>
          </b-tab>
        </b-tabs>
      </b-td>
      <b-td v-else>
        {{ formatText(value) }}
      </b-td>
    </b-tr>
  </b-table-simple>
</template>

<script>
import {
  BTableSimple, BTr, BTd, BTabs, BTab,
} from 'bootstrap-vue'
import { abbr, isToken, tokenFormatter } from '@/libs/data'
import ArrayFieldComponent from './ArrayFieldComponent.vue'

export default {
  name: 'ObjectFieldComponent',
  components: {
    BTableSimple,
    BTr,
    BTd,
    BTabs,
    BTab,
    ArrayFieldComponent,
  },
  props: {
    tablefield: {
      type: [Array, Object],
      default: () => {},
    },
  },
  methods: {
    formatObject(value) {
      // console.log(value, typeof (value) === 'object', Object.keys(value))
      // if (typeof (value) === 'object' && Object.keys(value).length === 1) {
      //   console.log(value)
      //   return value[Object.keys(value)[0]]
      // }
      return value
    },
    formatText: v => abbr(v, 60),
    eval_value(value) {
      return Array.from(value)
    },
    isTokenField(value) {
      return isToken(value)
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
  },
}
</script>

<style scoped>

</style>
