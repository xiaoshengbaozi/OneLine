// LocalStorage 配置管理
const STORAGE_KEY = 'oneline_config'
const HISTORY_KEY = 'oneline_search_history'
const MAX_HISTORY = 10

const defaultConfig = {
  llm: {
    provider: 'openai', // openai, anthropic, custom
    apiKey: '',
    baseUrl: '',
    model: 'gpt-4o',
    temperature: 0.7
  },
  exa: {
    apiKey: ''
  },
  search: {
    numResults: 10,
    timeRange: 'month', // day, week, month, all
    category: 'news'
  }
}

export function getConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultConfig, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load config:', e)
  }
  return { ...defaultConfig }
}

export function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    return true
  } catch (e) {
    console.error('Failed to save config:', e)
    return false
  }
}

export function isConfigured() {
  const config = getConfig()
  return !!(config.llm.apiKey && config.exa.apiKey)
}

// 搜索历史管理
export function getSearchHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load search history:', e)
    return []
  }
}

export function addSearchHistory(query) {
  try {
    let history = getSearchHistory()
    // 移除重复项
    history = history.filter(item => item.query !== query)
    // 添加到开头
    history.unshift({ query, timestamp: Date.now() })
    // 限制数量
    history = history.slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return history
  } catch (e) {
    console.error('Failed to save search history:', e)
    return []
  }
}

export function removeSearchHistory(query) {
  try {
    let history = getSearchHistory()
    history = history.filter(item => item.query !== query)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return history
  } catch (e) {
    console.error('Failed to remove search history:', e)
    return []
  }
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return []
  } catch (e) {
    console.error('Failed to clear search history:', e)
    return []
  }
}
