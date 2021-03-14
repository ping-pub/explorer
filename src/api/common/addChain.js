/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-03-27 11:41:45
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-15 23:06:49
 * @FilePath: /look-web/src/api/common/addChain.js
 */
import axios from 'axios'

export async function addChain(data) {
  const res = await axios.post('/look/chain/create', data)
  return res.data
}