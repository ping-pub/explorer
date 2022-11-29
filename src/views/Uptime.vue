<template>
  <div class="px-0">
    <b-tabs>
      <b-tab title="Group By Validator">
        <b-card>
          <b-alert
            variant="danger"
            :show="syncing"
          >
            <div class="alert-body">
              <span>No new blocks have been produced since  <strong>{{ latestTime }}</strong> </span>
            </div>
          </b-alert>
          <b-card
            no-body
            class="mb-1"
          >
            <b-row>
              <b-col md="3">
                <h4>#{{ height }}</h4>
              </b-col>
              <b-col md="9">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-form-checkbox
                      v-model="missedFilter"
                      v-b-tooltip.hover
                      title="Only missed blocks"
                      name="viewMissed"
                    />
                  </b-input-group-prepend>
                  <b-form-input
                    v-model="query"
                    placeholder="Keywords to filter validators"
                  />
                  <b-input-group-append>
                    <b-button
                      to="./uptime/my"
                      variant="primary"
                    >
                      Favorite
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
          </b-card>
          <b-row>
            <b-col
              v-for="(x,index) in uptime"
              :key="index"
              sm="12"
              md="4"
              xl="3"
              class="text-truncate"
            >
              <div class="d-flex justify-content-between">
                <b-form-checkbox
                  v-model="pinned"
                  :value="`${chain}#${x.address}`"
                  class="custom-control-warning text-truncate"
                  @change="pinValidator(`${chain}#${x.address}`)"
                ><span class="d-inline-block text-truncate font-weight-bold align-bottom">{{ index+1 }} {{ x.validator.moniker }}</span>
                </b-form-checkbox>
                <span v-if="missing[x.address]">
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
              <b-skeleton-wrapper :loading="loading">
                <template #loading>
                  <b-skeleton width="100%" />
                </template>
                <template #default>
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
                </template>
              </b-skeleton-wrapper>
            </b-col>
          </b-row>
        </b-card>
      </b-tab>
      <b-tab title="Group By Proposer">
        <b-card>
          <b-row>
            <b-col
              md="3"
              sm="12"
            >
              <h4>#{{ height }}</h4>
            </b-col>
            <b-col
              md="3"
              sm="12"
            >
              <b-input-group
                prepend="Fetch Frequency"
              >
                <b-form-select
                  id="frequency"
                  v-model="frequency"
                  placeholder="Frequency to fetch data"
                  @change="onFrequencyChange()"
                >
                  <b-form-select-option value="6000">
                    6s
                  </b-form-select-option>
                  <b-form-select-option value="2000">
                    2s
                  </b-form-select-option>
                  <b-form-select-option value="1000">
                    1s
                  </b-form-select-option>
                </b-form-select>
              </b-input-group>
            </b-col>
            <b-col
              sm="12"
              md="6"
            >
              <b-input-group
                prepend="Qty of absent validators"
              >
                <b-form-input
                  id="threshold"
                  v-model="threshold"
                  placeholder="Absent validator number in blocks"
                />
              </b-input-group>
            </b-col>
          </b-row>

        </b-card>

        <b-row>
          <b-col
            v-for="(x, i) in proposerViewData"
            :key="i"
            md="4"
            sm="12"
            class="text-truncate"
          >
            {{ x.name }}
            <b-badge
              v-if="x.proposed > 0"
              v-b-tooltip.hover.v-second
              :title="x.proposed > 0?`${ Number(x.counter / x.proposed * 100).toFixed(2) } %`:''"
              :variant="x.counter > 0 ? 'light-danger': 'light-success'"
            >
              {{ x.counter }} / {{ x.proposed }}
            </b-badge>
          </b-col>
        </b-row>

      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import {
  BSkeleton, BSkeletonWrapper, BInputGroupAppend, BTabs, BTab, BFormGroup, BFormSelect, BFormSelectOption,
  BRow, BCol, VBTooltip, BFormInput, BCard, BAlert, BFormCheckbox, BButton, BBadge, BInputGroup, BInputGroupPrepend,
} from 'bootstrap-vue'

import {
  consensusPubkeyToHexAddress, getCachedValidators, timeIn, toDay,
} from '@/libs/utils'
import { fromBech32, fromHex, toBase64 } from '@cosmjs/encoding'

export default {
  components: {
    BRow,
    BCol,
    BFormInput,
    BFormGroup,
    BCard,
    BAlert,
    BButton,
    BBadge,
    BFormCheckbox,
    BFormSelect,
    BFormSelectOption,
    BInputGroup,
    BSkeleton,
    BSkeletonWrapper,
    BInputGroupPrepend,
    BInputGroupAppend,
    BTabs,
    BTab,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    const { chain } = this.$route.params
    const pinned = localStorage.getItem('pinned') ? localStorage.getItem('pinned').split(',') : ''
    return {
      height: 0,
      loading: true,
      missedFilter: false,
      pinned,
      chain,
      query: '',
      validators: [],
      missing: {},
      blocks: Array.from('0'.repeat(50)).map(x => ({ sigs: {}, height: Number(x) })),
      syncing: false,
      latestTime: '',
      threshold: 10,
      proposers: {},
      absentValsInBlock: {},
      numOfBlock: 1000,
      temp: 0,
      frequency: 6000,
    }
  },
  computed: {
    uptime() {
      const vals = this.query ? this.validators.filter(x => String(x.description.moniker).indexOf(this.query) > -1) : this.validators
      vals.sort((a, b) => b.delegator_shares - a.delegator_shares)
      const rets = vals.map(x => ({
        validator: x.description,
        address: this.hex2base64(consensusPubkeyToHexAddress(x.consensus_pubkey)),
      }))
      if (this.missedFilter) {
        return rets.filter(x => this.missing[x.address].missed_blocks_counter > 0)
      }
      return rets
    },
    // Compose data for group by proposer
    proposerViewData() {
      const valCounter = {}
      this.validators.forEach(x => {
        valCounter[this.hex2base64(consensusPubkeyToHexAddress(x.consensus_pubkey))] = {
          name: x.description.moniker,
          counter: 0,
          proposed: 0,
        }
      })
      Object.keys(this.proposers).forEach(height => {
        const num = this.absentValsInBlock[height] || 0
        if (valCounter[this.proposers[height]]) {
          if (num > this.threshold) {
            valCounter[this.proposers[height]].counter += 1 // (num >= Number(this.threshold) ? 1 : 0)
          }
          valCounter[this.proposers[height]].proposed += 1
        }
      })
      return Object.values(valCounter).sort((a, b) => b.counter - a.counter)
    },
  },
  created() {
    const cached = JSON.parse(getCachedValidators(this.$route.params.chain))
    if (cached) {
      this.validators = cached
    }
    this.fetchMissingInfo()
    this.$http.getValidatorList().then(res => {
      this.validators = res
    })

    this.initBlocks()
  },
  beforeDestroy() {
    this.blocks = [] // clear running tasks if it is not finish
    this.syncing = false
    clearInterval(this.timer)
  },
  methods: {
    fetchMissingInfo() {
      this.$http.getSlashingSigningInfo().then(res => {
        if (res.info) {
          res.info.forEach(x => {
            if (x.address) {
              const hex = toBase64(fromBech32(x.address).data)
              this.missing[hex] = x
            }
          })
        }
      })
    },
    pinValidator() {
      localStorage.setItem('pinned', this.pinned)
    },
    initBlocks() {
      this.$http.getLatestBlock().then(d => {
        const { height } = d.block.last_commit
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

        this.timer = setInterval(this.fetch_latest, this.frequency)
        this.loading = false
      })
    },
    initColor() {
      const sigs = {}
      this.validators.forEach(x => {
        sigs[this.hex2base64(consensusPubkeyToHexAddress(x.consensus_pubkey))] = 'bg-danger'
      })
      return sigs
    },
    onFrequencyChange() {
      clearInterval(this.timer)
      this.timer = setInterval(this.fetch_latest, this.frequency)
    },
    hex2base64(v) {
      return toBase64(fromHex(v))
    },
    fetch_status(height, resolve) {
      this.$http.getBlockByHeight(height).then(res => {
        resolve()
        const block = this.blocks.find(b => b.height === height)
        // update valiators states
        if (block) {
          const sigs = this.initColor()
          res.block.last_commit.signatures.forEach(x => {
            if (x.validator_address) sigs[x.validator_address] = 'bg-success'
          })
          this.$set(block, 'sigs', sigs)
        }

        // update proposer states
        this.count(res.block)
      })
    },
    /// count how many absent valiators in a block
    count(block) {
      const count = block.last_commit.signatures.reduce((p, c) => (c.block_id_flag !== 'BLOCK_ID_FLAG_COMMIT' ? p + 1 : p), 0)
      // Notes: block.header.height == last_commint.height + 1
      this.$set(this.proposers, block.header.height, block.header.proposer_address)
      this.$set(this.absentValsInBlock, block.last_commit.height, count)
      if (count >= this.threshold) {
        this.temp += 1
      }
    },
    fetch_latest() {
      this.$http.getLatestBlock().then(res => {
        const sigs = this.initColor()
        res.block.last_commit.signatures.forEach(x => {
          if (x.validator_address) sigs[x.validator_address] = 'bg-success'
        })
        this.height = res.block.header.height
        if (Number(this.height) % 100 === 0) { // update the missing number each 100
          this.fetchMissingInfo()
        }
        const block = this.blocks.find(b => b.height === res.block.last_commit.height)
        if (typeof block === 'undefined') { // mei
          // this.$set(block, 0, typeof sigs !== 'undefined')
          if (this.blocks.length >= 50) this.blocks.shift()
          this.blocks.push({ sigs, height: res.block.last_commit.height })
        }
        this.count(res.block)
      })
    },
  },
}
</script>

<style></style>
