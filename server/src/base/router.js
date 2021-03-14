/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-10 12:40:50
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-13 11:39:02
 * @FilePath: /look-web/server/src/base/router.js
 */

const api = require('../routes/index.js')

module.exports = (app) => {
  app.use('/look', api)
  app.use('/look', (req, res) => { res.send('look.ping.pub') })
}
