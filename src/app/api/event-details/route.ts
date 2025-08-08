import { NextResponse } from 'next/server';
import { proxyChatCompletions } from '@/lib/server/llmProxy';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// 添加改进的系统提示，使分析更具动态性和相关性
const EVENT_DETAILS_SYSTEM_PROMPT = `你是一个专业的历史事件分析助手，专长于提供详细的事件分析和背景信息。
在回答问题前，你将获得搜索引擎的最新信息，请使用这些信息来确保你的回答是基于最新的事实。

请针对用户询问的特定事件，提供有选择性的分析，但不要强行分析所有方面。
根据事件特性，选择性地涵盖以下部分，而不是机械地覆盖所有分析模块：

===背景===
事件的背景和前因，包括历史脉络、相关事件和潜在因素。请尽可能提供具体的日期、人物和地点信息。

===详细内容===
事件的主要内容，按时间顺序或重要性组织，提供具体日期和事实。详细描述事件的整个过程，包括重要转折点、关键决策和各方反应。

===参与方===
仅当事件涉及多个重要参与者或存在不同立场时才分析此部分。
分析事件的主要参与者、相关人物及其立场和作用。清晰说明各方利益关系、动机和目标。

===多源分析===
仅当事件存在明显的信息差异或多种解读时才分析此部分。
从不同来源的信息中分析事件的全貌。比较不同观点的可信度和证据基础，指出可能更准确的解读。

===影响===
仅当事件具有明显影响时才分析此部分。
分析事件的短期和长期影响，包括政治、经济、社会或环境方面。评估事件引起的变化和历史意义。

===相关事实===
仅当有重要的事实或数据支持分析时才包含此部分。
提供与事件相关的重要事实或数据，包括可靠统计数据、研究结果或官方信息。

请记住：
1. 不是所有部分都需要包含在每次分析中
2. 根据事件性质决定分析哪些方面
3. 避免空洞或牵强的内容，宁可省略某个部分也不要提供无实质内容的分析
4. 保持客观中立的叙述，多角度展示事件
5. 使用清晰的段落结构和Markdown格式增强可读性
6. 明确指出信息的局限性，避免过度推断
`

export async function POST(request: Request) {
  try {
    // 从环境变量中获取 API 密钥和端点
    const envApiKey = process.env.API_KEY;
    const envApiEndpoint = process.env.API_ENDPOINT;
    const envApiModel = process.env.API_MODEL || 'gemini-2.0-pro-exp-search';

    // 解析请求体
    const requestData = await request.json();

    // 默认流式
    const streamMode = requestData.stream !== false;

    // 检查请求中是否使用环境变量配置的标记
    const isUsingEnvConfig =
      requestData.model === "使用环境变量配置" ||
      requestData.endpoint === "使用环境变量配置" ||
      requestData.apiKey === "使用环境变量配置";

    // 如果请求表明要使用环境变量配置，但环境变量没有配置
    if (isUsingEnvConfig && (!envApiKey || !envApiEndpoint)) {
      return NextResponse.json(
        { error: '服务器端API配置缺失，请手动配置API参数' },
        { status: 500 }
      );
    }

    // 如果没有配置 API 密钥或端点，返回错误
    if (!isUsingEnvConfig && (!requestData.apiKey || !requestData.endpoint)) {
      return NextResponse.json(
        { error: 'API key or endpoint not configured in request' },
        { status: 400 }
      );
    }

    // 如果请求中包含 model 参数，则使用请求中的 model，否则使用环境变量中的 model
    const model = isUsingEnvConfig ? envApiModel : (requestData.model || envApiModel);
    const endpoint: string = isUsingEnvConfig ? (envApiEndpoint as string) : requestData.endpoint;
    const apiKey: string = isUsingEnvConfig ? (envApiKey as string) : requestData.apiKey;

    // 添加系统提示到消息中
    if (Array.isArray(requestData.messages) && requestData.messages.length > 0) {
      // 在用户消息之前插入系统提示
      requestData.messages.unshift({
        role: "system",
        content: EVENT_DETAILS_SYSTEM_PROMPT
      });
    }

    // 构建实际发送给 API 的请求体（仅保留上游需要字段）
    const payload = {
      model,
      messages: requestData.messages || [],
      temperature: requestData.temperature ?? 0.7,
      stream: streamMode,
    };

    const res = await proxyChatCompletions(
      { endpoint, model, apiKey },
      payload,
      { timeoutMs: 60000, responseMode: streamMode ? 'stream' : 'json' },
    );

    if (res instanceof Response) {
      return res;
    }

    if (res.ok) {
      return NextResponse.json(res.data);
    }

    return NextResponse.json(res.error, { status: res.status });
  } catch (error: any) {
    console.error('Event details API route error:', error);

    return NextResponse.json(
      { error: 'API request failed', message: error?.message },
      { status: 500 }
    );
  }
}
