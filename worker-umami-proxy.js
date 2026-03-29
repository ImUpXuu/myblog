// Umami API 反向代理 - Cloudflare Worker
// 部署到 Cloudflare Workers 后，可以安全地代理 Umami API 请求

// Umami 配置
const UMAMI_URL = 'https://stats.upxuu.com';
const WEBSITE_ID = 'cd983d6c-e011-489d-903f-4757ce41c14d';

// 从环境变量获取 Umami Token（推荐）或使用固定 Token
const UMAMI_TOKEN = '4+QR2nhQ69+zUO4CLWUbr6XXps81mjYfJEcSf8tmd4z1czQHTudH1Knz1txb9eSrckdFpG3MQ6sZTAJAxJYKNFxtkomBrrlHSP/9hlYqDgNLKIuaGs/R1JT6WJc25kdMHKrlzt3YvVQBdqkKmbSV4Iw8iWX112ua1p2e9dYmhJaro6Ok0shcEf0qZfS83uoAtoFlpZa8gbiJUUJ2W1rkN5fH5kQwT+5H7SW8fkzdD54xg58us+m//7wNnl5hwcRPd/YmgqpAgY0sNn3U2YTigpLyF711o8MorNHP6afg4KwQ/TjTQzpKTrXvENqrS3x4csVfLTo+/9Azymq6VYE45iT/MLW9jZMTZSF/9n4wcN1UgMU/xuzCJg/igOgl';

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // 路由处理
      if (pathname === '/api/page-stats') {
        // 获取单页面统计（浏览量和点赞）
        return await getPageStats(url, request);
      } else if (pathname === '/api/site-stats') {
        // 获取全站统计
        return await getSiteStats(url, request);
      } else if (pathname === '/api/homepage-stats') {
        // 获取首页文章列表统计（批量）- 已废弃，改为前端并行请求
        return await getHomepageStats(url, request);
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// 获取单页面统计
async function getPageStats(url, originalRequest) {
  const path = url.searchParams.get('url');
  
  if (!path) {
    return new Response(JSON.stringify({ error: 'url parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 计算时间范围（从网站创建到现在）
    const endAt = Date.now();
    const startAt = new Date('2026-03-01').getTime(); // 网站创建时间

    // 调用 Umami API 获取页面统计
    const umamiUrl = `${UMAMI_URL}/api/websites/${WEBSITE_ID}/stats?path=${encodeURIComponent(path)}&startAt=${startAt}&endAt=${endAt}`;
    
    const response = await fetch(umamiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UMAMI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Umami API error:', response.status, errorText);
      throw new Error(`Umami API error: ${response.status}`);
    }

    const data = await response.json();
    
    // 返回兼容旧 API 的格式
    return new Response(JSON.stringify({
      views: data.pageviews || 0,
      likes: data.pageviews || 0, // 暂时使用浏览量作为点赞数
      visitors: data.visitors || 0,
      visits: data.visits || 0
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    console.error('Error fetching page stats:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      views: 0,
      likes: 0
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

// 获取全站统计
async function getSiteStats(url, originalRequest) {
  try {
    const endAt = Date.now();
    const startAt = new Date('2026-03-01').getTime();

    const umamiUrl = `${UMAMI_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`;
    
    const response = await fetch(umamiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UMAMI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      totalViews: data.pageviews || 0,
      totalVisitors: data.visitors || 0,
      totalVisits: data.visits || 0,
      bounces: data.bounces || 0
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

// 获取首页文章列表统计（批量）
async function getHomepageStats(url, originalRequest) {
  const urls = url.searchParams.getAll('url');
  
  if (!urls || urls.length === 0) {
    return new Response(JSON.stringify({ error: 'url parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const endAt = Date.now();
    const startAt = new Date('2026-03-01').getTime();
    
    // 批量获取每个页面的统计
    const stats = await Promise.all(
      urls.map(async (path) => {
        try {
          const umamiUrl = `${UMAMI_URL}/api/websites/${WEBSITE_ID}/stats?path=${encodeURIComponent(path)}&startAt=${startAt}&endAt=${endAt}`;
          
          const response = await fetch(umamiUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${UMAMI_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return {
              url: path,
              views: data.pageviews || 0,
              likes: data.pageviews || 0
            };
          }
          return { url: path, views: 0, likes: 0 };
        } catch (error) {
          console.error(`Error fetching stats for ${path}:`, error);
          return { url: path, views: 0, likes: 0 };
        }
      })
    );

    return new Response(JSON.stringify({ stats }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    });
  }
}

// CORS 处理
function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
