const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login.php', { method: 'POST', body: { email, password } }),
};

export const employeesApi = {
  list: (token) => apiFetch('/employees/list.php', { token }),
};
