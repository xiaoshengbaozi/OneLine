Skip to main content
Exa home pagelight logo

Search...
Ctrl K
Exa Search
Log Out
API Dashboard
Documentation
Examples
SDKs
Integrations
Websets
Changelog
API Status
GitHub
Discord
Blog
Getting Started
Overview
Quickstart
Exa MCP
Websets MCP
API Reference
POST
Search
POST
Get contents
POST
Find similar links
POST
Answer

Research
POST
Create a task
GET
Get a task
GET
List tasks

Team Management
POST
Create API Key
GET
List API Keys
GET
Get API Key
GET
Get API Key Usage
PUT
Update API Key
DEL
Delete API Key
Websets
Context (Exa Code)
OpenAPI Specification
Concepts
How Exa Search Works
The Exa Index
Contents Retrieval
Crawling Subpages
Livecrawling Contents
Exa Research
Migrating from Bing
FAQs
Make Exa Your Default Search Engine
Integrations
AI SDK by Vercel
Anthropic Tool Calling
OpenAI Tool Calling
OpenAI SDK Compatibility
OpenAI Responses API
LangChain
CrewAI
LlamaIndex
Exa for Google Sheets
Google ADK
Admin
Managing Your Team
Rate Limits
Error Codes
Enterprise Documentation & Security


curl -X POST 'https://api.exa.ai/contents' \
  -H 'x-api-key: YOUR-EXA-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "urls": ["https://arxiv.org/abs/2307.06435"],
    "text": true
  }'

200
{
  "requestId": "e492118ccdedcba5088bfc4357a8a125",
  "results": [
    {
      "title": "A Comprehensive Overview of Large Language Models",
      "url": "https://arxiv.org/pdf/2307.06435.pdf",
      "publishedDate": "2023-11-16T01:36:32.547Z",
      "author": "Humza  Naveed, University of Engineering and Technology (UET), Lahore, Pakistan",
      "id": "https://arxiv.org/abs/2307.06435",
      "image": "https://arxiv.org/pdf/2307.06435.pdf/page_1.png",
      "favicon": "https://arxiv.org/favicon.ico",
      "text": "Abstract Large Language Models (LLMs) have recently demonstrated remarkable capabilities...",
      "highlights": [
        "Such requirements have limited their adoption..."
      ],
      "highlightScores": [
        0.4600165784358978
      ],
      "summary": "This overview paper on Large Language Models (LLMs) highlights key developments...",
      "subpages": [
        {
          "id": "https://arxiv.org/abs/2303.17580",
          "url": "https://arxiv.org/pdf/2303.17580.pdf",
          "title": "HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face",
          "author": "Yongliang  Shen, Microsoft Research Asia, Kaitao  Song, Microsoft Research Asia, Xu  Tan, Microsoft Research Asia, Dongsheng  Li, Microsoft Research Asia, Weiming  Lu, Microsoft Research Asia, Yueting  Zhuang, Microsoft Research Asia, yzhuang@zju.edu.cn, Zhejiang  University, Microsoft Research Asia, Microsoft  Research, Microsoft Research Asia",
          "publishedDate": "2023-11-16T01:36:20.486Z",
          "text": "HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face Date Published: 2023-05-25 Authors: Yongliang Shen, Microsoft Research Asia Kaitao Song, Microsoft Research Asia Xu Tan, Microsoft Research Asia Dongsheng Li, Microsoft Research Asia Weiming Lu, Microsoft Research Asia Yueting Zhuang, Microsoft Research Asia, yzhuang@zju.edu.cn Zhejiang University, Microsoft Research Asia Microsoft Research, Microsoft Research Asia Abstract Solving complicated AI tasks with different domains and modalities is a key step toward artificial general intelligence. While there are abundant AI models available for different domains and modalities, they cannot handle complicated AI tasks. Considering large language models (LLMs) have exhibited exceptional ability in language understanding, generation, interaction, and reasoning, we advocate that LLMs could act as a controller to manage existing AI models to solve complicated AI tasks and language could be a generic interface to empower t",
          "summary": "HuggingGPT is a framework using ChatGPT as a central controller to orchestrate various AI models from Hugging Face to solve complex tasks. ChatGPT plans the task, selects appropriate models based on their descriptions, executes subtasks, and summarizes the results. This approach addresses limitations of LLMs by allowing them to handle multimodal data (vision, speech) and coordinate multiple models for complex tasks, paving the way for more advanced AI systems.",
          "highlights": [
            "2) Recently, some researchers started to investigate the integration of using tools or models in LLMs  ."
          ],
          "highlightScores": [
            0.32679107785224915
          ]
        }
      ],
      "extras": {
        "links": []
      }
    }
  ],
  "context": "<string>",
  "statuses": [
    {
      "id": "https://example.com",
      "status": "success",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ],
  "costDollars": {
    "total": 0.005,
    "breakDown": [
      {
        "search": 0.005,
        "contents": 0,
        "breakdown": {
          "neuralSearch": 0.005,
          "deepSearch": 0.015,
          "contentText": 0,
          "contentHighlight": 0,
          "contentSummary": 0
        }
      }
    ],
    "perRequestPrices": {
      "neuralSearch_1_25_results": 0.005,
      "neuralSearch_26_100_results": 0.025,
      "neuralSearch_100_plus_results": 1,
      "deepSearch_1_25_results": 0.015,
      "deepSearch_26_100_results": 0.075
    },
    "perPagePrices": {
      "contentText": 0.001,
      "contentHighlight": 0.001,
      "contentSummary": 0.001
    }
  }
}
API Reference
Get contents

Copy page

Get the full page contents, summaries, and metadata for a list of URLs.

Returns instant results from our cache, with automatic live crawling as fallback for uncached pages.

POST
/
contents

Try it
Get your Exa API key
Authorizations
​
x-api-key
stringheaderrequired
API key can be provided either via x-api-key header or Authorization header with Bearer scheme

Body
application/json
​
urls
string[]required
Array of URLs to crawl (backwards compatible with 'ids' parameter).

Example:
["https://arxiv.org/pdf/2307.06435"]
​
ids
string[]deprecated
Deprecated - use 'urls' instead. Array of document IDs obtained from searches.

Example:
["https://arxiv.org/pdf/2307.06435"]
​
text

boolean
If true, returns full page text with default settings. If false, disables text return.

​
highlights
object
Text snippets the LLM identifies as most relevant from each page.

Show child attributes

​
summary
object
Summary of the webpage

Show child attributes

​
livecrawl
enum<string>
Options for livecrawling pages.
'never': Disable livecrawling (default for neural search).
'fallback': Livecrawl when cache is empty.
'always': Always livecrawl.
'preferred': Always try to livecrawl, but fall back to cache if crawling fails.

Available options: never, fallback, always, preferred 
Example:
"always"

​
livecrawlTimeout
integerdefault:10000
The timeout for livecrawling in milliseconds.

Example:
1000

​
subpages
integerdefault:0
The number of subpages to crawl. The actual number crawled may be limited by system constraints.

Example:
1

​
subpageTarget

string
Term to find specific subpages of search results. Can be a single string or an array of strings, comma delimited.

Example:
"sources"

​
extras
object
Extra parameters to pass.

Show child attributes

​
context

boolean
Return page contents as a context string for LLM. When true, combines all result contents into one string. We recommend using 10000+ characters for best results, though no limit works best. Context strings often perform better than highlights for RAG applications.

Example:
true

Response
200 - application/json
OK

​
requestId
string
Unique identifier for the request

Example:
"e492118ccdedcba5088bfc4357a8a125"

​
results
object[]
Show child attributes

​
context
string
Return page contents as a context string for LLM. When true, combines all result contents into one string. Context strings often perform better than highlights for LLMs.

​
statuses
object[]
Status information for each requested URL

Show child attributes

​
costDollars
object
Show child attributes

Search
Find similar links
Ask a question...

x
discord
Powered by Mintlify
Get API Key - Exa