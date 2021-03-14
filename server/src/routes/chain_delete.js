/*
 * @Description: 创建链
 * @Autor: dingyi
 * @Date: 2020-04-13 11:20:07
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-15 22:26:50
 * @FilePath: /look-web/server/src/routes/chain_delete.js
 */

const { ok, routerRun } = require("../base/utils.js");
const { body } = require("express-validator");
const mongoose = require('mongoose');

const Chain = require("../models/chain");

module.exports = (router) => {
  // 路由
  const uri = "/chain/delete";
  // 验证
  const valid = () => {
    return [
      body("lookpwd").notEmpty(),
      body("ids").notEmpty(),
      body("lookpwd").custom(async (value, { req }) => {
        if (value !== "@ping@dddd")
          throw new Error("密码错误");
        return true;
      }),
    ];
  };
  // 逻辑
  const logic = async (req, res) => {
    const ids = req.body.ids
    for (let id of ids) {
      id = mongoose.Types.ObjectId(id);
    }
    const row = await Chain.deleteMany({ _id: { $in: ids } });
    ok(res, row);
  };
  // 封装
  routerRun.post(router, uri, valid, logic)
};
