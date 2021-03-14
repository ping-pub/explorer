import localforage from "localforage";
import dayjs from "dayjs";

export default {
  data() {
    return {
      address: "",
      addressList: {}
    };
  },
  created() {
    this.initAddressList()
  },
  methods: {
    async initAddressList() {
      this.addressList = await localforage.getItem("addressList")
    },
    goAddress() {
      if (!this.address) {
        this.$message.error({
          message: "Please enter an address or use ledger."
        });
        return;
      }
      this.goWallet();
    },
    goWallet() {
      window.sessionStorage.setItem("address", this.address);
      this.saveLocalAddress();
      this.$router.push("/wallet?address=" + this.address);
    },
    // 添加地址到本地存储
    async saveLocalAddress() {
      const address = this.address;
      let addressList = await localforage.getItem("addressList");
      if (!addressList) {
        addressList = {};
      }
      addressList[address] = dayjs().format("YYYY MM-DD HH:mm");
      await localforage.setItem("addressList", addressList);
    }
  }
};
