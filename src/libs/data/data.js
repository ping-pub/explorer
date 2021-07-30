import dayjs from 'dayjs'

export function toDay(time) {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

export function percent(num) {
  return parseFloat((num * 100).toFixed(2))
}

export function formatToken(token) {
  let denom = token.denom.toUpperCase()
  if (denom.charAt(0) === 'U') {
    denom = denom.substring(1)
  }
  return `${(token.amount / 1000000).toFixed()} ${denom}`
}

export function tokenFormatter(tokens) {
  if (Array.isArray(tokens)) {
    return tokens.map(t => formatToken(t))
  }
  return formatToken(tokens)
}

export * from 'compare-versions'

export class Data {

}
