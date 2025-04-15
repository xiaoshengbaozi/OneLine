import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "一线 - AI驱动的热点事件时间轴",
  description: "使用AI技术，快速生成热点事件的时间轴，帮助您洞察事件发展脉络，获得全面的历史视角。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
