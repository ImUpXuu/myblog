// Umami API Proxy Worker for Cloudflare Workers
// 用于安全地中转 Umami API 请求，避免暴露 token

// 环境变量（在 Cloudflare Dashboard 中设置）
// - UMAMI_URL: Umami 实例地址，如 https://stats.upxuu.com
// - UMAMI_USERNAME: Umami 用户名
// - UMAMI_PASSWORD: Umami 密码
// - WEBSITE_ID: 网站 ID

let cachedToken = null;
let tokenExpiry = null;

export default {
  async fetch(request, env, ctx) {
    // 只允许 GET 请求
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 处理 CORS
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    try {
      // 获取或刷新 token
      const token = await getToken(env);
      
      // 解析请求 URL
      const url = new URL(request.url);
      const path = url.pathname;
      
      // 构建 Umami API 请求
      const umamiUrl = new URL(env.UMAMI_URL);
      const apiPath = path.replace('/api', '');
      umamiUrl.pathname = `/api${apiPath}`;
      umamiUrl.search = url.search;
      
      // 转发请求到 Umami
      const response = await fetch(umamiUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // 处理响应
      const data = await response.json();
      
      // 返回数据，添加 CORS 头
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      
    } catch (error) {
      console.error('Umami proxy error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

/**
 * 获取 Umami token，如果已过期则重新登录
 */
async function getToken(env) {
  // 检查缓存的 token 是否仍然有效（提前 5 分钟过期）
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }
  
  // 登录获取新 token
  const loginUrl = new URL(env.UMAMI_URL);
  loginUrl.pathname = '/api/auth/login';
  
  const response = await fetch(loginUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: env.UMAMI_USERNAME,
      password: env.UMAMI_PASSWORD,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  cachedToken = data.token;
  
  // Token 默认 24 小时过期，我们设置为 23 小时
  tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
  
  console.log('Umami token refreshed successfully');
  
  return cachedToken;
}

/**
 * 处理 CORS 预检请求
 */
function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
