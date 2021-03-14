/*
 * @Author: your name
 * @Date: 2020-03-08 21:59:04
 * @lastTime: 2020-12-11 11:20:32
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/utils/initChain.js
 */
// 判断地址，设置当前所在域，设置请求的 lcd, rpc 地址
import dayjs from "dayjs";
import chains from '../chains'

let hostChain
const host = window.location.host
const locationChainId = location.hash.split('chain=')[1]
const chainArr = [
  ...chains.Mainnet,
  ...chains.Testnet
]
for (const item of chainArr) {
  if (item.host === host) {
    hostChain = JSON.stringify(item)
  } else if (item.chainId === locationChainId) {
    hostChain = JSON.stringify(item)
  }
}

let chain = window.sessionStorage.getItem('chain') || hostChain

if (chain) {
  chain = JSON.parse(chain)
}
if (!chain) {
  chain = chains.Mainnet[0]
}

window.chain = chain
console.log(window.chain)

export function switchChain(chain) {
  if (location.hostname === 'localhost') {
    window.sessionStorage.setItem('chain', JSON.stringify(chain))
    window.location.href = '/#/validator?chain=' + chain.chainId
    location.reload()
    return
  }
  if (chain.host && (location.hostname !== 'localhost' && location.hostname !== chain.host)) {
    window.location.href = '//' + chain.host + '/#/validator'
  } else {
    window.sessionStorage.setItem('chain', JSON.stringify(chain))
    window.location.href = '//look.ping.pub/#/validator?chain=' + chain.chainId
    if (location.host === 'look.ping.pub') {
      location.reload()
    }
  }
}