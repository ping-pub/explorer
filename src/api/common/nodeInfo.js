// import http from '../interface'

// 内核版本自动获取
const request = async (baseUrl) => {
	let res= await Promise.all([
		http.get(`/node_info`, {}, { baseUrl }).catch(() => {}),
		http.get(`/node-info`, {}, { baseUrl }).catch(() => {})
	])
	let version = ''
	for (const item of res) {
		if (item) {
			version = item.data.version || item.data.node_info.version
		}
	}

	return version
}

export default request
