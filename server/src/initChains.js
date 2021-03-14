/*
 * @Description: 
 * @Autor: dingyi
 * @Date: 2020-04-13 23:03:22
 * @LastEditors: dingyi
 * @LastEditTime: 2020-04-13 23:53:51
 * @FilePath: \look-web\server\src\initChains.js
 */
module.exports = {
  Mainnet: [
    {
      "chainId": "cosmoshub-3",
      "lcd": "https://lcd.nylira.net",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "Cosmos Hub",
      "rpc": "https://rpc.nylira.net",
      "version": "0.32.7",
      "api": 'V1',
      "unit": 'ATOM',
      "prefix": 'cosmos',
      "host": 'cosmos.ping.pub',
    },
    {
      "chainId": "kava-2",
      "lcd": "https://kava-relay.01node.com",
      "logo": "/static/chains/kava.svg",
      "name": "Kava",
      "rpc": "http://13.125.71.131:26657",
      "version": "0.32.7",
      "api": 'V1',
      "unit": 'KAVA',
      "prefix": 'kava',
      "host": 'kava.ping.pub'
    },
    {
      "chainId": "irishub",
      "lcd": "https://rpc.irisnet.org",
      "logo": "/static/chains/irishub.svg",
      "name": "IRISnet",
      "rpc": "http://seed-1.mainnet.irisnet.org:26657",
      "version": "0.32.1",
      "api": 'V2',
      "unit": 'IRIS',
      "prefix": 'iaa',
      "host": 'iris.ping.pub'
    },
    {
      "chainId": "e-money",
      "lcd": "http://emoney.validator.network/light",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "e-money",
      "rpc": "https://emoney.validator.network",
      "version": "0.32.7",
      "api": 'V1',
      "unit": '',
      "prefix": '', // 地址前缀
      "host": 'e-money.ping.pub'
    }
  ],
  Testnet: [
    {
      "chainId": "sentinelhub-test",
      "lcd": "https://lcd.turing.sentinel.co",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "Sentinel Network",
      "rpc": "https://rpc.turing.sentinel.co",
      "version": "0.32.7",
      "api": 'V1',
      "prefix": '',
      "unit": '',
      "host": 'sentinel-test.ping.pub'
    },
    {
      "chainId": "cell-test-01",
      "lcd": "http://sz1.icell.one:1317",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "Cell Network",
      "rpc": "http://sz1.icell.one:26657",
      "version": "0.32.7",
      "prefix": 'cosmos',
      "api": 'V1',
      "unit": '',
      "host": 'cell-test.ping.pub'
    },
    {
      "chainId": "cyber-test",
      "lcd": "https://titan.cybernode.ai/lcd",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "cyber",
      "rpc": "https://titan.cybernode.ai/api",
      "version": "0.32.7",
      "api": 'V1',
      "prefix": '',
      "unit": '',
      "host": 'cyber-test.ping.pub'
    },
    {
      "chainId": "e-money-test",
      "lcd": "https://lilmermaid.validator.network/light",
      "logo": "/static/chains/cosmoshub.svg",
      "name": "e-money",
      "rpc": "https://lilmermaid.validator.network",
      "version": "0.32.7",
      "api": 'V1',
      "unit": '',
      "prefix": '', // 地址前缀
      "host": 'e-money-test.ping.pub'
    },
    // {
    //   "chainId": "new-test",
    //   "lcd": "https://lcd.nylira.net",
    //   "logo": "/static/chains/cosmoshub.svg",
    //   "name": "Genesis Test",
    //   "rpc": "https://rpc.nylira.net",
    //   "version": "0.32.7",
    //   "api": 'V1',
    //   "unit": 'ATOM',
    //   "prefix": 'cosmos',
    //   "host": '',
    //   "genesis_time": '2020-05-01'
    // },
  ]
}