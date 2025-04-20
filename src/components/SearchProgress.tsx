"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface SearchProgressStep {
  id: string;
  message: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: Date;
}

interface SearchProgressProps {
  steps: SearchProgressStep[];
  visible: boolean;
  isActive: boolean;
}

export function SearchProgress({ steps, visible, isActive }: SearchProgressProps) {
  if (!visible) return null;

  return (
    <Card className="search-progress-card">
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <span className="mr-2">搜索进度</span>
          {isActive && (
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          )}
        </h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start text-xs">
              <div className="mr-2 mt-1">
                {step.status === 'pending' && (
                  <div className="loading-dot h-2 w-2"></div>
                )}
                {step.status === 'completed' && (
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                )}
                {step.status === 'error' && (
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xs ${step.status === 'error' ? 'text-red-500' : ''}`}>
                  {step.message}
                </p>
                {step.status === 'pending' && (
                  <Skeleton className="h-2 w-full mt-1 rounded-sm" />
                )}
              </div>
              <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
