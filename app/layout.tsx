import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2076 GT · 热管理设计工作台",
  description: "从一条热流，构建完整系统。高性能插混 GT 概念车的个人工程研究工作台。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
