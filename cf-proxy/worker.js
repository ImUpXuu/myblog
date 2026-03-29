// Umami API Proxy Worker for Cloudflare Workers
// 用于安全地中转 Umami API 请求，过滤敏感信息，避免暴露 token

// 环境变量（在 Cloudflare Dashboard 中设置）：
// - UMAMI_URL: Umami 实例地址，如 https://stats.upxuu.com
// - UMAMI_TOKEN: Umami API Token（预先获取）
// - ALLOWED_PATHS: 允许访问的 API 路径（逗号分隔），例如：/stats,/pageviews
// - BLOCKED_FIELDS: 需要过滤的敏感字段（逗号分隔），例如：visitors,visits,bounces,totaltime,countries

let cachedToken = null;

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
      // 使用配置的 token（优先使用缓存）
      const token = cachedToken || env.UMAMI_TOKEN;
      if (!token) {
        throw new Error('UMAMI_TOKEN not configured');
      }
      cachedToken = token;
      
      // 解析请求 URL
      const url = new URL(request.url);
      const path = url.pathname;
      
      // 检查路径是否允许访问
      if (!isPathAllowed(path, env)) {
        return new Response(JSON.stringify({ error: 'Access denied: path not allowed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...getCORSHeaders() },
        });
      }
      
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
      
      if (!response.ok) {
        return new Response(JSON.stringify({ 
          error: 'Umami API error',
          status: response.status 
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json', ...getCORSHeaders() },
        });
      }
      
      // 处理响应
      const data = await response.json();
      
      // 过滤敏感字段
      const filteredData = filterSensitiveData(data, env);
      
      // 返回过滤后的数据
      return new Response(JSON.stringify(filteredData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...getCORSHeaders(),
        },
      });
      
    } catch (error) {
      console.error('Umami proxy error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCORSHeaders(),
        },
      });
    }
  },
};

/**
 * 检查请求路径是否在允许列表中
 */
function isPathAllowed(path, env) {
  // 默认允许的路径
  const defaultAllowedPaths = ['/stats', '/pageviews'];
  
  // 从环境变量获取允许的路径
  const allowedPaths = env.ALLOWED_PATHS 
    ? env.ALLOWED_PATHS.split(',').map(p => p.trim())
    : defaultAllowedPaths;
  
  // 检查路径是否匹配
  return allowedPaths.some(allowedPath => path.includes(allowedPath));
}

/**
 * 过滤敏感数据
 */
function filterSensitiveData(data, env) {
  // 默认需要过滤的字段
  const defaultBlockedFields = ['visitors', 'visits', 'bounces', 'totaltime', 'countries', 'comparison'];
  
  // 从环境变量获取需要过滤的字段
  const blockedFields = env.BLOCKED_FIELDS 
    ? env.BLOCKED_FIELDS.split(',').map(f => f.trim())
    : defaultBlockedFields;
  
  // 过滤对象中的敏感字段
  const filtered = filterObject(data, blockedFields);
  
  // 转换数据格式：将 {pageviews: {value: 123}} 转换为 {pageviews: 123}
  // Umami API 返回的是嵌套对象，我们需要提取 value 值
  const result = {};
  for (const [key, value] of Object.entries(filtered)) {
    if (value && typeof value === 'object' && 'value' in value) {
      result[key] = value.value;
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * 递归过滤对象中的敏感字段
 */
function filterObject(obj, blockedFields) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => filterObject(item, blockedFields));
  }
  
  const filtered = {};
  for (const [key, value] of Object.entries(obj)) {
    // 如果字段在黑名单中，跳过
    if (blockedFields.includes(key)) {
      continue;
    }
    
    // 递归过滤嵌套对象
    filtered[key] = filterObject(value, blockedFields);
  }
  
  return filtered;
}

/**
 * 处理 CORS 预检请求
 */
function handleCORS() {
  return new Response(null, {
    headers: getCORSHeaders(),
  });
}

/**
 * 获取 CORS 头
 */
function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}
