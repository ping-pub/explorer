/*
 * @Author: your name
 * @Date: 2020-03-06 23:47:28
 * @lastTime: 2021-02-19 15:51:03
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/api/index.js
 */
import axios from './axios'
import * as requestV1 from './V1/request'
import * as responseV1 from './V1/response'

import * as requestV2 from './V2/request'
import * as responseV2 from './V2/response'

import * as requestV3 from './V3/request'
import * as responseV3 from './V3/response'

import * as requestV4 from './V4/request'
import * as responseV4 from './V4/response'

const version = window.chain.api

let config, resHandler
switch (version) {
  case 'V1':
    config = requestV1;
    resHandler = responseV1;
    break;
  case 'V2':
    config = requestV2;
    resHandler = responseV2;
    break;
  case 'V3':
    config = requestV3;
    resHandler = responseV3;
    break;
  case 'V4':
    config = requestV4;
    resHandler = responseV4;
    break;
  default:
    config = requestV1;
    resHandler = responseV1;
    break
}

export async function req(funcName, params) {
  try {
    const con = config[funcName]
    let axiosConfig
    params ? axiosConfig = con(params) : axiosConfig = con()
    // 无需发起好像
    if (!axiosConfig) return {}
    // 返回查询数组
    let res
    if (axiosConfig.type === 'array') {
      const requests = axiosConfig.requests
      const arr = []
      for (const item of requests) {
        arr.push(
          axios(item)
        )
      }
      res = await Promise.all(arr)
      if (axiosConfig.params) {
        res.push(axiosConfig.params)
      }
    }
    // 单个查询
    if (!axiosConfig.type) {
      res = await axios(axiosConfig)
    }
    const handle = resHandler[funcName]
    return handle(res)
  } catch (e) {
    console.log(e)
  }
}

export async function fetch(funcName, params) {
  return await req(funcName, params)
}
