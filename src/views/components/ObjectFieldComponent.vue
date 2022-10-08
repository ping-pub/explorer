<template>
  <b-table-simple
    v-if="typeof tablefield === 'object'"
    hover
    :small="small"
    striped
    stacked="sm"
    responsive="sm"
  >
    <b-tbody>
      <b-tr
        v-for="(value, name) in tablefield"
        :key="name"
      >
        <b-td
          style="text-transform: capitalize; vertical-align: top;"
        >
          {{ formatTitle(name) }}
        </b-td>
        <b-td v-if="isTokenField(value)">
          {{ formatTokens( value ) }}
        </b-td>
        <b-td v-else-if="isArrayText(value)">
          {{ value.join(', ') }}
        </b-td>
        <b-td v-else-if="isHex(value)">
          {{ formatHexAddress(value) }}
        </b-td>
        <b-td v-else-if="Array.isArray(value)">
          <array-field-component :tablefield="value" />
        </b-td>
        <b-td
          v-else-if="typeof (value) ==='object'"
          hover
          class="overflow-hidden"
        >
          <b-tabs
            v-if="value"
            small
          >
            <b-tab
              v-for="key in Object.keys(value)"
              :key="key"
              :title="formatTitle(key)"
              class="p-0 text-capitalize"
              title-item-class="bg-light-primary"
            >
              <array-field-component
                v-if="Array.isArray(value[key])"
                :tablefield="value[key]"
              />
              <object-field-component
                v-else-if="typeof value[key] === 'object'"
                :tablefield="value[key]"
              />
              <object-field-component
                v-else-if="isObjectText(value[key])"
                :tablefield="toObject(value[key])"
              />
              <div
                v-else
                style="max-width: 800px; max-height: 300px; overflow: auto;"
              >{{ value[key] }}</div>
            </b-tab>
          </b-tabs>
        </b-td>
        <b-td v-else>
          <VueMarkdown v-if="name==='description'">
            {{ addNewLine(value) }}
          </VueMarkdown>
          <div
            v-else
            style="max-width: 800px; max-height: 300px; overflow: auto;"
          >{{ value }}</div>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import {
  BTableSimple, BTr, BTd, BTabs, BTab, BTbody,
} from 'bootstrap-vue'
import {
  abbr, getStakingValidatorByHex, isHexAddress, isStringArray, isToken, percent, tokenFormatter,
} from '@/libs/utils'
import VueMarkdown from 'vue-markdown'
import ArrayFieldComponent from './ArrayFieldComponent.vue'

export default {
  name: 'ObjectFieldComponent',
  components: {
    BTableSimple,
    BTr,
    BTd,
    BTabs,
    BTab,
    BTbody,
    ArrayFieldComponent,
    VueMarkdown,
  },
  props: {
    tablefield: {
      type: [Array, Object],
      default: () => {},
    },
    small: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: {
        markdownIt: {
          linkify: true,
        },
        linkAttributes: {
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        },
      },
    }
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
    formatTitle: v => v.replaceAll('_', ' '),
    isObjectText(v) {
      return String(v).startsWith('{') && String(v).endsWith('}')
    },
    toObject(v) {
      return JSON.parse(v)
    },
    formatText: v => abbr(v, 60),
    eval_value(value) {
      return Array.from(value)
    },
    isTokenField(value) {
      return value ? isToken(value) : false
    },
    isHex(value) {
      return value ? isHexAddress(value) : false
    },
    formatHexAddress(v) {
      return getStakingValidatorByHex(this.$http.config.chain_name, v)
    },
    isArrayText(value) {
      return value ? isStringArray(value) : false
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
    addNewLine(value) {
      const percentage = /^0\.\d+/
      if (percentage.test(value)) {
        return `${percent(value)}%`
      }
      return value ? value.replace(/(?:\\[rn])+/g, '\n') : '-'
    },
  },
}
</script>

<style lang='css' scoped>
@media (min-width: 768px) {
  td:first-child { width: 20% ;}
}
</style>
