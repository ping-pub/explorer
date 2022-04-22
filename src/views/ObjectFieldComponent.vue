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
          {{ name }}
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
              :title="key"
              class="pl-0 pr-0"
              title-item-class="bg-light-primary"
              style="padding: 0px;"
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
              <span v-else>{{ value[key] }}</span>
            </b-tab>
          </b-tabs>
        </b-td>
        <b-td v-else>
          <markdown-view-vue
            v-if="name==='description'"
            class="md-body"
            :options="options"
            :content="addNewLine(value)"
          />
          <span v-else>{{ value }}</span>
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
import MarkdownViewVue from './components/markdown/MarkdownView.vue'
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
    MarkdownViewVue,
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
      return isToken(value)
    },
    isHex(value) {
      return isHexAddress(value)
    },
    formatHexAddress(v) {
      return getStakingValidatorByHex(this.$http.config.chain_name, v)
    },
    isArrayText(value) {
      return isStringArray(value)
    },
    formatTokens(value) {
      return tokenFormatter(value)
    },
    addNewLine(value) {
      const percentage = /^0\.\d+/
      if (percentage.test(value)) {
        return `${percent(value)}%`
      }
      if (typeof value === 'string') {
        return value.replaceAll('\\n', '\n')
      }

      return value
    },
  },
}
</script>

<style lang='css' scoped>
@media (min-width: 768px) {
  td:first-child { width: 20% ;}
}
</style>
