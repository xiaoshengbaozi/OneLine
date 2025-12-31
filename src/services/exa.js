// Exa API 服务
const EXA_BASE_URL = 'https://api.exa.ai'

export async function searchExa(query, apiKey, options = {}) {
  const { numResults = 10, timeRange = 'week', category = 'news' } = options
  
  // 计算时间范围
  const now = new Date()
  let startDate = null
  if (timeRange === 'day') {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (timeRange === 'week') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (timeRange === 'month') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const body = {
    query,
    numResults,
    type: 'auto',
    text: true,
    ...(category && category !== 'all' && { category }),
    ...(startDate && { startPublishedDate: startDate.toISOString() })
  }

  const response = await fetch(`${EXA_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Exa search failed: ${error}`)
  }

  return response.json()
}

export async function getContents(urls, apiKey) {
  const response = await fetch(`${EXA_BASE_URL}/contents`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urls,
      text: true,
      summary: { query: '' }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Exa contents failed: ${error}`)
  }

  return response.json()
}
