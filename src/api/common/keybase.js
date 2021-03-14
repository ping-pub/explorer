import http from '../axios'

// 头像
const request = async ({identity}) => {
  const res = await http.get(`/_/api/1.0/user/lookup.json`, {
    params: { key_suffix: identity, fields: 'pictures' },
    headers: {
      server: 'https://keybase.io'
    }
  })
  let avatar = ''
  if (res.them && res.them.length > 0) {
    avatar = res.them[0].pictures.primary.url
  }
  return {
    avatar
  }
}

export default request
