// https://min-api.cryptocompare.com/documentation
// https://min-api.cryptocompare.com/data/price?fsym=ATOM&tsyms=USD,CNY&api_key=3993b9faad427d8df68c267d3e8664cd8923e6c590a4888023a14bd581ff1859
import http from '../axios'

// 币价
const request = async (unit) => {
  const coin = await http.get(`/data/price`, {
    params: {
      fsym: unit || 'ATOM',
      tsyms: 'USD,CNY',
      api_key: '3993b9faad427d8df68c267d3e8664cd8923e6c590a4888023a14bd581ff1859'
    },
    headers: {
      server: 'https://min-api.cryptocompare.com',
      serverCustom: true
    }
  })
  const { USD, CNY } = coin.data
  return {
    USD,
    CNY,
  }
}

export default request
