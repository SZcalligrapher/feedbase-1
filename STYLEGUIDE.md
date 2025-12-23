# Feedbase Style Guide (Inspired by UserJot)

## 🎯 1. Brand Positioning

**Brand Promise**  
打造一个简洁、现代、专业且高效的用户反馈与洞察平台，让创作者/产品团队能轻松收集反馈、优先级排序并推动执行。

**核心价值关键词**  
- 简洁（Minimal）  
- 现代（Modern, Techy）  
- 可操作（Action-driven）  
- 可信赖（Credible, Transparent）  
- 专注导航与转化（Clear info hierarchy）  

---

## 🎨 2. Visual Identity

### Color Palette

| 用途 | 颜色值 | CSS 变量 |
|------|--------|----------|
| Primary Background | `#FFFFFF` | `--background: 0 0% 100%` |
| Accent / CTA | `#0066FF` / `#0052CC` | `--primary: 217 91% 60%` |
| Text Primary | `#111827` | `--foreground: 222 47% 11%` |
| Text Secondary | `#6B7280` | `--muted-foreground: 215 16% 47%` |
| UI Border / Divider | `#E5E7EB` | `--border: 220 13% 91%` |
| Sidebar Background | `#FFFFFF` | `--card: 0 0% 100%` |
| Sidebar Hover | `#F9FAFB` | `--accent: 220 14% 96%` |

> 冷色调、简洁、科技感。

### Fonts

```css
--font-base: "Inter", sans-serif;
--font-heading: "Inter", sans-serif;
--font-mono: "Fira Code", monospace;
```

**字体大小规范：**
- H1 / Hero — 48px / Bold
- H2 / Section Title — 32px / Semi-Bold
- H3 / Subsection — 24px / Semi-Bold
- Body — 16px / Regular
- Small Text / Caption — 14px / Regular
- Sidebar Text — 14px / Medium

---

## 🔤 3. Content Tone & Style

**简洁直接：** 避免冗长描述

**价值驱动：** 强调用户可得到的具体结果

**动词优先：** 如 "Collect feedback", "Prioritize ideas", "Show roadmap"

**透明友好：** 展示收益 & 操作路径清晰

**示例：**
> Collect feedback wherever your audience is. Public boards, embedded widgets, or in-product flows.

---

## 🧱 4. Layout & UI Principles

### 页面结构

```
┌─────────────────────────────────────┐
│  Header (Logo + User Menu)          │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │  Main Content Area       │
│ (可收起)  │                          │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

### 导航

- 简洁菜单（Pricing / Help / Blog / Product / Sign In）
- CTA 按钮使用 Primary Accent 颜色
- 侧边栏固定在左侧，支持收起/展开

### 信息层级

- CTA 显眼
- 留白分隔逻辑块
- 图片/图标辅助理解
- 清晰的视觉层次

---

## 🧩 5. Buttons & Interaction

### Primary Button

```css
.btn-primary {
  background: #0066FF;
  color: white;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
}
```

### Secondary Button

```css
.btn-secondary {
  background: #FFFFFF;
  border: 2px solid #0066FF;
  color: #0066FF;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #111827;
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
}
```

**按钮类型：**
- 主行动按钮（Primary CTA）：Sign Up / Get Started
- 次级按钮（Secondary CTA）：Learn More / View Pricing
- Ghost 按钮：用于次要操作

---

## 🧠 6. Copywriting Standards

### Headline（主标题）
一行概括核心价值，动词优先

**示例：**
> Build what users really want

### Subheadline（副标题）
更具体说明如何实现价值

**示例：**
> Collect, organize, and prioritize feedback — all in one place.

### Section Titles（段落标题）
聚焦结果

**示例：**
> Turn feedback into a roadmap

### Button Labels
动词开头：Get Started Free / Try Now / View Roadmap

---

## 📱 7. Responsive & Accessible Design

- 组件适配不同屏幕尺寸（Mobile ↔ Desktop）
- 按钮高度至少 44px
- 文本对比度符合可访问标准（WCAG AA）
- 所有图片添加 alt 文本
- 键盘导航支持

---

## 📦 8. UI Components Overview

### Feature Card

```tsx
<div className="p-6 bg-white border border-gray-200 rounded-lg">
  <Icon className="mb-4" />
  <h3 className="text-xl font-semibold mb-2">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Stats Block

```tsx
<div className="text-center">
  <div className="text-3xl font-bold text-gray-900">40%</div>
  <div className="text-sm text-gray-600">more feedback submissions</div>
</div>
```

### Sidebar

- 固定在左侧
- 宽度：展开 240px，收起 64px
- 背景：白色 (#FFFFFF)
- 悬停效果：浅灰色背景 (#F9FAFB)
- 支持收起/展开动画

---

## 📌 9. Examples (参考块)

### Hero Section

```tsx
<section className="bg-white py-20">
  <h1 className="text-5xl font-bold text-gray-900 mb-4">
    Feedbase — Understand your audience instantly.
  </h1>
  <p className="text-xl text-gray-600 mb-8">
    Collect feedback, organize ideas, and build a content roadmap that resonates.
  </p>
  <button className="btn-primary">
    Get Started Free
  </button>
</section>
```

---

## 📝 10. Footer Sections

- **Product** - Features, Pricing, Changelog
- **Resources** - Docs, Blog, Help Center
- **Legal** - Privacy Policy, Terms of Service
- **Social Links** - GitHub, Twitter, Discord

---

## 🚀 11. Implementation Guidelines

### 技术栈

- 使用 Tailwind CSS 实现样式
- React / Next.js 组件化开发
- 文案结构化，支持本地化
- 坚持 UI 一致性：按钮、标题、间距规则

### 间距系统

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### 圆角系统

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
```

### 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

---

## 🎨 12. Sidebar Design

### 展开状态
- 宽度：240px
- 显示：图标 + 文字标签
- 背景：白色 (#FFFFFF)
- 边框：右侧 1px 灰色 (#E5E7EB)

### 收起状态
- 宽度：64px
- 显示：仅图标
- 悬停：显示工具提示（Tooltip）

### 交互状态
- 默认：透明背景
- Hover：浅灰色背景 (#F9FAFB)
- Active：蓝色背景 (#0066FF) + 白色文字
- 过渡动画：200ms ease-in-out

---

## 📋 13. Checklist

- [ ] 白色主题配色
- [ ] 侧边栏左侧固定
- [ ] 侧边栏收起功能
- [ ] 清晰的视觉层次
- [ ] 响应式设计
- [ ] 无障碍访问支持
- [ ] 一致的间距系统
- [ ] 统一的按钮样式

