"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { StreamCallback } from '@/lib/api';
import { BarChart3, TrendingUp, Globe2, FileText } from 'lucide-react';
import { formatMarkdownText } from '@/lib/markdown';

interface ImpactAssessmentProps {
  query: string;
  isLoading?: boolean;
  onRequestImpact: (query: string, streamCallback?: StreamCallback) => Promise<string>;
}

export function ImpactAssessment({ query, isLoading = false, onRequestImpact }: ImpactAssessmentProps) {
  const [impactContent, setImpactContent] = useState<string>('');
  const [showImpact, setShowImpact] = useState<boolean>(false);
  const [isLoadingImpact, setIsLoadingImpact] = useState<boolean>(false);
  const [isStreamingImpact, setIsStreamingImpact] = useState<boolean>(false);
  const [currentStreaming, setCurrentStreaming] = useState<'economic' | 'social' | 'geopolitical' | null>(null);

  // 用于存储流式响应的ref
  const streamContentRef = useRef<string>('');

  // 解析后的影响评估内容
  const [parsedImpact, setParsedImpact] = useState<{
    economic: string;
    social: string;
    geopolitical: string;
  }>({
    economic: '',
    social: '',
    geopolitical: ''
  });

  // 清理流式响应缓存并自动触发评估
  useEffect(() => {
    if (!showImpact) {
      streamContentRef.current = '';
    }
  }, [showImpact]);

  // 在组件挂载且query有内容时自动开始评估
  useEffect(() => {
    if (query && !impactContent && !isLoadingImpact) {
      handleRequestImpact();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, impactContent, isLoadingImpact]);

  // 解析影响评估内容并确定当前正在流式传输的内容类型
  useEffect(() => {
    if (!impactContent) return;

    // 移除事件简介匹配，只关注影响部分
    const economicMatch = impactContent.match(/===经济影响===\s*([\s\S]*?)(?=\s*===社会影响===|$)/);
    const socialMatch = impactContent.match(/===社会影响===\s*([\s\S]*?)(?=\s*===地缘政治影响===|$)/);
    const geopoliticalMatch = impactContent.match(/===地缘政治影响===\s*([\s\S]*?)(?=$)/);

    const economic = economicMatch?.[1]?.trim() || '';
    const social = socialMatch?.[1]?.trim() || '';
    const geopolitical = geopoliticalMatch?.[1]?.trim() || '';

    setParsedImpact({
      economic,
      social,
      geopolitical
    });

    // 确定当前正在流式传输的内容类型
    if (isStreamingImpact) {
      if (geopoliticalMatch) {
        setCurrentStreaming('geopolitical');
      } else if (socialMatch) {
        setCurrentStreaming('social');
      } else {
        setCurrentStreaming('economic');
      }
    }
  }, [impactContent, isStreamingImpact]);

  const handleRequestImpact = async () => {
    setIsLoadingImpact(true);
    setIsStreamingImpact(true);
    setShowImpact(true);
    setImpactContent('');
    streamContentRef.current = '';
    setCurrentStreaming('economic');

    try {
      // 流式回调处理函数
      const streamCallback: StreamCallback = (chunk, isDone) => {
        streamContentRef.current += chunk;
        setImpactContent(streamContentRef.current);

        if (isDone) {
          setIsStreamingImpact(false);
          setIsLoadingImpact(false);
          setCurrentStreaming(null);
        }
      };

      // 使用流式请求
      await onRequestImpact(query, streamCallback);
    } catch (error) {
      console.error('Failed to fetch impact assessment:', error);
      setIsStreamingImpact(false);
      setIsLoadingImpact(false);
      setCurrentStreaming(null);
    }
  };

  const renderMarkdown = (content: string) => {
    const formatMarkdownText = (text: string) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      let formatted = text.replace(boldRegex, '<strong>$1</strong>');

      const italicRegex = /\*(.*?)\*/g;
      formatted = formatted.replace(italicRegex, '<em>$1</em>');

      const codeRegex = /`(.*?)`/g;
      formatted = formatted.replace(codeRegex, '<code>$1</code>');

      // 处理Markdown链接
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      formatted = formatted.replace(linkRegex, (match, text, url) => {
        const cleanUrl = url.replace(/[\)\]]$/, '');
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">${text}</a>`;
      });

      // 处理数字列表
      const numberListRegex = /(\d+\.\s+)(.*?)(?=\n|$)/g;
      formatted = formatted.replace(numberListRegex, '<span class="list-item">$1$2</span>');

      return formatted;
    };

    return (
      <div className="space-y-3 animate-fade-in">
        {content.split("\n\n").map((paragraph, index) => (
          <div
            key={`paragraph-${index}`}
            className="text-xs sm:text-sm leading-relaxed animate-fade-in"
            style={{animationDelay: `${0.15 * index}s`}}
            dangerouslySetInnerHTML={{
              __html: formatMarkdownText(paragraph.replace(/\n/g, '<br />'))
            }}
          />
        ))}
      </div>
    );
  };

  if (!query) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-2 sm:mb-4 impact-assessment-container">
      <Card className="glass-card rounded-xl overflow-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-xl flex items-center gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            影响评估
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            从多方面视角分析事件的影响
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          {!showImpact && (
            <div className="flex justify-center">
              <Button
                onClick={handleRequestImpact}
                disabled={isLoading || isLoadingImpact}
                className="rounded-full"
              >
                {isLoadingImpact && <div className="loading-spinner mr-2" />}
                {isLoadingImpact ? '分析中...' : '生成影响评估'}
              </Button>
            </div>
          )}

          {showImpact && (
            <div className="w-full flex flex-col gap-4 mt-2">
              {/* 经济影响卡片 */}
              <Card className={`glass-card border-0 transition-all duration-300 animate-fade-in shadow-md ${currentStreaming === 'economic' ? 'ring-2 ring-primary/40' : ''}`} style={{animationDelay: '0.1s'}}>
                <CardHeader className="p-2 sm:p-3 pb-0 flex flex-row items-center space-y-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-t-xl">
                  <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    经济影响
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-2">
                  {isLoadingImpact && !parsedImpact.economic ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                      <Skeleton className="h-3 w-4/5 rounded-md" />
                    </div>
                  ) : (
                    <div className="relative">
                      {renderMarkdown(parsedImpact.economic || '正在分析经济影响...')}
                      {currentStreaming === 'economic' && (
                        <div className="stream-cursor"></div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 社会影响卡片 */}
              <Card className={`glass-card border-0 transition-all duration-300 animate-fade-in shadow-md ${currentStreaming === 'social' ? 'ring-2 ring-primary/40' : ''}`} style={{animationDelay: '0.2s'}}>
                <CardHeader className="p-2 sm:p-3 pb-0 flex flex-row items-center space-y-0 bg-blue-500/10 dark:bg-blue-500/5 rounded-t-xl">
                  <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    社会影响
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-2">
                  {isLoadingImpact && !parsedImpact.social ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                      <Skeleton className="h-3 w-4/5 rounded-md" />
                    </div>
                  ) : (
                    <div className="relative">
                      {renderMarkdown(parsedImpact.social || '正在分析社会影响...')}
                      {currentStreaming === 'social' && (
                        <div className="stream-cursor"></div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 地缘政治影响卡片 */}
              <Card className={`glass-card border-0 transition-all duration-300 animate-fade-in shadow-md ${currentStreaming === 'geopolitical' ? 'ring-2 ring-primary/40' : ''}`} style={{animationDelay: '0.3s'}}>
                <CardHeader className="p-2 sm:p-3 pb-0 flex flex-row items-center space-y-0 bg-green-500/10 dark:bg-green-500/5 rounded-t-xl">
                  <CardTitle className="text-sm sm:text-base font-medium flex items-center gap-1.5 text-green-600 dark:text-green-400">
                    <Globe2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    地缘政治影响
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-2">
                  {isLoadingImpact && !parsedImpact.geopolitical ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                      <Skeleton className="h-3 w-4/5 rounded-md" />
                    </div>
                  ) : (
                    <div className="relative">
                      {renderMarkdown(parsedImpact.geopolitical || '正在分析地缘政治影响...')}
                      {currentStreaming === 'geopolitical' && (
                        <div className="stream-cursor"></div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx global>{`
        .stream-cursor {
          display: inline-block;
          width: 0.5ch;
          height: 1.15em;
          vertical-align: text-bottom;
          background: none;
          color: inherit;
          animation: stream-cursor-blink 1s steps(1) infinite;
          font-size: 1.1em;
          line-height: 1;
          margin-left: 1px;
        }
        .stream-cursor::after {
          content: "▌";
          display: inline-block;
        }
        @keyframes stream-cursor-blink {
          0% { opacity: 1; }
          49% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 0; }
        }

        /* List item styling */
        .list-item {
          display: block;
          padding-left: 0.5rem;
          margin-bottom: 0.25rem;
        }

        /* Enhanced text styling */
        strong {
          color: hsl(var(--primary));
          font-weight: 600;
        }

        /* Card active styling */
        .ring-primary\/40 {
          box-shadow: 0 0 15px rgba(var(--primary), 0.3);
          animation: pulse 2s infinite ease-in-out;
        }

        /* Better typing animation */
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        /* Text animation for each consecutive paragraph */
        .animate-fade-in > div:nth-child(1) { animation-delay: 0.1s; }
        .animate-fade-in > div:nth-child(2) { animation-delay: 0.2s; }
        .animate-fade-in > div:nth-child(3) { animation-delay: 0.3s; }
        .animate-fade-in > div:nth-child(4) { animation-delay: 0.4s; }
        .animate-fade-in > div:nth-child(5) { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
