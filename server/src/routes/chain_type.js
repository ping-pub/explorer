/*
 * @Description: 查询链
 * @Autor: dingyi
 * @Date: 2020-04-13 11:20:07
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-25 21:55:10
 * @FilePath: \look-web\server\src\routes\chain_type.js
 */

const { ok, routerRun } = require("../base/utils.js");
const { query } = require("express-validator");

const Chain = require("../models/chain");

module.exports = (router) => {
  // 路由
  const uri = "/chain/type";
  // 验证
  const valid = () => {
    return [
    ];
  };
  // 逻辑
  const logic = async (req, res) => {
    const rows = await Chain.aggregate([
      {
        $group: {
          _id: "$type",
          chains: {
            $push: {
              hash: '$_id',
              api: '$api',
              chainId: '$chainId',
              name: '$name',
              lcd: '$lcd',
              rpc: '$rpc',
              logo: '$logo',
              prefix: '$prefix',
              unit: '$unit',
              genesis_time: '$genesis_time',
              host: '$host',
              // version: '$version',
              // type: '$type',
              // created: '$created',
              // updated: '$updated'
            },
          }
        }
      },
      {
        $sort: {
          created: 1
        }
      }
    ]).exec()
    const obj = {}
    for (const item of rows) {
      obj[item._id] = item.chains
    }
    ok(res, {
      Mainnet: obj['Mainnet'],
      Testnet: obj['Testnet'],
      GoZ: obj['GoZ'],
    });
  };
  // 封装
  routerRun.get(router, uri, valid, logic)
};
