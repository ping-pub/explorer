/*
 * @Description: 创建链
 * @Autor: dingyi
 * @Date: 2020-04-13 11:20:07
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-25 21:59:43
 * @FilePath: \look-web\server\src\routes\chain_create.js
 */

const { ok, routerRun } = require("../base/utils.js");
const { body } = require("express-validator");

const Chain = require("../models/chain");

module.exports = (router) => {
  // 路由
  const uri = "/chain/create";
  // 验证
  const valid = () => {
    return [
      body("name").notEmpty(),
      body("lcd").notEmpty(),
      body("rpc").notEmpty(),
      body("api").notEmpty(),
      body("type").notEmpty()
    ];
  };
  // 逻辑
  const logic = async (req, res) => {
    const row = new Chain({ ...req.body });
    await row.save();
    ok(res);
  };
  // 封装
  routerRun.post(router, uri, valid, logic)
};
