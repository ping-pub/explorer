/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-15 23:12:05
 * @FilePath: /look-web/src/api/common/getChain.js
 */
import axios from 'axios'

export async function getChain() {
  const res = await axios.get('/look/chain/type')
  return res.data
}