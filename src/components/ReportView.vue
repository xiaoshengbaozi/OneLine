<template>
  <div v-if="report" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
    <!-- 左侧：分析报告 -->
    <div class="lg:col-span-2 space-y-6">
      <!-- 核心摘要卡片 -->
      <div v-if="tldr" class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>📌</span> 核心摘要 (TL;DR)
        </h2>
        <p class="text-blue-50 leading-relaxed">{{ tldr }}</p>
      </div>

      <!-- ========== 第一层：基础事实层 ========== -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-3">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <span class="text-xl">1️⃣</span> 基础事实层 —— "发生了什么？"
          </h2>
        </div>
        
        <!-- 5W1H -->
        <div v-if="facts5w1h" class="p-6 border-b">
          <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span>🔍</span> 5W1H核心要素
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <div class="text-xs text-blue-600 font-medium mb-1">WHAT 事件</div>
              <div class="text-gray-800">{{ facts5w1h.what }}</div>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <div class="text-xs text-purple-600 font-medium mb-1">WHO 主体</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="who in facts5w1h.who" :key="who" class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-sm">{{ who }}</span>
              </div>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <div class="text-xs text-green-600 font-medium mb-1">WHEN 时间</div>
              <div class="text-gray-800 text-sm">
                <div>事件时间: {{ facts5w1h.when?.eventTime || '未知' }}</div>
                <div>发布时间: {{ facts5w1h.when?.publishTime || '未知' }}</div>
                <span v-if="facts5w1h.when?.isOldNews" class="text-orange-600 text-xs">⚠️ 旧闻新发</span>
              </div>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg">
              <div class="text-xs text-orange-600 font-medium mb-1">WHERE 地点</div>
              <div class="text-gray-800">📍 {{ facts5w1h.where?.location || '未知' }} {{ facts5w1h.where?.region ? `(${facts5w1h.where.region})` : '' }}</div>
            </div>
            <div class="p-3 bg-red-50 rounded-lg">
              <div class="text-xs text-red-600 font-medium mb-1">WHY 原因</div>
              <div class="text-gray-800 text-sm">{{ facts5w1h.why }}</div>
            </div>
            <div class="p-3 bg-cyan-50 rounded-lg">
              <div class="text-xs text-cyan-600 font-medium mb-1">HOW 过程</div>
              <div class="text-gray-800 text-sm">{{ facts5w1h.how }}</div>
            </div>
          </div>
        </div>

        <!-- 关键数据 -->
        <div v-if="keyMetrics && keyMetrics.length" class="p-6">
          <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span>📊</span> 关键数据提取
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="(metric, i) in keyMetrics" :key="i" 
              class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600">{{ metric.value }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ metric.type }}</div>
              <div class="text-xs text-gray-400">{{ metric.context }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 第二层：情感与观点层 ========== -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <span class="text-xl">2️⃣</span> 情感与观点层 —— "大家怎么看？"
          </h2>
        </div>

        <!-- 情感分析 -->
        <div v-if="sentimentData" class="p-6 border-b">
          <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>🎭</span> 细粒度情感分析
          </h3>
          
          <!-- 情感极性条 -->
          <div class="mb-4">
            <div class="text-sm text-gray-600 mb-2">情感极性:</div>
            <div class="flex h-6 rounded-full overflow-hidden shadow-inner">
              <div class="bg-green-500 flex items-center justify-center text-white text-xs font-medium" 
                :style="{ width: (sentimentData.polarity?.positive || 0) + '%' }">
                {{ sentimentData.polarity?.positive }}%
              </div>
              <div class="bg-gray-400 flex items-center justify-center text-white text-xs font-medium" 
                :style="{ width: (sentimentData.polarity?.neutral || 0) + '%' }">
                {{ sentimentData.polarity?.neutral }}%
              </div>
              <div class="bg-red-500 flex items-center justify-center text-white text-xs font-medium" 
                :style="{ width: (sentimentData.polarity?.negative || 0) + '%' }">
                {{ sentimentData.polarity?.negative }}%
              </div>
            </div>
            <div class="flex justify-between text-xs mt-1 text-gray-500">
              <span>积极</span>
              <span>置信度: {{ ((sentimentData.polarity?.confidence || 0) * 100).toFixed(0) }}%</span>
              <span>消极</span>
            </div>
          </div>

          <!-- 情绪光谱 -->
          <div v-if="sentimentData.emotions?.length" class="mb-3">
            <div class="text-sm text-gray-600 mb-2">情绪光谱:</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(emo, i) in sentimentData.emotions" :key="i"
                class="px-3 py-1.5 rounded-lg text-sm" :class="getEmotionClass(emo.emotion)">
                <div class="font-medium">{{ emo.emotion }}</div>
                <div class="text-xs opacity-75">强度: {{ emo.intensity }}%</div>
              </div>
            </div>
          </div>

          <!-- 主导情绪 -->
          <div v-if="sentimentData.dominantEmotion" class="flex items-center gap-2">
            <span class="text-gray-600">主导情绪:</span>
            <span class="px-3 py-1 rounded-full font-medium" :class="getDominantClass(sentimentData.dominantEmotion)">
              {{ sentimentData.dominantEmotion }}
            </span>
          </div>
        </div>

        <!-- 观点挖掘 -->
        <div v-if="opinions" class="p-6">
          <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span>💬</span> 观点挖掘与聚类
          </h3>
          
          <!-- 媒体立场 -->
          <div v-if="opinions.mediaStance" class="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div class="text-sm font-medium text-blue-700 mb-1">📰 媒体/官方立场: {{ opinions.mediaStance.position }}</div>
            <div class="text-gray-700" v-html="renderWithCitations(opinions.mediaStance.summary)"></div>
          </div>

          <!-- 公众观点 -->
          <div v-if="opinions.publicOpinion?.length" class="mb-4">
            <div class="text-sm font-medium text-gray-600 mb-2">🗣️ 公众观点 (Top争议点):</div>
            <div class="space-y-2">
              <div v-for="(op, i) in opinions.publicOpinion" :key="i" 
                class="p-2 bg-gray-50 rounded flex items-start gap-2">
                <span class="px-2 py-0.5 text-xs rounded" :class="getFrequencyClass(op.frequency)">{{ op.frequency }}</span>
                <span class="text-gray-700" v-html="renderWithCitations(op.viewpoint)"></span>
              </div>
            </div>
          </div>

          <!-- 利益相关方 -->
          <div v-if="opinions.stakeholders?.length">
            <div class="text-sm font-medium text-gray-600 mb-2">👥 利益相关方态度:</div>
            <div class="space-y-2">
              <div v-for="(sh, i) in opinions.stakeholders" :key="i" 
                class="p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 text-xs bg-gray-200 rounded">{{ sh.role }}</span>
                  <span class="font-medium">{{ sh.name }}</span>
                  <span class="px-2 py-0.5 text-xs rounded" :class="getAttitudeClass(sh.attitude)">{{ sh.attitude }}</span>
                </div>
                <div class="text-gray-600 text-sm italic">"{{ sh.quote }}"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 第三层：深度脉络层 ========== -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <span class="text-xl">3️⃣</span> 深度脉络层 —— "前因后果是什么？"
          </h2>
        </div>

        <!-- 事件时间轴 -->
        <div v-if="timelineData?.length" class="p-6 border-b">
          <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span>📅</span> 事件时间轴
          </h3>
          <div class="relative pl-6 border-l-2 border-indigo-200 space-y-4">
            <div v-for="(item, i) in timelineData" :key="i" class="relative">
              <div class="absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white"
                :class="getPhaseColor(item.phase)"></div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 text-xs rounded text-white" :class="getPhaseColor(item.phase)">{{ item.phase }}</span>
                  <span class="text-sm text-indigo-600 font-medium">{{ item.date }}</span>
                </div>
                <div class="text-gray-700">
                  {{ item.event }}
                  <a v-if="item.source" @click.prevent="scrollToSource(item.source)"
                    class="text-blue-500 hover:underline cursor-pointer ml-1">[{{ item.source }}]</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 关联关系 -->
        <div v-if="contextData" class="p-6">
          <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span>🔗</span> 关联关系图谱
          </h3>
          
          <!-- 实体关系 -->
          <div v-if="contextData.relationships?.length" class="mb-4">
            <div class="text-sm text-gray-600 mb-2">实体关系:</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(rel, i) in contextData.relationships" :key="i"
                class="px-3 py-2 bg-indigo-50 rounded-lg text-sm">
                <span class="font-medium text-indigo-700">{{ rel.entity1 }}</span>
                <span class="mx-2 text-gray-400">→ {{ rel.relation }} →</span>
                <span class="font-medium text-indigo-700">{{ rel.entity2 }}</span>
              </div>
            </div>
          </div>

          <!-- 相似事件 -->
          <div v-if="contextData.similarEvents?.length" class="mb-4">
            <div class="text-sm text-gray-600 mb-2">📚 历史相似事件:</div>
            <div class="space-y-2">
              <div v-for="(evt, i) in contextData.similarEvents" :key="i"
                class="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <div class="font-medium text-amber-800">{{ evt.event }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  <span>时间: {{ evt.time }}</span>
                  <span class="mx-2">|</span>
                  <span>相似点: {{ evt.similarity }}</span>
                </div>
                <div class="text-sm text-gray-500">结果: {{ evt.outcome }}</div>
              </div>
            </div>
          </div>

          <!-- 因果链条 -->
          <div v-if="contextData.causalChain" class="grid md:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-sm font-medium text-gray-600 mb-2">⬅️ 前序事件</div>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li v-for="(evt, i) in contextData.causalChain.precedingEvents" :key="i">{{ evt }}</li>
              </ul>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-sm font-medium text-gray-600 mb-2">➡️ 可能后续</div>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li v-for="(evt, i) in contextData.causalChain.subsequentEvents" :key="i">{{ evt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 第四层：传播影响力层 ========== -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <span class="text-xl">4️⃣</span> 传播影响力层 —— "影响有多大？"
          </h2>
        </div>

        <div v-if="impactData" class="p-6">
          <!-- 热度指数 -->
          <div v-if="impactData.heatIndex" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>📈</span> 热度指数
            </h3>
            <div class="flex items-center gap-4">
              <div class="relative w-24 h-24">
                <svg class="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="8" fill="none"/>
                  <circle cx="48" cy="48" r="40" :stroke="getHeatColor(impactData.heatIndex.score)" 
                    stroke-width="8" fill="none" stroke-linecap="round"
                    :stroke-dasharray="`${impactData.heatIndex.score * 2.51} 251`"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold" :class="getHeatTextColor(impactData.heatIndex.score)">
                    {{ impactData.heatIndex.score }}
                  </span>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-sm font-medium" :class="getHeatLevelClass(impactData.heatIndex.level)">
                    {{ impactData.heatIndex.level }}
                  </span>
                  <span class="text-sm text-gray-500">
                    趋势: {{ impactData.heatIndex.trend === '上升' ? '📈' : impactData.heatIndex.trend === '下降' ? '📉' : '➡️' }} {{ impactData.heatIndex.trend }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 传播路径 -->
          <div v-if="impactData.spreadPath" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-3">🛤️ 传播路径</h3>
            <div class="p-3 bg-orange-50 rounded-lg mb-3">
              <div class="text-sm text-orange-600 font-medium">首发源头</div>
              <div class="text-gray-800">{{ impactData.spreadPath.originalSource?.name }} ({{ impactData.spreadPath.originalSource?.time }})</div>
            </div>
            <div v-if="impactData.spreadPath.keyNodes?.length" class="space-y-2">
              <div class="text-sm text-gray-600">关键传播节点:</div>
              <div v-for="(node, i) in impactData.spreadPath.keyNodes" :key="i"
                class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span class="px-2 py-0.5 text-xs rounded" :class="getNodeTypeClass(node.type)">{{ node.type }}</span>
                <span class="font-medium">{{ node.name }}</span>
                <span class="text-sm text-gray-500">- {{ node.impact }}</span>
              </div>
            </div>
          </div>

          <!-- 媒体分布 -->
          <div v-if="impactData.mediaDistribution">
            <h3 class="font-medium text-gray-700 mb-3">📊 媒体画像分布</h3>
            <div class="grid grid-cols-4 gap-2">
              <div class="text-center p-3 bg-red-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ impactData.mediaDistribution.official || 0 }}</div>
                <div class="text-xs text-gray-500">央媒/官媒</div>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ impactData.mediaDistribution.financial || 0 }}</div>
                <div class="text-xs text-gray-500">财经媒体</div>
              </div>
              <div class="text-center p-3 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ impactData.mediaDistribution.selfMedia || 0 }}</div>
                <div class="text-xs text-gray-500">自媒体</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ impactData.mediaDistribution.foreign || 0 }}</div>
                <div class="text-xs text-gray-500">外媒</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== 第五层：风险与决策层 ========== -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3">
          <h2 class="text-white font-semibold flex items-center gap-2">
            <span class="text-xl">5️⃣</span> 风险与决策层 —— "接下来会怎样？"
          </h2>
        </div>

        <div v-if="riskData" class="p-6">
          <!-- 风险评估 -->
          <div v-if="riskData.riskLevel" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>⚠️</span> 风险等级评估
            </h3>
            <div class="flex items-center gap-4">
              <div class="px-4 py-2 rounded-lg text-lg font-bold" :class="getRiskLevelClass(riskData.riskLevel.level)">
                {{ riskData.riskLevel.level }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm text-gray-500">风险分数:</span>
                  <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" :class="getRiskBarColor(riskData.riskLevel.score)"
                      :style="{ width: riskData.riskLevel.score + '%' }"></div>
                  </div>
                  <span class="font-bold" :class="getRiskScoreColor(riskData.riskLevel.score)">{{ riskData.riskLevel.score }}</span>
                </div>
                <div class="text-sm text-gray-600">{{ riskData.riskLevel.reason }}</div>
              </div>
            </div>
          </div>

          <!-- 趋势预测 -->
          <div v-if="riskData.trendPrediction" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>🔮</span> 趋势预测 (未来24小时)
            </h3>
            <div class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">{{ getTrendIcon(riskData.trendPrediction.next24h) }}</span>
                <span class="text-lg font-medium">{{ riskData.trendPrediction.next24h }}</span>
                <span class="text-sm text-gray-500">(置信度: {{ ((riskData.trendPrediction.confidence || 0) * 100).toFixed(0) }}%)</span>
              </div>
              <div v-if="riskData.trendPrediction.factors?.length" class="text-sm text-gray-600">
                <span class="font-medium">影响因素: </span>
                <span v-for="(f, i) in riskData.trendPrediction.factors" :key="i">
                  {{ f }}{{ i < riskData.trendPrediction.factors.length - 1 ? '、' : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 行动建议 -->
          <div v-if="riskData.recommendations?.length" class="mb-6">
            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>💡</span> 行动建议 (Actionable Insights)
            </h3>
            <div class="space-y-3">
              <div v-for="(rec, i) in riskData.recommendations" :key="i"
                class="p-3 rounded-lg border-l-4" :class="getPriorityClass(rec.priority)">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 text-xs rounded font-medium" :class="getPriorityBadgeClass(rec.priority)">
                    {{ rec.priority }}优先
                  </span>
                  <span v-if="rec.deadline" class="text-xs text-gray-500">⏰ {{ rec.deadline }}</span>
                </div>
                <div class="font-medium text-gray-800">{{ rec.action }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ rec.reason }}</div>
              </div>
            </div>
          </div>

          <!-- 监控要点 -->
          <div v-if="riskData.monitoringPoints?.length">
            <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span>👁️</span> 持续监控要点
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="(point, i) in riskData.monitoringPoints" :key="i"
                class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {{ point }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 导出按钮 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-end gap-2">
          <button @click="exportMd" class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
            导出 Markdown
          </button>
          <button @click="exportPdf" class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition">
            导出 PDF
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧：信息源 -->
    <div class="space-y-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-lg font-semibold mb-4">📚 参考来源</h2>
        <div class="space-y-3 max-h-[60vh] overflow-y-auto">
          <a v-for="(source, i) in sources" :key="i" :id="'source-' + (i + 1)" :href="source.url" target="_blank"
            class="block p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition source-item">
            <div class="flex items-start gap-2">
              <span class="text-blue-600 font-bold shrink-0">[{{ i + 1 }}]</span>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-800 line-clamp-2">{{ source.title }}</div>
                <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>{{ getDomain(source.url) }}</span>
                  <span>•</span>
                  <span>{{ formatDate(source.publishedDate) }}</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({ report: String, sources: Array })

// 解析 TL;DR
const tldr = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/核心摘要.*?\n\n?([\s\S]*?)(?=\n---|\n##|$)/i)
  if (match) {
    return match[1].replace(/```[\s\S]*?```/g, '').trim()
  }
  return null
})

// 解析 5W1H
const facts5w1h = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/5W1H核心要素[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { return null }
  }
  return null
})

// 解析关键数据
const keyMetrics = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/关键数据提取[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try {
      const data = JSON.parse(match[1])
      return data.metrics || []
    } catch { return null }
  }
  return null
})

// 解析情感数据
const sentimentData = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/细粒度情感分析[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { return null }
  }
  return null
})

// 解析观点数据
const opinions = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/观点挖掘与聚类[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { return null }
  }
  return null
})

// 解析时间线
const timelineData = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/事件时间轴[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try {
      const data = JSON.parse(match[1])
      return data.timeline || []
    } catch { return null }
  }
  return null
})

// 解析关联关系
const contextData = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/关联关系图谱[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { return null }
  }
  return null
})

// 解析传播影响力
const impactData = computed(() => {
  if (!props.report) return null
  const match = props.report.match(/热度与传播分析[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  if (match) {
    try { return JSON.parse(match[1]) } catch { return null }
  }
  return null
})

// 解析风险数据
const riskData = computed(() => {
  if (!props.report) return null
  // 风险评估
  const riskMatch = props.report.match(/风险评估[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  // 行动建议
  const actionMatch = props.report.match(/行动建议[\s\S]*?```json\s*\n?\s*(\{[\s\S]*?\})\s*\n?```/)
  
  let result = {}
  if (riskMatch) {
    try { Object.assign(result, JSON.parse(riskMatch[1])) } catch {}
  }
  if (actionMatch) {
    try { Object.assign(result, JSON.parse(actionMatch[1])) } catch {}
  }
  return Object.keys(result).length ? result : null
})

// 渲染报告
const renderedReport = computed(() => {
  if (!props.report) return ''
  let html = marked(props.report)
  html = html.replace(/\[来源?(\d+)\]/g, '<a class="citation-link text-blue-600 hover:underline" data-source="$1">[$1]</a>')
  return html
})

// 渲染带引用的文本
function renderWithCitations(text) {
  if (!text) return ''
  return text.replace(/\[来源?(\d+)\]/g, '<a class="citation-link text-blue-600 hover:underline cursor-pointer" data-source="$1">[$1]</a>')
}

// 处理引用点击
function handleCitationClick(e) {
  const link = e.target.closest('.citation-link')
  if (link) {
    e.preventDefault()
    const sourceNum = link.dataset.source
    scrollToSource(parseInt(sourceNum))
  }
}

// 滚动到来源
function scrollToSource(num) {
  const el = document.getElementById('source-' + num)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50')
    }, 2000)
  }
}

// 样式函数
function getEmotionClass(emotion) {
  const map = {
    '愤怒': 'bg-red-100 text-red-700',
    '焦虑': 'bg-orange-100 text-orange-700',
    '恐慌': 'bg-red-100 text-red-700',
    '担忧': 'bg-yellow-100 text-yellow-700',
    '失望': 'bg-gray-100 text-gray-700',
    '同情': 'bg-blue-100 text-blue-700',
    '期待': 'bg-green-100 text-green-700',
    '乐观': 'bg-green-100 text-green-700',
    '讽刺': 'bg-purple-100 text-purple-700'
  }
  return map[emotion] || 'bg-gray-100 text-gray-700'
}

function getDominantClass(dominant) {
  if (!dominant) return 'bg-gray-100 text-gray-700'
  if (['乐观', '期待', '积极'].some(k => dominant.includes(k))) return 'bg-green-100 text-green-700'
  if (['恐慌', '愤怒', '担忧', '焦虑'].some(k => dominant.includes(k))) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

function getFrequencyClass(freq) {
  if (freq === '高') return 'bg-red-100 text-red-700'
  if (freq === '中') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

function getAttitudeClass(attitude) {
  if (attitude === '支持') return 'bg-green-100 text-green-700'
  if (attitude === '反对') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

function getPhaseColor(phase) {
  const map = {
    '起因': 'bg-blue-500',
    '发酵': 'bg-yellow-500',
    '高潮': 'bg-red-500',
    '结果': 'bg-green-500',
    '后续': 'bg-gray-500'
  }
  return map[phase] || 'bg-gray-400'
}

function getHeatColor(score) {
  if (score >= 80) return '#ef4444'
  if (score >= 60) return '#f97316'
  if (score >= 40) return '#eab308'
  return '#22c55e'
}

function getHeatTextColor(score) {
  if (score >= 80) return 'text-red-500'
  if (score >= 60) return 'text-orange-500'
  if (score >= 40) return 'text-yellow-500'
  return 'text-green-500'
}

function getHeatLevelClass(level) {
  const map = {
    '高热': 'bg-red-100 text-red-700',
    '中热': 'bg-orange-100 text-orange-700',
    '低热': 'bg-yellow-100 text-yellow-700',
    '冷门': 'bg-gray-100 text-gray-600'
  }
  return map[level] || 'bg-gray-100 text-gray-600'
}

function getNodeTypeClass(type) {
  const map = {
    '大V': 'bg-purple-100 text-purple-700',
    '权威媒体': 'bg-red-100 text-red-700',
    '自媒体': 'bg-blue-100 text-blue-700'
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

function getRiskLevelClass(level) {
  const map = {
    '灭顶之灾': 'bg-red-600 text-white',
    '严重危机': 'bg-red-100 text-red-700',
    '一般负面': 'bg-yellow-100 text-yellow-700',
    '正面机遇': 'bg-green-100 text-green-700'
  }
  return map[level] || 'bg-gray-100 text-gray-600'
}

function getRiskBarColor(score) {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getRiskScoreColor(score) {
  if (score >= 80) return 'text-red-600'
  if (score >= 60) return 'text-orange-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-green-600'
}

function getTrendIcon(trend) {
  const map = {
    '持续上升': '📈',
    '见顶回落': '📉',
    '平稳': '➡️',
    '二次爆发': '🔥'
  }
  return map[trend] || '❓'
}

function getPriorityClass(priority) {
  const map = {
    '高': 'bg-red-50 border-red-500',
    '中': 'bg-yellow-50 border-yellow-500',
    '低': 'bg-gray-50 border-gray-400'
  }
  return map[priority] || 'bg-gray-50 border-gray-400'
}

function getPriorityBadgeClass(priority) {
  const map = {
    '高': 'bg-red-500 text-white',
    '中': 'bg-yellow-500 text-white',
    '低': 'bg-gray-400 text-white'
  }
  return map[priority] || 'bg-gray-400 text-white'
}

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
}

function formatDate(date) {
  if (!date) return '未知日期'
  return new Date(date).toLocaleDateString('zh-CN')
}

function exportMd() {
  const blob = new Blob([props.report], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
}

async function exportPdf() {
  const html2pdf = (await import('html2pdf.js')).default
  const element = document.querySelector('.prose')
  html2pdf().set({
    margin: 10,
    filename: `report-${Date.now()}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
