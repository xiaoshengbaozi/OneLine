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


curl -X POST 'https://api.exa.ai/search' \
  -H 'x-api-key: YOUR-EXA-API-KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "Latest research in LLMs",
    "text": true
  }'

200
{
  "requestId": "b5947044c4b78efa9552a7c89b306d95",
  "resolvedSearchType": "neural",
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
  "searchType": "auto",
  "context": "<string>",
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
Search

Copy page

The search endpoint lets you intelligently search the web and extract contents from the results.

By default, it automatically chooses the best search method using Exa’s embeddings-based model and other techniques to find the most relevant results for your query. You can also use Deep search for comprehensive results with query expansion and detailed context.

POST
/
search

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
query
stringdefault:Latest developments in LLM capabilitiesrequired
The query string for the search.

Example:
"Latest developments in LLM capabilities"

​
additionalQueries
string[]
Additional query variations for deep search. Only works with type="deep". When provided, these queries are used alongside the main query for comprehensive results.

Example:
[
  "LLM advancements",
  "large language model progress"
]
​
type
enum<string>default:auto
The type of search. Neural uses an embeddings-based model, auto (default) intelligently combines neural and other search methods, fast uses streamlined versions of the search models, and deep provides comprehensive search with query expansion and detailed context.

Available options: neural, fast, auto, deep 
Example:
"auto"

​
category
enum<string>
A data category to focus on.

Available options: company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report 
Example:
"research paper"

​
userLocation
string
The two-letter ISO country code of the user, e.g. US.

Example:
"US"

​
numResults
integerdefault:10
Number of results to return. Limits vary by search type:

With "neural": max 100 results
With "deep": max 100 results
If you want to increase the num results beyond these limits, contact sales (hello@exa.ai)

Required range: x <= 100
Example:
10

​
includeDomains
string[]
List of domains to include in the search. If specified, results will only come from these domains.

Maximum array length: 1200
Example:
["arxiv.org", "paperswithcode.com"]
​
excludeDomains
string[]
List of domains to exclude from search results. If specified, no results will be returned from these domains.

Maximum array length: 1200
​
startCrawlDate
string<date-time>
Crawl date refers to the date that Exa discovered a link. Results will include links that were crawled after this date. Must be specified in ISO 8601 format.

Example:
"2023-01-01T00:00:00.000Z"

​
endCrawlDate
string<date-time>
Crawl date refers to the date that Exa discovered a link. Results will include links that were crawled before this date. Must be specified in ISO 8601 format.

Example:
"2023-12-31T00:00:00.000Z"

​
startPublishedDate
string<date-time>
Only links with a published date after this will be returned. Must be specified in ISO 8601 format.

Example:
"2023-01-01T00:00:00.000Z"

​
endPublishedDate
string<date-time>
Only links with a published date before this will be returned. Must be specified in ISO 8601 format.

Example:
"2023-12-31T00:00:00.000Z"

​
includeText
string[]
List of strings that must be present in webpage text of results. Currently, only 1 string is supported, of up to 5 words.

Example:
["large language model"]
​
excludeText
string[]
List of strings that must not be present in webpage text of results. Currently, only 1 string is supported, of up to 5 words. Checks from the first 1000 words of the webpage text.

Example:
["course"]
​
context

boolean
Return page contents as a context string for LLM. When true, combines all result contents into one string. We recommend using 10000+ characters for best results, though no limit works best. Context strings often perform better than highlights for RAG applications.

Example:
true

​
moderation
booleandefault:false
Enable content moderation to filter unsafe content from search results.

Example:
true

​
contents
object
Show child attributes

Response
200 - application/json
OK

​
requestId
string
Unique identifier for the request

Example:
"b5947044c4b78efa9552a7c89b306d95"

​
resolvedSearchType
enum<string>
The search type that was actually used for this request

Available options: neural, deep 
Example:
"neural"

​
results
object[]
A list of search results containing title, URL, published date, and author.

Show child attributes

​
searchType
enum<string>
For auto searches, indicates which search type was selected.

Available options: neural, deep 
Example:
"auto"

​
context
string
Return page contents as a context string for LLM. When true, combines all result contents into one string. Context strings often perform better than highlights for LLMs.

​
costDollars
object
Show child attributes

Websets MCP
Get contents
Ask a question...

x
discord
Powered by Mintlify
Get API Key - Exa