/*
  统一的大模型（LLM）转发工具
  目标：在服务端路由中复用，保证所有调用上游模型的行为一致

  能力概览：
  - 默认流式（SSE）返回，可配置为非流式 JSON 返回
  - 端点规范化：Azure OpenAI 与 OpenAI 兼容端点自动补齐为 chat/completions
  - 鉴权头自动区分：Azure 使用 api-key，其他使用 Authorization: Bearer
  - 统一超时（默认 60s）与请求中断（AbortController）
  - 统一错误结构，便于上层捕获与展示
*/

export interface LlmConfig {
  // 上游模型服务的基础配置
  endpoint: string;
  model: string;
  apiKey: string;
}

export interface ProxyOptions {
  // 代理调用的附加选项
  timeoutMs?: number;
  azureVersion?: string;
  responseMode?: 'stream' | 'json';
}

export interface UnifiedError {
  // 统一的错误返回结构，便于前端/上层统一处理
  error: string;
  message?: string;
  status?: number;
  statusText?: string;
  data?: unknown;
  request?: string;
  timeout?: boolean;
}

export function buildChatCompletionsUrl(
  endpoint: string,
  model: string,
  azureVersion = '2023-05-15'
): { apiUrl: string; isAzure: boolean; deployment?: string } {
  // 根据 endpoint 判定是否为 Azure OpenAI，随后规范化为 chat/completions 完整路径
  let apiUrl = endpoint;
  const isAzure = apiUrl.includes('openai.azure.com');

  if (isAzure) {
    // Azure：model 形如 "deployment@model"，deployment 在 @ 前
    const deployment = model.split('@')[0];
    if (!apiUrl.endsWith('/')) apiUrl += '/';
    apiUrl += `openai/deployments/${deployment}/chat/completions?api-version=${azureVersion}`;
    return { apiUrl, isAzure, deployment };
  }

  // OpenAI-compatible
  // 若不是 Azure，自动补全为 /chat/completions
  if (!apiUrl.endsWith('/chat/completions')) {
    if (!apiUrl.endsWith('/')) apiUrl += '/';
    apiUrl += 'chat/completions';
  }
  return { apiUrl, isAzure };
}

export function buildAuthHeaders(isAzure: boolean, apiKey: string): Record<string, string> {
  // 根据上游类型自动选择鉴权头
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isAzure) {
    headers['api-key'] = apiKey;
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  return headers;
}

export async function proxyChatCompletions(
  config: LlmConfig,
  payload: Record<string, any>,
  options: ProxyOptions = {}
): Promise<Response | { ok: true; data: any } | { ok: false; error: UnifiedError; status: number }> {
  // 超时与返回模式（默认根据 payload.stream 判定是否流式）
  const timeoutMs = options.timeoutMs ?? 60000;
  const azureVersion = options.azureVersion ?? '2023-05-15';
  const responseMode = options.responseMode ?? (payload.stream ? 'stream' : 'json');

  // 端点与鉴权头构建
  const { apiUrl, isAzure } = buildChatCompletionsUrl(config.endpoint, config.model, azureVersion);
  const headers = buildAuthHeaders(isAzure, config.apiKey);

  // 使用 AbortController 实现请求超时与中断
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // 发起到上游 chat/completions 的请求
    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!upstream.ok) {
      // 上游非 2xx：读取文本并统一包装为错误
      let errorText = '';
      try {
        errorText = await upstream.text();
      } catch {}
      const err: UnifiedError = {
        error: 'Upstream error',
        message: errorText || upstream.statusText,
        status: upstream.status,
        statusText: upstream.statusText,
      };
      // 流式模式下，上游错误直接以 JSON 响应返回（非 SSE），由前端按非 2xx 处理
      if (responseMode === 'stream') {
        return new Response(JSON.stringify(err), {
          status: upstream.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return { ok: false, error: err, status: upstream.status };
    }

    if (responseMode === 'stream') {
      // 流式：直接透传上游 SSE Body 与必要响应头
      return new Response(upstream.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
      });
    }

    // JSON mode
    // 非流式：读取文本，优先按 JSON 解析，失败则直接返回文本（兜底）
    let data: any = null;
    const text = await upstream.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // fallback
    }
    return { ok: true, data };
  } catch (e: any) {
    clearTimeout(timeoutId);
    // 本地网络/超时等异常：统一包装错误
    const err: UnifiedError = {
      error: 'Request failed',
      message: e?.message,
      request: 'Request was made but failed',
      timeout: e?.name === 'AbortError',
    };
    if (responseMode === 'stream') {
      return new Response(JSON.stringify(err), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return { ok: false, error: err, status: 500 };
  }
}


