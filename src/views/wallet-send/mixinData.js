/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @LastEditTime: 2020-03-08 22:58:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /look/src/views/wallet-send/mixinData.js
 */
import { uatoms, atoms, shortDecimals } from "../../utils/num";
import { toMicroDenom } from "../../utils/common";
import { MsgSend } from "../../utils/ledger/getTx";
import bigNumber from "bignumber.js";

export default {
  created() {
    const { address } = this.$route.query;
    if (!address) return;
    this.address = address;
    this.initAccount(address);
    this.getAuthAccounts();
  },
  data() {
    return {
      available: 0,
      noticOk: '',
      noticeMsg: "",
      form: {
        amount: 0,
        toAddress: "",
        memo: this.$t('message.walletsend_memodefault') 
      },
      address: "",
      account: {
        account_number: "",
        sequence: "",
        coins: [],
        type: ""
      },
      step: "form",
      loading: false,
      gas: 3575,
      tx: null,
      txhash: "",
      numAccount: 0,
      numIndex: 0
    };
  },
  filters: {
    shortAddress(val) {
      return val.substr(0, 12) + "..." + val.substr(-12, 12);
    }
  },
  computed: {
    subTotal() {
      if (this.gas) {
        const total = new bigNumber(atoms(Number(this.gas))).plus(
          this.form.amount
        );
        return total;
      }
    },
    gasAtom() {
      return atoms(Number(this.gas));
    }
  },
  methods: {
    async initAccount(address) {
      this.loading = true;
      const res = await this.$api.fetch("getAuthAccounts", { address });
      this.loading = false;
      this.account = res;
    },
    setMax() {
      const amount = new bigNumber(this.available).minus(this.gasAtom);
      this.form.amount = Number(amount);
    },
    sendByLedger() {
      if (!this.form.toAddress || !this.form.amount) {
        this.noticeMsg = this.$t('message.walletsend_Pleaseinputform') ;
        return;
      }
      this.signLedger();
    },
    async signLedger() {
      this.loading = true
      const { toAddress, memo, amount } = this.form;
      const { account_number, sequence } = this.account;
      const denom = toMicroDenom(window.chain.unit);
      const amounts = [{ amount: uatoms(amount), denom }];
      const senderAddress = this.address;
      const gas = this.gas;
      const signedMsg = {
        senderAddress,
        toAddress,
        amounts,
        memo,
        account_number,
        sequence,
        gas,
        amount: uatoms(amount),
        account: this.numAccount,
        index: this.numIndex
      };
      let txBroadcast;
      this.step = 'load'
      try {
        txBroadcast = await MsgSend(signedMsg);
      } catch (e) {
        this.noticeMsg = e.message;
        this.loading = false
        this.goSend()
      }
      if (!txBroadcast) return;
      const res = await this.$api.fetch("postTxs", { txBroadcast });
      if (!res.txhash) {
        this.step = "error";
        return;
      }
      // "1F36030BBA08D54ACACDB36CBF382223E9B6A6E19F6433748A540257BF640C9B"
      const txhash = res.txhash;
      this.txhash = txhash;
      this.noticOk = this.$t('message.walletsend_successfulsignature') 
      setTimeout(async () => {
        await this.checkTx();
      }, 10000)
    },
    async checkTx() {
      this.loading = true;
      // 去查 txhash 是否有内容即可
      let txResult;
      try {
        txResult = await this.$api.fetch("getTxsHash", {
          hash: this.txhash
        });
      } catch (e) {
        console.log(e);
        txResult = e;
      }
      this.loading = false
      // error
      if (!txResult) {
        this.step = "warn";
      }
      // ok
      if (txResult.height) {
        this.step = "ok";
        this.tx = txResult;
      }
    },
    async getAuthAccounts() {
      const address = this.address;
      this.loading = true;
      const res = await this.$api.fetch("getAuthAccounts", { address });
      if (!res) return;
      this.available = Number(res.available);
      this.loading = false;
    },
    goSend() {
      this.step = "form";
      // TODO: clear form data
    }
  }
};
