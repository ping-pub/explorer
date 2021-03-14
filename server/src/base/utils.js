/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-13 11:21:32
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-13 14:50:25
 * @FilePath: /look-web/server/src/base/utils.js
 */
const { validationResult } = require("express-validator");

exports.ok = ok
function ok(res, data, other) {
  let obj = {
    code: 1,
    msg: "ok",
    data,
  };
  if (other) {
    obj = {
      ...obj,
      ...other,
    };
  }
  res.json(obj);
}

function routerGet(router, uri, valid, logic) {
  router.get(uri, valid(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ok(res, null, {
        code: 2,
        msg: errors.array()[0].msg,
        data: errors.array(),
      });
    logic(req, res);
  });
}

function routerPost(router, uri, valid, logic) {
  router.post(uri, valid(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return ok(res, null, {
        code: 2,
        msg: errors.array()[0].msg,
        data: errors.array(),
      });
    logic(req, res);
  });
}

exports.routerRun = {
  get: routerGet,
  post: routerPost
}

