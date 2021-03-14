/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @LastEditTime: 2020-03-08 22:58:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /look/src/views/wallet-send/mixinData.js
 */
import { uatoms, atoms, shortDecimals } from '../../utils/num'
import { toMicroDenom } from '../../utils/common'
import { getTx, getMsg } from '../../utils/ledger/getTx'

export default {
  created() {
    const { address } = this.$route.query;
    if (!address) return
    this.address = address;
    this.initAccount(address)
  },
  data() {
    return {
      form: {
        amount: 0.5,
        toAddress: "cosmos1ugnvz4mx7gnxh3qah8m3e2e9gn5t8twtuyjta5",
        memo: "send by look.ping.pub"
      },
      address: "",
      account: {
        account_number: '', sequence: '', coins: [], type: ''
      },
      step: 0,
      loading: false,
      gas: ''
    }
  },
  filters: {
    shortAddress(val) {
      return val.substr(0, 12) + '...' + val.substr(-12, 12)
    }
  },
  computed: {
    subTotal() {
      if (this.gas) {
        const total = Number(atoms(Number(this.gas))) + Number(this.form.amount)
        return total
      }
    },
    gasAtom() {
      return atoms(Number(this.gas))
    }
  },
  methods: {
    async initAccount(address) {
      this.loading = true
      const res = await this.$api.fetch('getAuthAccounts', { address })
      this.loading = false
      this.account = res
    },
    // 第一步 => 第二步 计算 gas
    async nextGasCommon() {
      this.loading = true
      const { account_number, sequence } = this.account
      // const res = await this.$api.fetch('postBankAccountsTransfers', {
      //   address: this.address,
      //   chain_id: 'cosmoshub-3',
      //   account_number,
      //   sequence,
      //   amount: uatoms(this.form.amount),
      //   denom: toMicroDenom('ATOM'),
      //   memo: this.form.memo,
      //   simulate: false
      // })
      // console.log(res)
      this.loading = false
      // this.gas = res
      this.step += 1
    },
    async nextSignCommon() {
      const { toAddress, memo, amount } = this.form
      const { account_number, sequence } = this.account
      const denom = 'uatom'
      const msgFunc = getMsg()
      const msg = msgFunc.MsgSend(this.address,
        {
          toAddress,
          amounts: [{ amount, denom }]
        })

      const txBroadcast = await getTx({
        account_number, sequence, memo, gas: this.gas,
        msg
      })
      const res = await this.$api.fetch('postTxs', { txBroadcast })
    }
  }
}
