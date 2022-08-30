<template>
  <div class="container-md">
    <b-card>
      <b-card-title>
        What's State Sync?
      </b-card-title>
      The Tendermint Core 0.34 release includes support for state sync, which allows a new node to join a network by fetching a snapshot of the application state at a recent height instead of fetching and replaying all historical blocks. This can reduce the time needed to sync with the network from days to minutes.
      Click <a href="https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f">here</a> for more infomation.
    </b-card>
    <b-card>
      <b-card-title>
        Starting New Node From State Sync
      </b-card-title>
      <b class="mt-1">1. Install Binary (Version: {{ app_version }})</b><br>
      We need to install the binary first and make sure that the version is the one currently in use on mainnet.
      <br><br>
      <b class="mt-1">2. Enable State Sync</b><br>
      We can configure Tendermint to use state sync in <code>$DAEMON_HOME/config/config.toml</code>.
      <ul class="mt-1">
        <li
          v-for="e in error"
          :key="e"
          class="text-danger"
        >
          {{ e }}
        </li>
      </ul>
      <b-form-textarea
        id="textarea-state"
        v-model="state"
        :state="valid"
        readonly
        placeholder="Loading..."
        rows="7"
        class="my-1"
        @change="check()"
      />
      <b class="mt-1">3. Start the daemon: <span v-if="daemon"><code>{{ daemon }} start</code></span></b><br>
      If you are resetting node, run <code>{{ daemon }} unsafe-reset-all</code> or <code>{{ daemon }} tendermint unsafe-reset-all --home ~/.HOME</code> before you start the daemon.
    </b-card>

    <b-card>
      <b-card-title>
        Enable Snapshot For State Sync
      </b-card-title>
      To make state sync works, we can enable snapshot in <code>$DAEMON_HOME/config/app.toml</code>
      <b-form-textarea
        id="snapshot"
        v-model="snapshot"
        readonly
        rows="8"
        class="mt-1"
      />
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BCardTitle, BFormTextarea,
} from 'bootstrap-vue'
import { fromBase64, toHex } from '@cosmjs/encoding'

export default {
  components: {
    BCard,
    BCardTitle,
    BFormTextarea,
  },
  data() {
    const { rpc, snapshot_provider } = this.$store.state.chains.selected
    let servers = ''
    if (rpc && Array.isArray(rpc) && rpc.length > 0) {
      let serv = rpc
      if (serv.length === 1) {
        serv = serv.concat(serv)
      }
      servers = serv.map(x => {
        const url = new URL(x)
        if (url.port === '') {
          return `${url.protocol}//${url.hostname}:${url.protocol.startsWith('https') ? '443' : '80'}`
        }
        return `${url.protocol}//${url.hostname}:${url.port}`
      }).join(',')
    }
    // eslint-disable-next-line camelcase
    const peers = snapshot_provider
    const providers = peers
      ? `# Comma separated list of nodes to keep persistent connections to \npersistent_peers = "${peers}" `
      : 'OMG！ There is NO available providers, but you can try it.'
    return {
      app_version: '',
      snapshot_provider,
      servers,
      providers,
      height: 0,
      hash: '',
      error: [],
      state: '',
      valid: false,
      daemon: '',
      snapshot: `[state-sync]
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable). Must be a multiple of pruning-keep-every.
snapshot-interval = 1000

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all). Each snapshot is about 500MiB
snapshot-keep-recent = 2`,
    }
  },
  created() {
    const interval = 1000
    this.$http.getLatestBlock().then(l => {
      const { height } = l.block.header
      if (height > interval * 3) {
        this.$http.getBlockByHeight(Math.trunc((height - 3 * interval) / interval) * interval).then(x => {
          this.hash = toHex(fromBase64(x.block_id.hash))
          this.height = x.block.header.height
          this.state = `[statesync]
enable = true
rpc_servers = "${this.servers}"
trust_height = ${this.height}
trust_hash = "${this.hash}"
trust_period = "168h"  # 2/3 of unbonding time`
          this.check()
        })
      }
      this.$http.getNodeInfo().then(res => {
        this.app_version = res.application_version.version
        this.daemon = res.application_version.app_name
      }).catch()
    })
  },
  methods: {
    check() {
      this.valid = true
      this.error = []
      this.state.split('\n').forEach(element => {
        const v = this.kv(element)
        if (v[0] === 'trust_height' && Number(v[1]) < 1) {
          this.valid = false
          this.error.push('Trust Height should be set.')
        }
        if (v[0] === 'trust_hash' && v[1].length < 10) {
          this.valid = false
          this.error.push('Trust Hash is invalid.')
        }
        if (v[0] === 'rpc_servers') {
          if (v[1].indexOf(',') > 1) {
            v[1].replace(/"/g, '').split(',').forEach(host => {
              const re = /^(.)+:\d+$/g
              if (!re.test(host)) {
                this.valid = false
                this.error.push(`"${host}" is not a valid host. Make sure that the port is added.`)
              }
            })
            // valid = true
          } else {
            this.valid = false
            this.error.push('No RPC serser is configured.')
          }
        }
      })
      return this.valid
    },
    kv(line) {
      if (line && line.indexOf('=') > 0) {
        const s = line.split('=')
        return [s[0].trim(), s[1].trim()]
      }
      return []
    },
  },
}
</script>
