<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute -bottom-40 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- Header -->
    <header class="relative bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span class="text-white font-bold text-lg">一</span>
          </div>
          <div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">OneLine</span>
            <span class="text-xs text-gray-500 ml-2">热点事件分析</span>
          </div>
        </div>
        <button @click="showSettings = true"
          class="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 border border-transparent hover:border-white/10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>设置</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative max-w-6xl mx-auto px-4" :class="report ? 'py-8' : 'min-h-[calc(100vh-73px)] flex flex-col justify-center'">
      <!-- Hero Section -->
      <div v-if="!report" class="text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
          <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          AI 驱动的热点事件分析工具
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">快速洞察热点事件</span>
        </h1>
        
        <p class="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          输入关键词，AI 自动聚合全网信息，快速了解事件全貌
        </p>

        <!-- Search Box -->
        <SearchBox :loading="loading" :timeRange="config.search.timeRange" 
          @search="handleSearch" @update:timeRange="updateTimeRange" />

        <!-- Feature Tags -->
        <div class="flex flex-wrap justify-center gap-3 mt-10">
          <div class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            智能检索
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm">
            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            五层深度分析
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm">
            <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            结构化报告
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm">
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            本地存储 · 隐私安全
          </div>
        </div>
      </div>

      <!-- Search Box (when report exists) -->
      <SearchBox v-if="report" :loading="loading" :timeRange="config.search.timeRange" 
        @search="handleSearch" @update:timeRange="updateTimeRange" />

      <!-- Status Progress -->
      <StatusProgress :status="status" :message="statusMessage" />

      <!-- Error Message -->
      <div v-if="error" class="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Report View -->
      <ReportView :report="report" :sources="sources" />
    </main>



    <!-- Settings Modal -->
    <SettingsModal :show="showSettings || !isConfigured" :config="config" @close="showSettings = false"
      @save="handleSaveConfig" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SearchBox from './components/SearchBox.vue'
import StatusProgress from './components/StatusProgress.vue'
import ReportView from './components/ReportView.vue'
import SettingsModal from './components/SettingsModal.vue'
import { getConfig, saveConfig, isConfigured as checkConfigured } from './services/storage'
import { searchExa } from './services/exa'
import { analyzeWithLLM } from './services/llm'

const config = ref(getConfig())
const showSettings = ref(false)
const isConfigured = ref(checkConfigured())

const loading = ref(false)
const status = ref('')
const statusMessage = ref('')
const error = ref('')
const report = ref('')
const sources = ref([])

onMounted(() => {
  if (!isConfigured.value) {
    showSettings.value = true
  }
})

function handleSaveConfig(newConfig) {
  config.value = newConfig
  saveConfig(newConfig)
  isConfigured.value = checkConfigured()
}

function updateTimeRange(newRange) {
  config.value.search.timeRange = newRange
  saveConfig(config.value)
}

async function handleSearch(query) {
  if (!isConfigured.value) {
    showSettings.value = true
    return
  }

  loading.value = true
  error.value = ''
  report.value = ''
  sources.value = []

  try {
    // Step 1: Search
    status.value = 'searching'
    statusMessage.value = `正在搜索 "${query}" 相关内容...`
    
    const searchResult = await searchExa(query, config.value.exa.apiKey, config.value.search)
    sources.value = searchResult.results || []
    
    if (sources.value.length === 0) {
      throw new Error('未找到相关内容，请尝试其他关键词')
    }

    statusMessage.value = `找到 ${sources.value.length} 条相关结果`

    // Step 2: Contents already included in search with text: true
    status.value = 'fetching'
    statusMessage.value = '正在处理内容...'

    // Step 3: Analyze
    status.value = 'analyzing'
    statusMessage.value = 'AI 正在分析并生成报告...'
    
    report.value = await analyzeWithLLM(sources.value, query, config.value)
    
    status.value = 'done'
    statusMessage.value = '分析完成！'

  } catch (e) {
    error.value = e.message || '分析过程中出现错误'
    status.value = ''
  } finally {
    loading.value = false
    setTimeout(() => { status.value = '' }, 2000)
  }
}
</script>
