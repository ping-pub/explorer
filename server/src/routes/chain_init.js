/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-13 22:38:46
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-13 23:10:45
 * @FilePath: \look-web\server\src\routes\chain_init.js
 */

const { ok, routerRun } = require("../base/utils.js");

const Chain = require("../models/chain");
const initChains = require('../initChains')

module.exports = (router) => {
  // 路由
  const uri = "/chain/init";
  // 验证
  const valid = () => {
    return [];
  };
  // 逻辑
  const logic = async (req, res) => {
    const Mainnet = initChains.Mainnet
    for (const item of Mainnet) {
      const row = new Chain({ ...item, type: 'Mainnet' });
      await row.save();
    }
    const Testnet = initChains.Testnet
    for (const item of Testnet) {
      const row = new Chain({ ...item, type: 'Testnet' });
      await row.save();
    }
    ok(res);
  };
  // 封装
  routerRun.post(router, uri, valid, logic)
};
