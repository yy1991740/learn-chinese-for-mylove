// 火山方舟翻译API后端服务
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const url = require('url');

// 从环境变量读取配置
const VOLC_ACCESS_KEY = process.env.VOLC_ACCESS_KEY;
const VOLC_SECRET_KEY = process.env.VOLC_SECRET_KEY;
const MODEL_ENDPOINT = process.env.MODEL_ENDPOINT || 'ep-20251025212759-bfkl9';
const MODEL_ID = process.env.MODEL_ID || 'Doubao-Seed-Translation';

// 验证必要的环境变量是否存在
function validateEnvironment() {
    if (!VOLC_ACCESS_KEY || !VOLC_SECRET_KEY) {
        console.error('警告: VOLC_ACCESS_KEY 和 VOLC_SECRET_KEY 环境变量未设置');
        return false;
    }
    return true;
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 解析请求URL
    const parsedUrl = url.parse(req.url, true);
    
    // 处理翻译请求
    if (parsedUrl.pathname === '/translate') {
        if (req.method === 'POST') {
            let body = '';
            
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', async () => {
                try {
                    const data = JSON.parse(body);
                    const { text, sourceLang, targetLang } = data;
                    
                    if (!text) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: 'Text is required' }));
                        return;
                    }

                    // 调用火山方舟API
                    const translation = await callVolcApi(text, sourceLang, targetLang);
                    
                    res.writeHead(200);
                    res.end(JSON.stringify({ translation }));
                } catch (error) {
                    console.error('Error processing translation request:', error);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Internal server error' }));
                }
            });
        } else {
            res.writeHead(405);
            res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// 生成火山API签名
function generateVolcSign(accessKey, secretKey, method, uri, headers, query, body) {
    // 1. 构建规范的请求字符串
    const canonicalHeaders = Object.keys(headers)
        .sort()
        .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
        .join('\n');
    
    const signedHeaders = Object.keys(headers)
        .sort()
        .map(key => key.toLowerCase())
        .join(';');
    
    // 2. 构建哈希
    const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
    
    // 3. 构建待签名字符串
    const canonicalRequest = `${method}\n${uri}\n${query}\n${canonicalHeaders}\n\n${signedHeaders}\n${bodyHash}`;
    
    // 4. 生成签名
    const sign = crypto.createHmac('sha256', secretKey)
        .update(canonicalRequest)
        .digest('hex');
    
    return sign;
}

// 调用火山方舟API
async function callVolcApi(text, sourceLang = 'zh', targetLang = 'id') {
    // 检查环境变量配置
    if (!validateEnvironment()) {
        throw new Error('API配置不完整，请设置VOLC_ACCESS_KEY和VOLC_SECRET_KEY环境变量');
    }
    // 确保sourceLang和targetLang是有效的
    const validLangs = ['zh', 'id'];
    if (!validLangs.includes(sourceLang) || !validLangs.includes(targetLang)) {
        throw new Error('Invalid language code. Supported languages: zh, id');
    }

    // 准备请求参数
    const timestamp = Date.now().toString();
    const nonce = Math.floor(Math.random() * 1000000).toString();
    
    const body = JSON.stringify({
        model: MODEL_ID,
        input: {
            text,
            source_lang: sourceLang,
            target_lang: targetLang
        }
    });

    const headers = {
        'Content-Type': 'application/json',
        'Host': 'ark-api.bytedance.com',
        'x-volc-engine-tenant-id': '2100048822', // 默认租户ID，可能需要根据实际情况调整
        'x-volc-engine-timestamp': timestamp,
        'x-volc-engine-nonce': nonce
    };

    // 生成签名
    const uri = `/api/v3/chat/completions`;
    const query = '';
    const sign = generateVolcSign(VOLC_ACCESS_KEY, VOLC_SECRET_KEY, 'POST', uri, headers, query, body);
    
    // 添加签名到请求头
    headers['Authorization'] = `HMAC-SHA256 AccessKeyId=${VOLC_ACCESS_KEY}, SignedHeaders=${Object.keys(headers).sort().join(';').toLowerCase()}, Signature=${sign}`;

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'ark-api.bytedance.com',
            port: 443,
            path: uri,
            method: 'POST',
            headers: headers
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                try {
                    const data = JSON.parse(responseBody);
                    if (data.error) {
                        reject(new Error(`API Error: ${data.error.message}`));
                    } else if (data.choices && data.choices[0] && data.choices[0].message) {
                        resolve(data.choices[0].message.content);
                    } else {
                        reject(new Error('Invalid API response format'));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse API response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.write(body);
        req.end();
    });
}

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Translation API server running on port ${PORT}`);
    if (!validateEnvironment()) {
        console.log('注意: 请设置必要的环境变量以使用翻译功能');
    }
});

// 导出函数以便测试
module.exports = { generateVolcSign, callVolcApi };
