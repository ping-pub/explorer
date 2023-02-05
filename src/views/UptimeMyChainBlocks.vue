<template>
  <div class="px-0">
    <b-card>
      <b-card-title class="d-flex justify-content-between">
        <span class="text-uppercase"> {{ chain }} </span><small class="text-right"> {{$t('uptimeMyChainBlocks.height')}} {{ height }} </small>
      </b-card-title>
      <b-alert
        variant="danger"
        :show="syncing"
      >
        <div class="alert-body">
          <span>{{$t('uptimeMyChainBlocks.no_blocks_produced')}}<strong>{{ latestTime }}</strong> </span>
        </div>
      </b-alert>
      <b-row>
        <span
          v-if="uptime.length===0"
          class="text-danger"
        > {{$t(uptimeMyChainBlocks.not_active)}}</span>
        <b-col
          v-for="(x,index) in uptime"
          :key="index"
          sm="12"
          class="text-truncate"
        >
          <div class="d-flex justify-content-between">
            <b-form-checkbox
              v-model="pinned"
              :value="`${chain}#${x.address}`"
              class="custom-control-warning"
              @change="pinValidator(`${chain}#${x.address}`)"
            >
              <span class="d-inline-block text-truncate font-weight-bold align-bottom"> {{ x.validator.moniker }} </span>
            </b-form-checkbox>
            <span
              v-if="missing[x.address]"
            >
              <b-badge
                v-if="missing[x.address].missed_blocks_counter > 0"
                v-b-tooltip.hover.v-danger
                variant="light-danger"
                :title="`${missing[x.address].missed_blocks_counter} missed blocks`"
                class="text-danger text-bolder"
              >
                {{ missing[x.address].missed_blocks_counter }}
              </b-badge>
              <b-badge
                v-else
                v-b-tooltip.hover.v-success
                variant="light-success"
                title="Perfect! No missed blocks"
              >
                0
              </b-badge>
            </span>
          </div>
          <div class="d-flex justify-content-between align-self-stretch flex-wrap">
            <div
              v-for="(b,i) in blocks"
              :key="i"
              style="width:1.5%;"
            ><router-link :to="`./blocks/${b.height}`">
              <div
                v-b-tooltip.hover.v-second
                :title="b.height"
                :class="b.sigs && b.sigs[x.address] ? b.sigs[x.address] : 'bg-light-success'"
                class="m-auto"
              >&nbsp;</div>
            </router-link>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import {
  BRow, BCol, VBTooltip, BCard, BAlert, BCardTitle, BFormCheckbox, BBadge,
} from 'bootstrap-vue'

import {
  getLocalChains, timeIn, toDay,
} from '@/libs/utils'
import { fromBech32, toBase64 } from '@cosmjs/encoding'

export default {
  name: 'Blocks',
  components: {
    BBadge,
    BRow,
    BCol,
    BCard,
    BAlert,
    BCardTitle,
    BFormCheckbox,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    chain: {
      type: String,
      default: null,
    },
    validators: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const chains = getLocalChains()
    const pinned = localStorage.getItem('pinned') ? localStorage.getItem('pinned').split(',') : ''
    return {
      pinned,
      config: chains[this.chain],
      missing: {},
      blocks: Array.from('0'.repeat(50)).map(x => ({ sigs: {}, height: Number(x) })),
      syncing: false,
      latestTime: '',
      height: '-',
    }
  },
  computed: {
    uptime() {
      const vals = this.validators
      return vals
    },
  },
  created() {
    this.initBlocks()
    this.$http.getSlashingSigningInfo(this.config).then(res => {
      if (res.info) {
        res.info.forEach(x => {
          if (x.address) {
            const addr = toBase64(fromBech32(x.address).data)
            this.missing[addr] = x
          }
        })
      }
    })
  },
  beforeDestroy() {
    this.blocks = [] // clear running tasks if it is not finish
    this.syncing = false
    clearInterval(this.timer)
  },
  methods: {
    pinValidator() {
      localStorage.setItem('pinned', this.pinned)
    },
    initBlocks() {
      this.$http.getLatestBlock(this.config).then(d => {
        const { height } = d.block.last_commit
        this.height = height
        if (timeIn(d.block.header.time, 3, 'm')) {
          this.syncing = true
        } else {
          this.syncing = false
        }
        this.latestTime = toDay(d.block.header.time, 'long')
        const blocks = []
        // update height
        let promise = Promise.resolve()
        for (let i = height - 1; i > height - 50; i -= 1) {
          blocks.unshift({ sigs: {}, height: i > 0 ? i : 0 })
          if (i > height - 48 && i > 0) {
            promise = promise.then(() => new Promise(resolve => {
              this.fetch_status(i, resolve)
            }))
          }
        }

        const sigs = this.initColor()
        d.block.last_commit.signatures.forEach(x => {
          if (x.validator_address) sigs[x.validator_address] = 'bg-success'
        })
        blocks.push({ sigs, height })
        this.blocks = blocks

        this.timer = setInterval(this.fetch_latest, 6000)
      })
    },
    initColor() {
      const sigs = {}
      this.validators.forEach(x => {
        sigs[x.address] = 'bg-danger'
      })
      return sigs
    },
    fetch_status(height, resolve) {
      const block = this.blocks.find(b => b.height === height)
      if (block) {
        this.$http.getBlockByHeight(height, this.config).then(res => {
          resolve()
          const sigs = this.initColor()
          res.block.last_commit.signatures.forEach(x => {
            if (x.validator_address) sigs[x.validator_address] = 'bg-success'
          })
          this.$set(block, 'sigs', sigs)
        })
      }
    },
    fetch_latest() {
      this.$http.getLatestBlock(this.config).then(res => {
        const sigs = this.initColor()
        res.block.last_commit.signatures.forEach(x => {
          if (x.validator_address) sigs[x.validator_address] = 'bg-success'
        })
        this.height = res.block.last_commit.height
        const block = this.blocks.find(b => b.height === res.block.last_commit.height)
        if (typeof block === 'undefined') { // mei
          // this.$set(block, 0, typeof sigs !== 'undefined')
          if (this.blocks.length >= 50) this.blocks.shift()
          this.blocks.push({ sigs, height: res.block.last_commit.height })
        }
      })
    },
  },
}
</script>

<style></style>
