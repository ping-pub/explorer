/*
 * @Author: your name
 * @Date: 2020-03-07 01:02:00
 * @lastTime: 2020-08-28 10:00:06
 * @LastEditors: 丁一鸣
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\utils\format.js
 */
import dayjs from 'dayjs'
import i18n from './lang'

export function formatPoint(num) {
  return parseFloat(Number(Number(num).toFixed(2)))
}

export function formatPointPecent(num) {
  return parseFloat(Number((Number(num) * 100).toFixed(2))) + '%'
}

export function timeToDay(time, type) {
  if (!type) type = 1000 * 1000 * 1000
  let num = Number(time) / (60 * 60 * 24 * type) // 天
  let str = i18n.t('message.parameter_day') // 天
  // 小于一天
  if (num < 1) {
    // 小时
    num = num * 24
    str = i18n.t('message.parameter_hour')
    if (num < 1) {
      // 分钟
      num = num * 60
      str = i18n.t('message.parameter_min')
      // 整数分钟
      if (num >= 1 &&  (num + '').indexOf('.') === -1) {
        num = num + str
      }
      // 秒级
      if (num < 1) {
        // 秒
        num = parseFloat((num * 60).toFixed(2))
        str =  i18n.t('message.parameter_sen')
        num = num + str
      }
      // 有小数点的分钟
      if (num > 1 && (num + '').indexOf('.') > 0) {
        const arr = (num + '').split('.')
        let integer = arr[0] + str
        let sencond = parseFloat(((num - Number(arr[0])) * 60).toFixed(2))  + ' ' + i18n.t('message.parameter_sen') // 秒
        num = integer + sencond
      }
    }
    // 整数时
    if (num >= 1 && (num + '').indexOf('.') === -1) {
      num = num + str
    }
    // 小数时
    if (num > 1 && (num + '').indexOf('.') > 0) {
      const arr = (num + '').split('.')
      let integer = arr[0] + str
      let sencond = parseFloat(((num - Number(arr[0])) * 60).toFixed(2))  + ' ' + i18n.t('message.parameter_min') // 分钟
      num = integer + sencond
    }
  }
  return num
}

export function toDenom(denom) {
  const lookup = {
    uatom: "ATOM"
  }
  if (lookup[denom]) {
    return lookup[denom]
  }
  if (denom.charAt(0) === `u`) {
    return denom.substr(1).toUpperCase()
  }
  return denom.toUpperCase()
}

export function toMicroDenom(denom) {
  const lookup = {
    ATOM: "uatom",
    MUON: "umuon",
    LUNA: "uluna",
    TREE: "seed",
    NGM: "ungm"
  }
  return lookup[denom] ? lookup[denom] : denom.toLowerCase()
}


export function toTimestamp(time) {
  return dayjs(time).valueOf()
}

export function formatTime(time) {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}



// 只格式不换算单位
export function formatUatomContent(uatom, noPoint) {
  uatom = Number(uatom) + ''
  const uatomInt = uatom.split('.')[0]
  const uatomPoint = uatom.split('.')[1]

  // 千分位
  let intStr = ''
  const len = uatomInt.length
  const still = len % 3
  for (let i = 3; i <= len; i = i + 3) {
    intStr = uatomInt.substr(-i, 3) + (intStr ? ',' + intStr : intStr)
  }
  intStr = (still > 0 ? uatomInt.substr(0, still) : '') + (still > 0 && intStr ? ',' : '') + (intStr ? intStr : '')
  // 存在小数
  if (uatomPoint && !noPoint) {
    intStr += ('.' + uatomPoint.substr(0, 2))
  }
  return intStr
}
// 换算 uatom
export function formatUatom(uatom, noUnit, isInt, denom, leng) {
  // 小数
  let intStr = ''
  uatom = Number(uatom) + ''
  let numLen = leng || 6
  if (uatom.length > numLen) {
    try {
      let point = uatom.substr(-numLen)
      const pointNum = Number('0.' + point) + ''
      point = pointNum.split('.')[1] || ''
      const int = uatom.substr(0, uatom.length - numLen)
      // 千分位
      const len = int.length
      const still = len % 3
      for (let i = 3; i <= len; i = i + 3) {
        intStr = int.substr(-i, 3) + (intStr ? ',' + intStr : intStr)
      }
      intStr = (still > 0 ? int.substr(0, still) : '') + (still > 0 && intStr ? ',' : '') + (intStr ? intStr : '') + (point ? '.' + point : '')
    } catch (err) { }
  } else {
    intStr = Number(uatom / Math.pow(10, numLen)) + ''
  }
  // 取整数
  if (isInt) {
    intStr = intStr.split('.')[0]
  }
  let unitStr = ' ATOM';
  if (window.chainId === 'kava') {
    unitStr = ' KAVA'
  }
  if (window.chainId === 'irishub') {
    unitStr = ' IRIS'
  }
  if (window.chainId === 'cell-test-01') {
    unitStr = ' Cell'
  }

  return intStr + (noUnit ? '' : ' ' + denom || unitStr)
}