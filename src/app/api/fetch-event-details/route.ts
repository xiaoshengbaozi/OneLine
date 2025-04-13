import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


type ApiConfig = {
  endpoint: string;
  model: string;
  apiKey: string;
};



const SYSTEM_PROMPT = `你是一个专业的历史事件分析助手，专长于提供详细的事件分析和背景信息。
请按照以下格式回答用户询问的特定事件：

===背景===
事件的背景和前因

===详细内容===
事件的主要内容，按时间顺序或重要性组织

===参与方===
事件的主要参与者、相关人物及其立场和作用

===影响===
事件的短期和长期影响

===相关事实===
与事件相关的重要事实或数据

请注意：
1. 使用清晰的段落结构，避免过长的段落
2. 保持客观中立的叙述，多角度展示事件
3. 支持使用Markdown语法增强可读性：
   - **粗体** 用于强调重要内容
   - *斜体* 用于引用或细微强调
   - 使用换行符增加可读性
4. 回答应全面但精炼，突出重点，避免冗余`;


export async function POST(req: NextRequest) {
  try {
    const {  eventId,detailedQuery, apiConfig }: { eventId: string;detailedQuery: string; apiConfig: ApiConfig } = await req.json();

    const payload = {
      model: apiConfig.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `请详细分析以下事件的背景、过程、影响及各方观点：${detailedQuery}`
        }
      ],
      temperature: 0.7
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiConfig.apiKey}`
    };

    const response = await axios.post(apiConfig.endpoint, payload, { headers });
    const content = response.data.choices[0].message.content;

    return NextResponse.json( content );
  } catch (error: any) {
    console.error('API request failed:', error?.response?.data || error.message);
    return NextResponse.json({ error: '调用 API 失败' }, { status: 500 });
  }
}
