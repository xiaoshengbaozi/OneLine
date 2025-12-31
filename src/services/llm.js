// LLM API 服务
export async function analyzeWithLLM(contents, query, config) {
  const { provider, apiKey, baseUrl, model, temperature } = config.llm
  
  // 构建分析 prompt - 五层深度分析框架
  const systemPrompt = `你是一个专业的情报分析师。请根据提供的新闻内容，生成一份五层深度分析报告。

## 重要规则
1. **信息清洗**：自动忽略重复报道、广告或低质量内容，优先采信权威信源
2. **溯源引用**：每一个论点、事实陈述都必须标注来源索引 [1]、[2] 等
3. **严格JSON格式**：所有JSON必须是有效格式，便于前端解析

## 报告结构（必须严格按此格式输出）

### 📌 核心摘要 (TL;DR)
用3句话概括整个事件的核心要点。

---

## 第一层：基础事实层 (Fact Extraction) —— "发生了什么？"

### 🔍 5W1H核心要素
以JSON格式输出：
\`\`\`json
{
  "what": "一句话概括核心事件",
  "who": ["核心人物/机构/公司/品牌"],
  "when": {"eventTime": "事件发生时间", "publishTime": "新闻发布时间", "isOldNews": false},
  "where": {"location": "事件发生地", "region": "区域/城市"},
  "why": "直接导火索或背景原因",
  "how": "事件如何发展/执行"
}
\`\`\`

### 📊 关键数据提取
以JSON格式输出所有关键数值：
\`\`\`json
{
  "metrics": [
    {"type": "金额|人数|涨跌幅|其他", "value": "具体数值", "context": "上下文说明", "source": 1}
  ]
}
\`\`\`

---

## 第二层：情感与观点层 (Sentiment & Opinion) —— "大家怎么看？"

### 🎭 细粒度情感分析
\`\`\`json
{
  "polarity": {"positive": 30, "negative": 40, "neutral": 30, "confidence": 0.85},
  "emotions": [
    {"emotion": "愤怒|焦虑|同情|讽刺|期待|失望|恐慌|乐观", "intensity": 80, "evidence": "支撑证据"}
  ],
  "dominantEmotion": "主导情绪"
}
\`\`\`

### 💬 观点挖掘与聚类
\`\`\`json
{
  "mediaStance": {"position": "支持|反对|中立|呼吁", "summary": "媒体/官方核心立场", "source": 1},
  "publicOpinion": [
    {"viewpoint": "观点内容", "frequency": "高|中|低", "source": 1}
  ],
  "stakeholders": [
    {"role": "专家|当事人|官方|路人", "name": "姓名/身份", "quote": "原话引用", "attitude": "支持|反对|中立", "source": 1}
  ]
}
\`\`\`

---

## 第三层：深度脉络层 (Context & Lineage) —— "前因后果是什么？"

### 📅 事件时间轴
\`\`\`json
{
  "timeline": [
    {"phase": "起因|发酵|高潮|结果|后续", "date": "时间", "event": "事件描述", "source": 1}
  ]
}
\`\`\`

### 🔗 关联关系图谱
\`\`\`json
{
  "relationships": [
    {"entity1": "实体A", "relation": "关系类型", "entity2": "实体B", "detail": "具体说明"}
  ],
  "similarEvents": [
    {"event": "历史相似事件", "time": "发生时间", "similarity": "相似点", "outcome": "结果"}
  ],
  "causalChain": {
    "precedingEvents": ["前序事件1", "前序事件2"],
    "subsequentEvents": ["可能的后续事件1", "可能的后续事件2"]
  }
}
\`\`\`

---

## 第四层：传播影响力层 (Impact & Spread) —— "影响有多大？"

### 📈 热度与传播分析
\`\`\`json
{
  "heatIndex": {"score": 85, "level": "高热|中热|低热|冷门", "trend": "上升|平稳|下降"},
  "spreadPath": {
    "originalSource": {"name": "首发媒体", "time": "首发时间", "source": 1},
    "keyNodes": [{"name": "关键传播节点", "type": "大V|权威媒体|自媒体", "impact": "影响描述"}]
  },
  "mediaDistribution": {
    "official": 0,
    "financial": 0,
    "selfMedia": 0,
    "foreign": 0
  }
}
\`\`\`

---

## 第五层：风险与决策层 (Risk & Prediction) —— "接下来会怎样？"

### ⚠️ 风险评估
\`\`\`json
{
  "riskLevel": {"level": "一般负面|严重危机|灭顶之灾|正面机遇", "score": 75, "reason": "评估理由"},
  "trendPrediction": {
    "next24h": "持续上升|见顶回落|平稳|二次爆发",
    "confidence": 0.7,
    "factors": ["影响因素1", "影响因素2"]
  }
}
\`\`\`

### 💡 行动建议 (Actionable Insights)
\`\`\`json
{
  "recommendations": [
    {"priority": "高|中|低", "action": "具体建议", "reason": "建议理由", "deadline": "建议时限"}
  ],
  "monitoringPoints": ["需持续监控的方面1", "需持续监控的方面2"]
}
\`\`\`

---

### 📊 深度分析总结
综合以上五层分析，给出你的专业分析见解（200字以内）。`

  const userPrompt = `用户查询: ${query}

以下是搜索到的相关新闻内容（已按相关性排序，请注意甄别信息质量）：

${contents.map((c, i) => `--- [来源${i + 1}] ${c.title} ---
URL: ${c.url}
发布日期: ${c.publishedDate || '未知'}
来源域名: ${new URL(c.url).hostname}
内容: ${c.text?.slice(0, 2000) || c.summary || '无内容'}
`).join('\n\n')}

请基于以上内容生成五层深度分析报告。注意：
1. 自动过滤重复或低质量信息
2. 每个论点必须标注 [来源X] 引用
3. 严格按照指定的JSON格式输出结构化数据
4. 如果某些信息无法从来源中获取，请标注"信息不足"而非编造`

  let url, headers, body

  if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages'
    headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }
    body = {
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    }
  } else {
    // OpenAI 或兼容接口
    url = baseUrl ? `${baseUrl}/chat/completions` : 'https://api.openai.com/v1/chat/completions'
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
    body = {
      model: model || 'gpt-4o',
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LLM API failed: ${error}`)
  }

  const data = await response.json()
  
  if (provider === 'anthropic') {
    return data.content[0].text
  }
  return data.choices[0].message.content
}
