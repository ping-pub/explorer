/*
 * @Description: routes list
 * @Autor: dingyi
 * @Date: 2020-04-08 16:30:15
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-15 22:27:07
 * @FilePath: /look-web/server/src/routes/index.js
 */

const routes = [
  'chain_create',
  'chain_type',
  'chain_init',
  'chain_delete',
  'chain_list'
]

const express = require('express')
const router = express.Router()

for (const item of routes) {
  require(`./${item}`)(router)
}

module.exports = router
