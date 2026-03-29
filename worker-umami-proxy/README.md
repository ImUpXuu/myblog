# Umami API 反向代理 - Cloudflare Worker

这个 Worker 用于安全地代理 Umami API 请求，避免在前端暴露 Umami Token。

## 功能

- ✅ `/api/page-stats?url=/path` - 获取单页面浏览量统计
- ✅ `/api/site-stats` - 获取全站统计
- ✅ `/api/homepage-stats?url=/path1&url=/path2` - 批量获取多个页面统计

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 部署 Worker

```bash
wrangler deploy
```

部署成功后，你会得到一个 `*.workers.dev` 的域名，例如：
`https://umami-proxy.your-subdomain.workers.dev`

### 4. （可选）绑定自定义域名

在 Cloudflare Dashboard 中绑定自定义域名，例如 `api.upxuu.com`

## API 使用示例

### 获取单页面统计

```javascript
fetch('https://your-worker.workers.dev/api/page-stats?url=/posts/letter-to-c/')
  .then(res => res.json())
  .then(data => {
    console.log('Views:', data.views);
    console.log('Likes:', data.likes);
  });
```

返回格式：
```json
{
  "views": 123,
  "likes": 123,
  "visitors": 45,
  "visits": 67
}
```

### 获取全站统计

```javascript
fetch('https://your-worker.workers.dev/api/site-stats')
  .then(res => res.json())
  .then(data => {
    console.log('Total Views:', data.totalViews);
  });
```

### 批量获取首页文章统计

```javascript
const urls = ['/posts/1/', '/posts/2/', '/posts/3/'];
const query = urls.map(u => `url=${encodeURIComponent(u)}`).join('&');

fetch(`https://your-worker.workers.dev/api/homepage-stats?${query}`)
  .then(res => res.json())
  .then(data => {
    data.stats.forEach(stat => {
      console.log(stat.url, stat.views);
    });
  });
```

## 在博客中集成

修改博客的 JavaScript 代码，将 API 端点改为 Worker 地址：

### Layout.astro

```javascript
function fetchPageStats() {
    const pageUrl = window.location.pathname;
    const apiUrl = 'https://your-worker.workers.dev'; // Worker 地址
    
    fetch(`${apiUrl}/api/page-stats?url=${encodeURIComponent(pageUrl)}`)
        .then(res => res.json())
        .then(data => {
            const viewsEl = document.getElementById('post-views');
            if (viewsEl) viewsEl.textContent = data.views || 0;
        });
}
```

### [...page].astro

```javascript
function fetchHomepageStats() {
    const apiUrl = 'https://your-worker.workers.dev';
    const postCards = document.querySelectorAll('[data-post-url]');
    
    const urls = Array.from(postCards).map(card => card.getAttribute('data-post-url'));
    const query = urls.map(u => `url=${encodeURIComponent(u)}`).join('&');
    
    fetch(`${apiUrl}/api/homepage-stats?${query}`)
        .then(res => res.json())
        .then(data => {
            data.stats.forEach((stat, index) => {
                const card = postCards[index];
                const viewsEl = card.querySelector('.post-views');
                if (viewsEl) viewsEl.textContent = stat.views || 0;
            });
        });
}
```

## 安全说明

- ✅ Token 存储在 Worker 服务端，不会暴露给客户端
- ✅ 支持 CORS，可以从任何域名访问
- ✅ 建议设置环境变量而不是硬编码 Token
- ⚠️ 如果需要限制访问，可以添加域名白名单检查

## 更新 Token

如果 Umami Token 过期或需要更新：

1. 在 Worker 代码中修改 `UMAMI_TOKEN` 常量
2. 或者在 Cloudflare Dashboard 中设置环境变量
3. 重新部署：`wrangler deploy`

## 故障排查

### 查看日志

```bash
wrangler tail
```

### 测试 API

```bash
curl https://your-worker.workers.dev/api/page-stats?url=/
```

## 依赖

- Umami 自部署版本
- Cloudflare Workers（免费计划即可）
- Wrangler CLI
