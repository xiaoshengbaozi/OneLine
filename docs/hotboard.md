查询热榜
想快速跟上网络热点？这个接口让你一网打尽各大主流平台的实时热榜/热搜！

GET
uapis.cn
/api/v1/misc/hotboard

试一试

功能概述
你只需要指定一个平台类型，就能获取到该平台当前的热榜数据列表。每个热榜条目都包含标题、热度值和原始链接。非常适合用于制作信息聚合类应用或看板。

可选值
type 参数接受多种不同的值，每种值对应一个不同的热榜来源。以下是目前支持的所有值：

分类	支持的 type 值
视频/社区	bilibili（哔哩哔哩弹幕网）, acfun（A站弹幕视频网站）, weibo（新浪微博热搜）, zhihu（知乎热榜）, zhihu-daily（知乎日报热榜）, douyin（抖音热榜）, kuaishou（快手热榜）, douban-movie（豆瓣电影榜单）, douban-group（豆瓣小组话题）, tieba（百度贴吧热帖）, hupu（虎扑热帖）, miyoushe（米游社话题榜）, ngabbs（NGA游戏论坛热帖）, v2ex（V2EX技术社区热帖）, 52pojie（吾爱破解热帖）, hostloc（全球主机交流论坛）, coolapk（酷安热榜）
新闻/资讯	baidu（百度热搜）, thepaper（澎湃新闻热榜）, toutiao（今日头条热榜）, qq-news（腾讯新闻热榜）, sina（新浪热搜）, sina-news（新浪新闻热榜）, netease-news（网易新闻热榜）, huxiu（虎嗅网热榜）, ifanr（爱范儿热榜）
技术/IT	sspai（少数派热榜）, ithome（IT之家热榜）, ithome-xijiayi（IT之家·喜加一栏目）, juejin（掘金社区热榜）, jianshu（简书热榜）, guokr（果壳热榜）, 36kr（36氪热榜）, 51cto（51CTO热榜）, csdn（CSDN博客热榜）, nodeseek（NodeSeek 技术社区）, hellogithub（HelloGitHub 项目推荐）
游戏	lol（英雄联盟热帖）, genshin（原神热榜）, honkai（崩坏3热榜）, starrail（星穹铁道热榜）
其他	weread（微信读书热门书籍）, weatheralarm（天气预警信息）, earthquake（地震速报）, history（历史上的今天）
查询参数
type
string
required
你想要查询的热榜平台。支持多种主流平台类型，详见下方可选值表格。

响应
200 / 请求成功
查询成功！返回指定平台的热榜列表数据。

{
  // 热榜条目列表。
  "list": [
    {
      // 额外信息，不同平台该字段内容不同，例如微博热搜的标签（如'新'、'爆'）。
      "extra": {},
      "hot_value": "1234567",
      "index": 1,
      "title": "今天天气真好",
      "url": "https://s.weibo.com/weibo?q=%23%E4%BB%8A%E5%A4%A9%E5%A4%A9%E6%B0%94%E7%9C%9F%E5%A5%BD%23"
    }
  ],
  "type": "weibo",
  "update_time": "2023-10-27 12:00:00"
}

400 / 错误的请求
请求参数错误。你提供的 type 参数不是我们支持的平台类型，请检查拼写。

{
  "code": "INVALID_ARGUMENT",
  "details": {},
  "message": "Invalid hotboard type specified."
}

500 / 服务器内部错误
获取热榜失败。服务器在处理数据时发生内部错误。

{
  "code": "INTERNAL_SERVER_ERROR",
  "details": {},
  "message": "Failed to process hotboard data."
}

502 / 网关错误
上游服务错误。我们从目标平台（如微博）获取数据时失败，可能是对方接口暂时不可用或有反爬策略。

{
  "code": "UPSTREAM_ERROR",
  "details": {},
  "message": "Failed to fetch hotboard from upstream source."
}