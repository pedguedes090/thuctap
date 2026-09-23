const API_BASE = '/api';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body, signal } = {}) {
  const config = { method, signal };

  if (body !== undefined) {
    config.headers = { 'Content-Type': 'application/json' };
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, config);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Không kết nối được mock API. Chạy "npm run mock" rồi thử lại.');
  }

  if (!response.ok) {
    throw new ApiError(`Máy chủ mock trả về lỗi ${response.status}.`, response.status);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
