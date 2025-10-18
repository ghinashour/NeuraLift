// src/utils/apiClient.js
const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/$/, '');

const hasBody = (method) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

async function request(path, options = {}) {
    const token = localStorage.getItem('token');
    const method = (options.method || 'GET').toUpperCase();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchOptions = { ...options, method, headers };

    if (options.body && hasBody(method)) {
        fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    const controller = new AbortController();
    const timeout = options.timeout || 10000;
    fetchOptions.signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let res, data;
    try {
        // Prevent duplicate '/api' when BASE_URL already contains '/api' and path starts with '/api'
        let normalizedPath = path || '';
        if (BASE_URL.endsWith('/api') && /^\/api\b/.test(normalizedPath)) {
            normalizedPath = normalizedPath.replace(/^\/api/, '');
        }
        // Ensure single slash between BASE_URL and path
        const url = BASE_URL + (normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath);
        res = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        const text = await res.text();
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = text;
        }

        if (!res.ok) {
            const err = new Error((data && data.message) || res.statusText || 'Request failed');
            err.status = res.status;
            err.data = data;
            throw err;
        }

        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            const timeoutErr = new Error('Request timed out');
            timeoutErr.status = 408;
            throw timeoutErr;
        }
        throw err;
    }
}

const apiClient = {
    request,
    get(path, options) { return request(path, { ...options, method: 'GET' }); },
    post(path, body, options) { return request(path, { ...options, method: 'POST', body }); },
    put(path, body, options) { return request(path, { ...options, method: 'PUT', body }); },
    patch(path, body, options) { return request(path, { ...options, method: 'PATCH', body }); },
    delete(path, body, options) { return request(path, { ...options, method: 'DELETE', body }); },
};

export default apiClient;
