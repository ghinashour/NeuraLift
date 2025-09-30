/// ...existing code...
const BASE_URL = process.env.REACT_APP_API_URL || '';

async function request(path, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(BASE_URL + path, {
        ...options,
        headers,
        body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
    });

    const text = await res.text();
    let data = null;
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
}

const apiClient = {
    request,
    get(path) {
        return request(path, { method: 'GET' });
    },
    post(path, body) {
        return request(path, { method: 'POST', body });
    },
    put(path, body) {
        return request(path, { method: 'PUT', body });
    },
    patch(path, body) {
        return request(path, { method: 'PATCH', body });
    },
    delete(path, body) {
        return request(path, { method: 'DELETE', body });
    },
};

export default apiClient;
// ...existing code...