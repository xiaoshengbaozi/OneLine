// 热榜 API 服务
const API_BASE = 'https://uapis.cn/api/v1/misc/hotboard'

export async function getHotboard(type = 'weibo') {
  const response = await fetch(`${API_BASE}?type=${type}`)
  if (!response.ok) {
    throw new Error('获取热榜失败')
  }
  const data = await response.json()
  return data.list || []
}
