/*
 * @Description: 
     {
      "chainId": "cosmoshub-3",
      "lcd": "https://lcd.nylira.net",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "Cosmos Hub",
      "rpc": "https://rpc.nylira.net",
      "version": "0.32.7",
      "api": 'V1',
      "unit": 'ATOM',
      "prefix": 'cosmos',
      "host": isDev ? '' : 'cosmos.ping.pub'
    },
 * @Autor: dingyi
 * @Date: 2020-04-13 11:13:34
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-13 23:16:37
 * @FilePath: \look-web\server\src\models\chain.js
 */
var mongoose = require('mongoose');
const dayjs = require('dayjs')
var Schema = mongoose.Schema;

const tableSchema = new Schema({
  // 分类  Mainnet Testnet GOZ
  type: {
    type: String, index: true
  },
  // 显示名称
  name: String,
  logo: String,
  chainId: String,
  desc: String,
  lcd: String,
  rpc: String,
  version: String,
  // 接口版本  V1 类 cosmoshub  V2 类 irishub
  api: String,
  unit: String,
  prefix: String,
  host: String,
  genesis_time: Date,
  // 创建时间
  created: { type: Date, default: Date.now },
  // 更新时间
  updated: { type: Date, default: Date.now }
})

tableSchema.methods.toJSONObject = function () {
  return {
    name: this.name,
    logo: this.logo,
    code: this.code,
    created: dayjs(this.created).format('YYY MM DD HH:MM:ss'),
    updated: dayjs(this.updated).format('YYY MM DD HH:MM:ss')
  }
}

module.exports = mongoose.model("look_chain", tableSchema);
