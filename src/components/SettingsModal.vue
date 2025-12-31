<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">设置</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <!-- Exa 配置 -->
        <div class="mb-6">
          <h3 class="font-medium mb-3 text-blue-600">Exa API 配置</h3>
          <input v-model="localConfig.exa.apiKey" type="password" placeholder="Exa API Key"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- LLM 配置 -->
        <div class="mb-6">
          <h3 class="font-medium mb-3 text-blue-600">LLM 配置</h3>
          <select v-model="localConfig.llm.provider"
            class="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="custom">自定义 (OpenAI 兼容)</option>
          </select>

          <input v-model="localConfig.llm.apiKey" type="password" placeholder="API Key"
            class="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500" />

          <input v-if="localConfig.llm.provider === 'custom'" v-model="localConfig.llm.baseUrl"
            placeholder="Base URL (如 https://api.deepseek.com/v1)"
            class="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500" />

          <input v-model="localConfig.llm.model" placeholder="模型名称 (如 gpt-4o)"
            class="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500" />

          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-600">Temperature:</label>
            <input v-model.number="localConfig.llm.temperature" type="range" min="0" max="1" step="0.1"
              class="flex-1" />
            <span class="text-sm w-8">{{ localConfig.llm.temperature }}</span>
          </div>
        </div>

        <!-- 搜索配置 -->
        <div class="mb-6">
          <h3 class="font-medium mb-3 text-blue-600">搜索配置</h3>
          <div>
            <label class="text-sm text-gray-600 block mb-1">结果数量</label>
            <select v-model.number="localConfig.search.numResults"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>
          </div>
        </div>

        <button @click="save"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ show: Boolean, config: Object })
const emit = defineEmits(['close', 'save'])

const localConfig = ref(JSON.parse(JSON.stringify(props.config)))

watch(() => props.config, (val) => {
  localConfig.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

function save() {
  emit('save', localConfig.value)
  emit('close')
}
</script>
