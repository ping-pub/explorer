/*
 * @Description: 查询链
 * @Autor: dingyi
 * @Date: 2020-04-13 11:20:07
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-15 22:34:02
 * @FilePath: /look-web/server/src/routes/chain.js
 */

const { ok, routerRun } = require("../base/utils.js");

const Chain = require("../models/chain");

module.exports = (router) => {
  // 路由
  const uri = "/chain/list";
  // 验证
  const valid = () => {
    return [
    ];
  };
  // 逻辑
  const logic = async (req, res) => {
    const rows = await Chain.find().exec()
    ok(res, rows);
  };
  // 封装
  routerRun.post(router, uri, valid, logic)
};
