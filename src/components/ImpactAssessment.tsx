"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StreamCallback } from '@/lib/api';
import { BarChart3, TrendingUp, Globe2 } from 'lucide-react';

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

  // 清理流式响应缓存
  useEffect(() => {
    if (!showImpact) {
      streamContentRef.current = '';
    }
  }, [showImpact]);

  // 解析影响评估内容
  useEffect(() => {
    if (!impactContent) return;

    const economicMatch = impactContent.match(/===经济影响===\s*([\s\S]*?)(?=\s*===社会影响===|$)/);
    const socialMatch = impactContent.match(/===社会影响===\s*([\s\S]*?)(?=\s*===地缘政治影响===|$)/);
    const geopoliticalMatch = impactContent.match(/===地缘政治影响===\s*([\s\S]*?)(?=$)/);

    setParsedImpact({
      economic: economicMatch?.[1]?.trim() || '暂无经济影响评估数据',
      social: socialMatch?.[1]?.trim() || '暂无社会影响评估数据',
      geopolitical: geopoliticalMatch?.[1]?.trim() || '暂无地缘政治影响评估数据'
    });
  }, [impactContent]);

  const handleRequestImpact = async () => {
    setIsLoadingImpact(true);
    setIsStreamingImpact(true);
    setShowImpact(true);
    setImpactContent('');
    streamContentRef.current = '';

    try {
      // 流式回调处理函数
      const streamCallback: StreamCallback = (chunk, isDone) => {
        streamContentRef.current += chunk;
        setImpactContent(streamContentRef.current);

        if (isDone) {
          setIsStreamingImpact(false);
          setIsLoadingImpact(false);
        }
      };

      // 使用流式请求
      await onRequestImpact(query, streamCallback);
    } catch (error) {
      console.error('Failed to fetch impact assessment:', error);
      setIsStreamingImpact(false);
      setIsLoadingImpact(false);
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

      return formatted;
    };

    return (
      <div className="space-y-4">
        {content.split("\n\n").map((paragraph, index) => (
          <div
            key={`paragraph-${index}`}
            className="text-sm"
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
    <div className="w-full max-w-3xl mx-auto mb-8">
      <Card className="glass-card rounded-xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            影响评估
          </CardTitle>
          <CardDescription>
            从经济、社会和地缘政治视角分析事件可能的影响
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {!showImpact && (
            <div className="flex justify-center">
              <Button
                onClick={handleRequestImpact}
                disabled={isLoading || isLoadingImpact}
                className="rounded-full"
              >
                {isLoadingImpact ? (
                  <div className="loading-spinner mr-2" />
                ) : null}
                {isLoadingImpact ? '分析中...' : '生成影响评估'}
              </Button>
            </div>
          )}

          {showImpact && (
            <div className="w-full">
              {(!isLoadingImpact || (isStreamingImpact && impactContent)) ? (
                <Tabs defaultValue="economic" className="w-full">
                  <TabsList className="mb-4 grid grid-cols-3 h-auto">
                    <TabsTrigger value="economic" className="flex items-center gap-1 py-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">经济影响</span>
                      <span className="sm:hidden">经济</span>
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-1 py-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">社会影响</span>
                      <span className="sm:hidden">社会</span>
                    </TabsTrigger>
                    <TabsTrigger value="geopolitical" className="flex items-center gap-1 py-2">
                      <Globe2 className="h-4 w-4" />
                      <span className="hidden sm:inline">地缘政治影响</span>
                      <span className="sm:hidden">地缘</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="economic" className="mt-0">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="relative">
                          {renderMarkdown(parsedImpact.economic)}
                          {isStreamingImpact && (
                            <div className="stream-cursor"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="social" className="mt-0">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="relative">
                          {renderMarkdown(parsedImpact.social)}
                          {isStreamingImpact && (
                            <div className="stream-cursor"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="geopolitical" className="mt-0">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="relative">
                          {renderMarkdown(parsedImpact.geopolitical)}
                          {isStreamingImpact && (
                            <div className="stream-cursor"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-full rounded-md" />
                  <Skeleton className="h-3 sm:h-4 w-full rounded-md" />
                  <Skeleton className="h-3 sm:h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-3 sm:h-4 w-4/5 rounded-md" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 流式光标样式 */}
      <style jsx global>{`
        .stream-cursor {
          display: inline-block;
          width: 1ch;
          height: 1.15em;
          vertical-align: bottom;
          background: none;
          color: inherit;
          font-weight: bold;
          animation: stream-cursor-blink 1s steps(1) infinite;
          font-size: 1.3em;
          line-height: 1;
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
      `}</style>
    </div>
  );
}
