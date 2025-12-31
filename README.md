# OneLine 新闻情报分析工具

一款基于 AI 的新闻深度分析工具，通过五层分析框架将非结构化新闻转化为结构化情报报告。

## 功能特点

- **智能搜索**：集成 Exa API 进行新闻检索
- **五层深度分析**：
  1. 基础事实层 - 5W1H 核心要素提取
  2. 情感与观点层 - 细粒度情感分析与观点挖掘
  3. 深度脉络层 - 事件时间轴与关联关系
  4. 传播影响力层 - 热度指数与传播路径
  5. 风险与决策层 - 风险评估与行动建议
- **可视化报告**：结构化卡片展示，支持导出 Markdown/PDF
- **来源溯源**：所有论点标注引用来源

## 技术栈

- Vue 3 + Vite
- Tailwind CSS
- ECharts
- Exa Search API
- OpenAI / Anthropic API

## 快速开始

```bash
cd oneline
npm install
npm run dev
```

## 配置

点击设置按钮配置：
- Exa API Key（用于新闻搜索）
- LLM Provider（OpenAI / Anthropic）
- API Key 和模型选择

## 🙏 致谢

* 感谢[@snailyp](https://github.com/snailyp)大佬的[gemini-balance](https://github.com/snailyp/gemini-balance)项目，为本项目Demo提供了API支持
* 感谢所有贡献者和使用者的支持和反馈
[![Star History Chart](https://api.star-history.com/svg?repos=chengtx809/OneLine&type=Date)](https://www.star-history.com/#chengtx809/OneLine&Date)
