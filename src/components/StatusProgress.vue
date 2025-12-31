<template>
  <div v-if="status" class="w-full max-w-2xl mx-auto mt-8">
    <div class="relative">
      <!-- Glow -->
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
      
      <div class="relative bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div class="space-y-4">
          <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-4">
            <!-- Step Indicator -->
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all',
              currentStep > i ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' :
              currentStep === i ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' :
              'bg-slate-700/50 text-gray-500 border border-white/5'
            ]">
              <svg v-if="currentStep > i" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg v-else-if="currentStep === i" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            
            <!-- Step Text -->
            <div class="flex-1">
              <span :class="[
                'font-medium transition-colors',
                currentStep > i ? 'text-green-400' :
                currentStep === i ? 'text-white' :
                'text-gray-500'
              ]">{{ step.title }}</span>
              <p v-if="currentStep === i" class="text-sm text-gray-500 mt-0.5">{{ step.desc }}</p>
            </div>
            
            <!-- Connector Line -->
            <div v-if="i < steps.length - 1" class="absolute left-[1.65rem] mt-10 w-0.5 h-4 bg-slate-700/50" :style="{ top: `${i * 4 + 2.5}rem` }"></div>
          </div>
        </div>
        
        <!-- Status Message -->
        <div v-if="message" class="mt-6 flex items-center gap-3 text-sm text-gray-400 bg-slate-700/30 p-4 rounded-xl border border-white/5">
          <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: String, message: String })

const steps = [
  { title: '搜索相关新闻', desc: '调用 Exa API 检索全网内容' },
  { title: '获取正文内容', desc: '提取并清洗网页文本' },
  { title: 'AI 分析生成报告', desc: '五层深度分析框架处理中' }
]

const currentStep = computed(() => {
  if (props.status === 'searching') return 0
  if (props.status === 'fetching') return 1
  if (props.status === 'analyzing') return 2
  if (props.status === 'done') return 3
  return -1
})
</script>
