***

title: 给博客接入 IndexNow + Bing 自动索引
published: 2026-05-03
description: 通过 GitHub Actions 工作流，在文章更新时自动通知 Bing 爬取新内容，再也不用手动去 Bing Webmaster 提交了。
image: ""
tags: \[工具,博客,SEO.Github Action]
category: 技术
draft: false
------------

之前每次写完博客都得手动去 Bing Webmaster Tools 提交 URL，麻烦得很。最近接入了 IndexNow，配合 GitHub Actions 实现了文章更新时自动通知 Bing 爬取，记录一下。

## 什么是 IndexNow

[IndexNow](https://www.indexnow.org/) 是一个开放的搜索引擎索引协议，目前被 Bing、Yandex 等搜索引擎支持。原理很简单：网站主动 POST 一批 URL 给搜索引擎的 IndexNow 接口，搜索引擎收到后会尽快来抓取这些页面。

## 接入过程

### 1. 获取 IndexNow Key

登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)，在"配置"→"IndexNow"里可以看到你的 key。或者直接用 API 方式提交，Bing 会自动验证域名所有权。

### 2. 配置 GitHub Secrets

把 key 存到仓库的 Secrets 里：

- 路径：**Settings → Secrets and variables → Actions → New repository secret**
- 名称：`INDEXNOW_SECRET`
- 值：你的 IndexNow key

### 3. 创建工作流文件

在 `.github/workflows/indexnow.yml` 写入以下内容：

```yaml
name: IndexNow

on:
  push:
    paths:
      - "src/content/posts/**/*.md"

jobs:
  indexnow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build URLs from posts
        id: urls
        run: |
          SITE_URL="https://upxuu.com"
          URLS=""
          first=true
          for file in src/content/posts/*.md; do
            slug=$(basename "$file" .md)
            url="${SITE_URL}/posts/${slug}/"
            if [ "$first" = true ]; then
              first=false
            else
              URLS="${URLS},"
            fi
            URLS="${URLS}\"${url}\""
          done
          for dir in src/content/posts/*/; do
            for file in "$dir"*.md; do
              slug=$(basename "$file" .md)
              url="${SITE_URL}/posts/${slug}/"
              if [ "$first" = true ]; then
                first=false
              else
                URLS="${URLS},"
              fi
              URLS="${URLS}\"${url}\""
            done
          done
          echo "urls=[${URLS}]" >> $GITHUB_OUTPUT

      - name: Submit to Bing via IndexNow
        run: |
          URLS="${{ steps.urls.outputs.urls }}"
          if [ -z "$URLS" ] || [ "$URLS" = "[]" ]; then
            echo "No URLs to submit"
            echo "result=no_urls" >> $GITHUB_OUTPUT
            exit 0
          fi

          echo "URL list:"
          echo "$URLS" | python3 -c "import json,sys; [print(f'  - {u}') for u in json.load(sys.stdin)]"
          echo ""

          RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            "https://www.bing.com/indexnow" \
            -H "Content-Type: application/json" \
            -H "Host: www.bing.com" \
            -d "{
              \"host\": \"upxuu.com\",
              \"key\": \"${{ secrets.INDEXNOW_SECRET }}\",
              \"urlList\": ${URLS}
            }")

          HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
          BODY=$(echo "$RESPONSE" | sed '$d')

          echo "---"
          echo "HTTP Status: $HTTP_CODE"
          echo "Response: $BODY"
          echo "result=HTTP_${HTTP_CODE}" >> $GITHUB_OUTPUT
```

### 4. 工作流说明

- **触发条件**：`src/content/posts/**/*.md` 有变更时自动触发（新建、修改、删除文章都会）
- **URL 生成**：从文件名读取 slug，拼接为 `https://upxuu.com/posts/{slug}/`
- **提交地址**：`https://www.bing.com/indexnow`
- **输出结果**：GitHub Actions 日志里直接输出 HTTP 状态码和响应内容，方便排查

## 效果

现在每次推送文章后，GitHub Actions 会自动把新文章的 URL 提交给 Bing。之前需要手动在 Webmaster 后台提交，现在完全自动化了。

不过有一点需要注意：Bing 对 IndexNow 的处理也需要时间，不会立刻出现在搜索结果里，一般几个小时到一天不等。之前主动推送到效果还是比较明显的，新文章基本当天就能被收录。

顺便修了一下博客浅色模式代码高亮看不清的问题 —— 之前只配了暗色主题 `github-dark`，浅色模式没有对应配置，现在改成双主题 `github-dark` + `github-light`，切换主题后代码块颜色就正常了。
