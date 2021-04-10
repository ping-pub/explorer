const isDev = location.hostname === "localhost";
/**
 LCD: curl https://cosmoshub.stakesystems.io/node_info
RPC: curl https://cosmoshub.stakesystems.io:2053/status
 */
export default {
	"Mainnet": [{
		"hash": "5e95f8d18ee6e64f7685a4db",
		"api": "V4",
		"chainId": "cosmoshub-3",
		"name": "Cosmos Hub",
		"lcd": "https://cosmoshub.stakesystems.io",
		"rpc": "https://cosmoshub.stakesystems.io:2053",
		"logo": "/static/chains/cosmoshub.svg",
		"prefix": "cosmos",
		"unit": "ATOM",
		"host": "cosmos.ping.pub"
	}, {
		"hash": "5e95f8d18ee6e64f7685a4dd",
		"api": "V2",
		"chainId": "irishub",
		"name": "IRISnet",
		"lcd": "https://rpc.irisnet.org",
		"rpc": "http://seed-1.mainnet.irisnet.org:26657",
		"logo": "/static/chains/irishub.svg",
		"prefix": "iaa",
		"unit": "IRIS",
		"host": "iris.ping.pub"
	}, {
		"hash": "5f46381683d9d569a6ecc5dd",
		"api": "V1",
		"chainId": "iov-mainnet-2",
		"name": "IOV Name Service",
		"lcd": "http://lcd-private-iov-mainnet-2.iov.one",
		"rpc": "https://rpc-private-iov-mainnet-2.iov.one",
		"logo": "/static/chains/cosmoshub.svg",
		"prefix": "star",
		"unit": "IOV"
	}, {
		"hash": "5f8c078b90b5fb7856ae3a06",
		"api": "V1",
		"chainId": "kava-2",
		"name": "Kava",
		"lcd": "https://kava4.data.kava.io",
		"rpc": "https://rpc.data.kava.io",
		"logo": "/static/chains/kava.svg",
		"prefix": "kava",
		"unit": "KAVA",
		"host": "kava.ping.pub"
	}, {
		"hash": "5f8c0ef91effe87834314467",
		"api": "V4",
		"chainId": "akashnet-1",
		"name": "Akash DeCloud",
		"lcd": "http://lcd.akash.forbole.com",
		"rpc": "http://rpc.akash.forbole.com",
		"logo": "https://gblobscdn.gitbook.com/spaces%2F-LrNFlfuifzmQ_NMKu9C%2Favatar.png?alt=media",
		"prefix": "akash",
		"unit": "AKT",
		"host": "akash.ping.pub"
	}, {
		"hash": "5fa15123f559583ed7465023",
		"api": "V4",
		"chainId": "crypto-org-chain-mainnet-1",
		"name": "Crypto",
		"lcd": "https://mainnet.crypto.org:1317",
		"rpc": "https://mainnet.crypto.org:26657",
		"logo": "/static/chains/cosmoshub.svg",
		"prefix": "crocncl",
		"unit": "BASECRO"
	}],
	"Testnet": [ {
		"hash": "5eabf1d1b8eb6314e2d99264",
		"api": "V1",
		"chainId": "iovns-galaxynet",
		"name": "iovns",
		"lcd": "http://iovnscli-rest-api.cluster-galaxynet.iov.one",
		"rpc": "https://rpc.cluster-galaxynet.iov.one/",
		"logo": "/static/chains/cosmoshub.svg",
		"prefix": "cosmos",
		"unit": "ATOM"
	}]
};
