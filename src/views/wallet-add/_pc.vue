<template>
  <div style="background: #fff;">
    <div class="wallet-add-wrap tc">
      <div>
        <div class="wallet-add-title">{{ $t('message.walletadd_Chooseaway') }}</div>
        <div
          style="display:flex;align-items:center;max-width: 480px;margin: 20px auto;"
        >
          <div
            v-if="canLedger"
            @click="
              () => {
                signType = 'ledger';
              }
            "
            class="wallet-add-item"
            :class="{ 'wallet-add-item-active': signType === 'ledger' }"
          >
            <div>
              <i class="el-icon-key"></i>
            </div>
            <div>{{ $t('message.walletadd_UseLedger') }}</div>
          </div>
          <div v-if="canLedger" style="width: 20px;"></div>
          <div
            @click="
              () => {
                signType = 'address';
              }
            "
            class="wallet-add-item"
            :class="{ 'wallet-add-item-active': signType === 'address' }"
          >
            <div>
              <i class="el-icon-postcard"></i>
            </div>
            <div>{{ $t('message.walletadd_Inputaddress') }}</div>
          </div>
        </div>
      </div>

      <template v-if="signType === 'ledger'">
        <div class="ledger-wrapper">
          <div
            style="text-align:left;background: #f5f5f5;padding: 20px;    color: rgba(0,0,0,.65);"
          >
            <div>
              <p style="font-size: 18px;font-weight: bold;">
                {{ $t('message.walletadd_Pleasefollowthesteps') }}:
              </p>
              <p>1. {{ $t('message.walletadd_1') }}</p>
              <p>2. {{ $t('message.walletadd_2') }}</p>
              <div>3. {{ $t('message.walletadd_3') }}</div>
              <div
                style="margin-left: 14px;margin-top: 10px;margin-bottom: 10px;"
              >
                <div>
                  <span style="display:inline-block;width: 60px;">{{ $t('message.walletadd_Account') }}</span>
                  <el-input-number
                    size="mini"
                    v-model="account.account"
                    :min="0"
                  ></el-input-number>
                </div>
                <div style="margin-top: 5px;">
                  <span style="display:inline-block;width: 60px;">{{ $t('message.walletadd_Index') }}</span>
                  <el-input-number
                    size="mini"
                    v-model="account.index"
                    :min="0"
                  ></el-input-number>
                </div>
              </div>
              <p>4. {{ $t('message.walletadd_Continue') }}...</p>
            </div>
          </div>
          <div style="margin: 20px;text-align:center;align-self: center;">
            <img src="/static/wallet/usb.png" style="width: 80px;" alt />
          </div>
        </div>

        <div
          style="max-width: 480px;width: 100%;margin: 0 auto;margin-bottom: 20px;"
          v-if="isWindows && isChrome && !hasHIDEnabled"
        >
          <el-alert type="warning" :closable="false" show-icon>
            <div slot="title" style="text-align:left;">
              <div>{{ $t('message.walletadd_features') }}</div>
            </div>
            <div style="text-align: left;font-size: 14px;">
              <div>
                {{ $t('message.walletadd_dueto') }}
              </div>
              <div>
                {{ $t('message.walletadd_pleasecopy') }}:
              </div>
              <p style="color: #6eb5fe">
                chrome://flags/#enable-experimental-web-platform-feature
              </p>
            </div>
          </el-alert>
        </div>

        <div style="padding-bottom: 80px;">
          <el-button
            v-if="isChrome"
            class="box-base"
            style="margin-bottom: 20px;max-width: 480px;width: 100%;"
            type="primary"
            @click="getAddress"
            block
            round
            size="large"
            :loading="loading"
            >{{ $t('message.walletadd_getmyledger') }}</el-button
          >
        </div>
      </template>

      <template v-if="signType === 'address'">
        <div style="padding-bottom: 80px;">
          <div class="wallet-add-title" style="margin-bottom: 20px;">
            {{ $t('message.walletadd_Enteraddresstoview') }}
          </div>
          <el-input
            size="large"
            class="box-base"
            v-model="address"
            :placeholder="$t('message.walletadd_pleaseinputaddress')"
            style="max-width: 480px;"
          >
            <div slot="suffix">
              <el-button
                @click="goAddress"
                type="text"
                icon="el-icon-right"
                style="padding: 8px 10px;font-size: 20px;"
              ></el-button>
            </div>
          </el-input>

          <div style="margin-top: 20px;">
            <div v-for="(item, key) of addressList" :key="key">
              <el-button
                @click="linkAddress(key)"
                size="mini"
                style="margin-top: 10px;cursor:pointer;"
                >{{ key }} <i class="el-icon-right"></i
              ></el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getAddressFromLedger } from "../../utils/ledger/getAddress";
import mixinData from "./mixinData";

export default {
  mixins: [mixinData],
  data() {
    return {
      signType: "ledger",
      loading: false,
      account: {
        account: 0,
        index: 0
      }
    };
  },
  computed: {
    hasHIDEnabled() {
      return !!window.navigator.hid;
    },
    isWindows() {
      return window.navigator.platform.indexOf("Win") > -1;
    },
    isChrome() {
      const ua = window.navigator.userAgent.toLowerCase();
      return /chrome|crios/.test(ua) && !/edge|opr\//.test(ua);
    },
    canLedger() {
      return this.isChrome;
    }
  },
  methods: {
    copyLink() {
      this.$message.success(this.$t('message.walletadd_copy'));
    },
    linkAddress(item) {
      this.address = item;
      this.goWallet();
    },
    async getAddress() {
      this.loading = true;
      try {
        this.address = await getAddressFromLedger(this.account);
        this.$message.success(`${this.$t('message.walletadd_GetAddress')}: ${this.address}`);
        this.goWallet();
      } catch (e) {
        this.$message.warning(e.message);
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.wallet-add-wrap {
  padding-top: 40px;
}
.wallet-add-title {
  color: rgb(51, 51, 66);
  line-height: 19px;
  font-size: 16px;
}
.wallet-add-item {
  flex: 1;
  padding: 10px 20px;
  border: 1px solid #eee;
  cursor: pointer;
}
.wallet-add-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.wallet-add-item-active {
  border-bottom: 4px solid #343a40;
}
.wallet-add-item i {
  font-size: 20px;
  margin-bottom: 10px;
}
.ledger-wrapper {
  display: flex;
  justify-content: center;
  background: #f5f5f5;
  border: 1px solid #ddd;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>
