# 🍥 UpXuu's Blog

这是基于 [Fuwari](https://github.com/saicaca/fuwari) 模板构建的个人博客，由 UpXuu 维护和定制。

[**🖥️ 访问我的博客**](https://upxuu.com)

## 🎯 主要特性

在 Fuwari 原有功能的基础上，我添加了以下定制内容：

- ✅ SEO 优化：集成 [astro-seo](https://github.com/jonasmerlin/astro-seo) 插件
- ✅ JSON-LD 结构化数据：支持文章、关于页面、归档页面等
- ✅ 友链页面：支持友链申请和展示，自动化审核流程
- ✅ 移动端优化：完善响应式设计
- ✅ 评论功能：集成 Waline 评论系统，支持反应、表情和暗色模式
- ✅ Commit 信息展示：页脚显示最新 Git commit 信息
- ✅ 页面过渡：使用 Swup 实现平滑页面切换
- ✅ 欢迎弹窗：首次访问显示地理位置欢迎信息
- ✅ 开往集成：加入 [Travellings](https://www.travellings.cn/) 友链接力计划
- ✅ 更新日志页面：展示完整的 Git commit 历史
- ✅ 图片画廊：基于文件系统的相册系统，支持 WebP 压缩缩略图、Fancybox 灯箱、blur-up 懒加载
- ✅ QQ群页面：独立 `/q` 页面展示群二维码，导航栏快捷入口

## 🤝 友链申请

本站支持**自动化友链申请**流程，基于 GitHub Issue 和 GitHub Action：

### 申请流程

1. **提交申请**: 在 [GitHub Issues](https://github.com/ImUpXuu/myblog/issues/new?template=friend-request.yml) 填写友链申请模板
2. **自动验证**:
   - 第一步：Playwright 浏览器访问友链页面测试连通性
   - 第二步：检查页面是否包含 `upxuu.com` 友链
3. **处理结果**:
   - ✅ **验证通过**: 自动更新 `friends.json`，回复友链信息供确认，关闭 Issue
   - ❌ **验证失败**: 回复具体失败原因（无法访问或未找到本站友链），保持 Issue 开放

### 每日自动巡检

每天 16:00 (UTC+8) 自动检查所有友链的连通性，异常情况会通知对应的友链申请 Issue 并标记异常。

### 本站友链信息

```yaml
名称: UpXuu
链接: https://upxuu.com
头像: https://upxuu.com/images/20260214145619.jpg
描述: 逐光而上
```

### 技术实现

- **数据源**: `myblog/public/data/friends.json` 存储所有友链数据
- **自动化**: `.github/workflows/friend-link-checker.yml` 监听 Issue 事件并自动更新友链
- **定时巡检**: `.github/workflows/cron-check.yml` 每日检查所有友链状态
- **模板**: `.github/ISSUE_TEMPLATE/friend-request.yml` 标准化申请格式

---

## 📅 更新日志

### 2026-05-03
- 灯箱从 Fancybox 迁移至 [Lightbox 3](https://lokeshdhakar.com/projects/lightbox3)，零依赖、spring 动画、原生支持缩略图→大图过渡
- 修复灯箱点击跳转原图而非打开灯箱的问题：改用 `content:replace` 钩子 + capture 阶段事件委托兜底
- 优化画廊懒加载体验：缩略图初始清晰显示，原图加载完成后短暂模糊过渡再替换

### 2026-04-26
- 新增手机端目录功能：右下角圆形进度按钮，点击丝滑弹出目录面板
- 优化评论区样式，提升深色模式下文字对比度和背景不透明度
- 默认主题改回浅色模式
- 右侧目录添加全局背景，提升在复杂背景下的可读性
- README 更新评论功能描述为 Waline 评论系统

### 2026-04-24
- 重构友链自动化流程，基于 Issue 事件直接更新 `friends.json`
- 新增自动去重机制（根据 URL 判断是否重复）
- 自动关闭已处理的友链申请 Issue 并回复确认信息

### 2026-04-19
- 修复 GitHub Action 友链验证中 Playwright 安装失败的问题（改用 `.cjs` 解决 ESM 问题）
- 修复 Issue 内容提取逻辑，`awk` 替代 `grep` 正确解析表单数据
- 友链申请表单新增"友链页面 URL"字段（可选）
- 验证通过自动更新 `friends.json` 并关闭 Issue，失败则回复后关闭
- 验证同时检查页面内容和所有链接，提高通过率

---

## 🍥 关于原项目 Fuwari

[**🖥️ Live Demo (Vercel)**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)



## ✨ 原项目特性

- [x] 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] 流畅的动画和页面过渡效果
- [x] 亮色/暗色模式切换
- [x] 可自定义的主题颜色和横幅
- [x] 响应式设计
- [x] 搜索功能（使用 [Pagefind](https://pagefind.app/)）
- [x] [Markdown 扩展语法](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] 目录导航
- [x] RSS 订阅
- [x] SEO 优化

## 🎨 主题配置

要更改默认主题模式，编辑 `src/constants/constants.ts`：

```typescript
export const DEFAULT_THEME = LIGHT_MODE; // 选项：LIGHT_MODE, DARK_MODE
```

- `LIGHT_MODE`: 始终使用亮色模式（默认）
- `DARK_MODE`: 始终使用暗色模式

## 🚀 快速开始

1. 创建你的博客仓库：
    - [从此模板生成新仓库](https://github.com/saicaca/fuwari/generate) 或 Fork 此仓库
    - 或者运行以下命令之一：
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. 在本地编辑你的博客，克隆你的仓库后运行 `pnpm install` 安装依赖
    - 如果尚未安装 [pnpm](https://pnpm.io)，运行 `npm install -g pnpm`
3. 编辑配置文件 `src/config.ts` 来定制你的博客
4. 运行 `pnpm new-post <filename>` 创建新文章，然后在 `src/content/posts/` 中编辑
5. 按照 [部署指南](https://docs.astro.build/en/guides/deploy/) 将博客部署到 Vercel、Netlify、GitHub Pages 等平台，部署前需要编辑 `astro.config.mjs` 中的站点配置

## 📝 文章 Frontmatter 配置

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我的新 Astro 博客的第一篇文章
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中的网站语言不同时设置
---
```

## 🧩 Markdown 扩展语法

除了 Astro 默认支持的 [GitHub Flavored Markdown](https://github.github.com/gfm/) 外，还包括以下额外的 Markdown 功能：

- 提示框（[预览和使用](https://fuwari.vercel.app/posts/markdown-extended/#admonitions)）
- GitHub 仓库卡片（[预览和使用](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards)）
- 增强的代码块（使用 Expressive Code）（[预览](https://fuwari.vercel.app/posts/expressive-code/) / [文档](https://expressive-code.com/)）

## ⚡ 常用命令

所有命令都在项目根目录的终端中运行：

| 命令                       | 说明                                                |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | 安装依赖                                            |
| `pnpm dev`                 | 启动本地开发服务器（`localhost:4321`）              |
| `pnpm build`               | 构建生产站点到 `./dist/`                            |
| `pnpm preview`             | 本地预览构建结果                                    |
| `pnpm check`               | 检查代码错误                                        |
| `pnpm format`              | 使用 Biome 格式化代码                               |
| `pnpm new-post <filename>` | 创建新文章                                          |
| `pnpm astro ...`           | 运行 Astro CLI 命令，如 `astro add`、`astro check`  |
| `pnpm astro --help`        | 获取 Astro CLI 使用帮助                             |

## ✏️ 贡献

查看 [贡献指南](https://github.com/saicaca/fuwari/blob/main/CONTRIBUTING.md) 了解如何参与此项目的贡献。

## 📄 许可证

本项目采用 MIT 许可证。

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)
