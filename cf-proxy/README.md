# Umami API Cloudflare Worker 代理

这个 Cloudflare Worker 用于安全地中转 Umami API 请求，避免在前端暴露 Umami 的认证 token。

## 功能特性

- ✅ 自动管理 Umami token（登录、缓存、刷新）
- ✅ 支持 CORS，允许前端直接访问
- ✅ 可配置允许访问的 API 路径
- ✅ 可配置过滤敏感字段
- ✅ Token 缓存 23 小时，减少登录次数

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 配置环境变量

编辑 `wrangler.toml` 文件，确认以下配置：

```toml
[vars]
UMAMI_URL = "https://stats.upxuu.com"
UMAMI_USERNAME = "admin"
UMAMI_PASSWORD = "lijiaxupxu"
ALLOWED_PATHS = "/stats,/pageviews"
BLOCKED_FIELDS = "visitors,visits,bounces,totaltime,countries,comparison"
```

**参数说明：**

- `UMAMI_URL`: 你的 Umami 实例地址
- `UMAMI_USERNAME`: Umami 用户名
- `UMAMI_PASSWORD`: Umami 密码
- `ALLOWED_PATHS`: 允许访问的 API 路径（逗号分隔）
- `BLOCKED_FIELDS`: 需要过滤的敏感字段（逗号分隔）

### 4. 部署 Worker

```bash
cd cf-proxy
wrangler deploy
```

部署成功后，你会得到一个 Worker URL，例如：
```
https://umami-proxy.upxuu.workers.dev
```

### 5. （可选）绑定自定义域名

如果需要绑定自定义域名（如 `umami-api.upxuu.com`）：

1. 在 Cloudflare Dashboard 中进入 Workers & Pages
2. 选择你的 Worker
3. 点击 "Triggers" → "Custom Domains"
4. 添加自定义域名

### 6. 更新博客代码

将 Worker URL 更新到博客代码中：

**Layout.astro** 和 **[...page].astro**:

```javascript
const umamiProxyUrl = 'https://你的 worker 地址';
```

## API 使用示例

### 获取页面统计数据

```bash
curl https://你的 worker 地址/api/websites/cd983d6c-e011-489d-903f-4757ce41c14d/stats?path=/posts/test
```

返回示例：
```json
{
  "pageviews": 123
}
```

## 安全说明

1. **Token 安全**: Umami token 保存在 Cloudflare Workers 中，不会暴露给前端
2. **路径限制**: 只允许访问配置的 API 路径（`/stats`, `/pageviews`）
3. **字段过滤**: 自动过滤敏感字段（如访问者数、停留时间等）
4. **CORS 限制**: 当前允许所有域名访问，建议在生产环境中限制为博客域名

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `UMAMI_URL` | Umami 实例地址 | `https://stats.upxuu.com` |
| `UMAMI_USERNAME` | Umami 用户名 | `admin` |
| `UMAMI_PASSWORD` | Umami 密码 | `your_password` |
| `ALLOWED_PATHS` | 允许的 API 路径 | `/stats,/pageviews` |
| `BLOCKED_FIELDS` | 过滤的敏感字段 | `visitors,visits,bounces` |

## 常见问题

### Q: 为什么返回的数据只有 pageviews？
A: 默认配置过滤了其他字段，只保留 `pageviews`。如需其他字段，修改 `BLOCKED_FIELDS` 环境变量。

### Q: Token 多久刷新一次？
A: Token 缓存 23 小时，过期后会自动重新登录获取新 token。

### Q: 如何查看 Worker 日志？
A: 在 Cloudflare Dashboard 中进入 Worker → "Logs" 查看。

## 许可证

MIT License
