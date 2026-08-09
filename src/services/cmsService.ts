export const API_BASE = '/api';

export async function fetchCmsData() {
  const res = await fetch(`${API_BASE}/cms/data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export async function updateCmsData(data: any, token: string) {
  const res = await fetch(`${API_BASE}/cms/data`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to save data');
  }

  return res.json();
}

export async function login(password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error('Invalid password');
  }

  const data = await res.json();
  return data.token;
}
