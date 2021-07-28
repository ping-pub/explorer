import dayjs from 'dayjs'

export function toDay(time) {
  return dayjs(time).format('YYYY-MM-DD')
}

export function percent(num) {
  return (num * 100).toFixed(2)
}

export function formatToken(token) {
// token.denom
// token.amount
  let denom = token.denom.toUpperCase()
  if (denom.charAt(0) === 'U') {
    denom = denom.substring(1)
  }
  return `${(token.amount / 1000000).toFixed()} ${denom}`
}

export * from 'compare-versions'

export class Data {

}
