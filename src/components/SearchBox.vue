<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50"></div>
      
      <!-- Search Container -->
      <div class="relative bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
        <div class="flex items-center gap-2">
          <!-- Search Icon -->
          <div class="pl-4 text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          
          <!-- Input -->
          <div class="flex-1 relative">
            <input 
              v-model="query" 
              @keyup.enter="search"
              @focus="showHistory = true"
              @blur="handleBlur"
              :disabled="loading" 
              placeholder="输入关键词开始分析，如：SpaceX 星舰发射"
              class="w-full px-3 py-4 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none disabled:opacity-50" 
            />
            
            <!-- History Dropdown -->
            <div 
              v-if="showHistory && history.length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div class="flex items-center justify-between px-4 py-2 border-b border-white/5">
                <span class="text-xs text-gray-500">搜索历史</span>
                <button 
                  @mousedown.prevent="clearHistory"
                  class="text-xs text-gray-500 hover:text-red-400 transition"
                >
                  清空
                </button>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div 
                  v-for="item in history" 
                  :key="item.timestamp"
                  class="group flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer transition"
                  @mousedown.prevent="selectHistory(item.query)"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-gray-300">{{ item.query }}</span>
                  </div>
                  <button 
                    @mousedown.prevent.stop="removeHistory(item.query)"
                    class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Time Range Select -->
          <select 
            v-model="localTimeRange" 
            @change="updateTimeRange" 
            :disabled="loading"
            class="h-12 px-3 bg-slate-700/50 border border-white/10 rounded-xl text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 transition disabled:opacity-50 cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px; padding-right: 32px;"
          >
            <option value="day">24小时</option>
            <option value="week">一周</option>
            <option value="month">一个月</option>
            <option value="all">不限</option>
          </select>
          
          <!-- Search Button -->
          <button 
            @click="search" 
            :disabled="loading || !query.trim()"
            class="h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none flex items-center gap-2"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析中
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              开始分析
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Weibo Hotboard -->
    <div class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.098 20c-4.612 0-8.363-2.222-8.363-4.958 0-1.43.93-3.083 2.527-4.655 2.13-2.098 4.61-3.048 5.54-2.122.418.416.468 1.12.168 1.987-.12.35.2.47.48.35 1.2-.5 2.24-.62 2.99-.35.39.14.63.4.73.73.1.33.04.73-.18 1.13-.14.26-.04.53.23.6.27.07.57.1.88.1 1.59 0 3.06-.67 3.06-2.27 0-2.69-3.17-5.3-7.63-5.3-5.27 0-9.03 3.39-9.03 7.27 0 2.34 1.17 4.47 3.03 5.88.18.14.23.4.1.6-.4.6-.93 1.1-1.53 1.47-.18.1-.2.35-.05.5.5.5 1.17.87 1.93 1.07.76.2 1.6.3 2.5.3 4.61 0 8.36-2.22 8.36-4.96 0-.67-.2-1.3-.54-1.88-.1-.17-.03-.4.15-.48.6-.27 1.13-.63 1.56-1.07.13-.13.34-.1.43.05.5.8.78 1.73.78 2.73 0 3.87-4.47 7-9.98 7z"/>
          </svg>
          <span class="text-gray-400 text-sm">微博热搜</span>
          <button 
            @click="refreshHotboard"
            :disabled="hotboardLoading"
            class="text-gray-500 hover:text-gray-300 transition p-1"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': hotboardLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Hotboard List -->
      <div v-if="hotboardLoading && hotboard.length === 0" class="flex justify-center py-4">
        <svg class="w-6 h-6 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="hotboard.length > 0" class="grid grid-cols-2 gap-2">
        <button
          v-for="(item, index) in hotboard.slice(0, 10)"
          :key="index"
          @click="analyzeHotItem(item.title)"
          :disabled="loading"
          class="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition disabled:opacity-50 group"
        >
          <span 
            class="w-5 h-5 flex items-center justify-center text-xs font-medium rounded"
            :class="index < 3 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-500'"
          >
            {{ index + 1 }}
          </span>
          <span class="flex-1 text-sm text-gray-300 truncate group-hover:text-white transition">
            {{ item.title }}
          </span>
        </button>
      </div>
      
      <div v-else-if="hotboardError" class="text-center py-4 text-gray-500 text-sm">
        {{ hotboardError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getSearchHistory, addSearchHistory, removeSearchHistory as removeFromStorage, clearSearchHistory } from '../services/storage'
import { getHotboard } from '../services/hotboard'

const props = defineProps({ 
  loading: Boolean,
  timeRange: { type: String, default: 'month' }
})
const emit = defineEmits(['search', 'update:timeRange'])

const query = ref('')
const localTimeRange = ref(props.timeRange)
const showHistory = ref(false)
const history = ref([])

// Hotboard state
const hotboard = ref([])
const hotboardLoading = ref(false)
const hotboardError = ref('')

const quickTips = ['AI 最新进展', '科技行业动态', '全球经济趋势']

onMounted(() => {
  history.value = getSearchHistory()
  loadHotboard()
})

watch(() => props.timeRange, (val) => {
  localTimeRange.value = val
})

async function loadHotboard() {
  hotboardLoading.value = true
  hotboardError.value = ''
  try {
    hotboard.value = await getHotboard('weibo')
  } catch (e) {
    hotboardError.value = '加载热榜失败'
  } finally {
    hotboardLoading.value = false
  }
}

function refreshHotboard() {
  loadHotboard()
}

function analyzeHotItem(title) {
  query.value = title
  search()
}

function updateTimeRange() {
  emit('update:timeRange', localTimeRange.value)
}

function setQuery(text) {
  query.value = text
}

function handleBlur() {
  setTimeout(() => {
    showHistory.value = false
  }, 150)
}

function selectHistory(text) {
  query.value = text
  showHistory.value = false
  search()
}

function removeHistory(text) {
  history.value = removeFromStorage(text)
}

function clearHistory() {
  history.value = clearSearchHistory()
  showHistory.value = false
}

function search() {
  if (query.value.trim() && !props.loading) {
    history.value = addSearchHistory(query.value.trim())
    emit('search', query.value.trim())
  }
}
</script>
