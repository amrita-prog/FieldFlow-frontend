import api from './axios';

// ── 1.1 Login ──────────────────────────────────────────────────
// POST /auth/login/ → returns { access, refresh, user }
export const login = async (email, password) => {
  const response = await api.post('/auth/login/', { email, password });
  return response.data;
};

// ── 1.3 Logout ─────────────────────────────────────────────────
// POST /auth/logout/ → requires { refresh } in body
export const logout = async (refreshToken) => {
  const response = await api.post('/auth/logout/', { refresh: refreshToken });
  return response.data;
};

// ── 1.2 Refresh Token ──────────────────────────────────────────
// POST /auth/token/refresh/ → called by axios interceptor (not directly by components)
export const refreshToken = async (refresh) => {
  const response = await api.post('/auth/token/refresh/', { refresh });
  return response.data; // { access, refresh } — both rotated
};

// ── 1.4 Get Current User (Me) ──────────────────────────────────
// GET /auth/me/ → same shape as login user object
// Called on app startup to restore session from existing token
export const getMe = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};
