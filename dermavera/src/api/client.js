const TOKEN_KEY = 'dermavera_token';
const USER_KEY = 'dermavera_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** 4xx/5xx 응답 body에서 에러 메시지 추출 (JSON이면 message 사용) */
function getErrorMessage(res, text) {
  try {
    const json = JSON.parse(text);
    if (json && typeof json.message === 'string') return json.message;
  } catch (_) {}
  return text || `요청 실패: ${res.status}`;
}

/** 로그인/로그아웃 시 Navbar 등에서 갱신하도록 이벤트 발생 */
const AUTH_CHANGE_EVENT = 'dermavera-auth-change';
export function notifyAuthChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * POST /auth/login
 * Body: { userId: string, password: string }
 * Success 200: body = JWT string
 */
export async function login(userId, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed: ${res.status}`);
  }
  const token = await res.text();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

/**
 * GET /api/users/me
 * Header: Authorization: Bearer {token}
 * Response: { userPk, userId, userName }
 */
export async function fetchMe() {
  const res = await fetch('/api/users/me', {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(getErrorMessage(res, text));
  }
  const user = await res.json();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

/**
 * POST /auth/signup
 * Body: { userId: string, password: string, userName?: string }
 * Success: 2xx (백엔드 스펙에 따름)
 */
export async function signup(userId, password, userName) {
  const res = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password, userName: userName || userId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Signup failed: ${res.status}`);
  }
  return res;
}

/**
 * GET /api/mypage/users/{userPk}/animals
 */
export async function fetchMyAnimals(userPk) {
  const res = await fetch(`/api/mypage/users/${userPk}/animals`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new Error('접근 권한이 없습니다(403). 다시 로그인해 주세요.');
    }
    throw new Error(text || `Animals fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * POST /api/mypage/users/{userPk}/animals
 * Body: { name: string, age?: number, species?: string }
 * Response: 생성된 동물 객체 { id, name, age, species, createdDate }
 */
export async function createAnimal(userPk, body) {
  const res = await fetch(`/api/mypage/users/${userPk}/animals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new Error('접근 권한이 없습니다(403). 다시 로그인해 주세요.');
    }
    throw new Error(text || `Animal create failed: ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/mypage/users/{userPk}/diagnoses
 * Response: [{ diagnosisId, animalId, animalName, createdDate, topLabel, score?, predictions?, imageFilename? }, ...]
 */
export async function fetchDiagnoses(userPk) {
  const res = await fetch(`/api/mypage/users/${userPk}/diagnoses`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new Error('접근 권한이 없습니다(403). 다시 로그인해 주세요.');
    }
    throw new Error(text || `Diagnoses fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/mypage/users/{userPk}/animals/{animalId}/diagnoses
 * Response: same as fetchDiagnoses
 */
export async function fetchDiagnosesByAnimal(userPk, animalId) {
  const res = await fetch(`/api/mypage/users/${userPk}/animals/${animalId}/diagnoses`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 403) {
      throw new Error('접근 권한이 없습니다(403). 다시 로그인해 주세요.');
    }
    throw new Error(text || `Diagnoses fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * POST /api/mypage/users/{userPk}/animals/{animalId}/diagnose
 * body: FormData with image (file), animal_type (string), body_part (string), top_k (number)
 */
export async function diagnoseSkin(userPk, animalId, formData) {
  const url = `/api/mypage/users/${userPk}/animals/${animalId}/diagnose`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData,
    });
  } catch (networkErr) {
    const msg = networkErr.message || String(networkErr);
    if (msg.includes('Failed to fetch') || msg.includes('Connection') || msg.includes('Reset') || msg.includes('NetworkError')) {
      throw new Error('백엔드에 연결할 수 없습니다. Spring Boot 서버(localhost:8080)가 실행 중인지 확인해 주세요.');
    }
    throw networkErr;
  }
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 500) {
      throw new Error('서버 오류(500)가 발생했습니다. 백엔드 콘솔 로그를 확인해 주세요.');
    }
    throw new Error(text || `진단 요청 실패: ${res.status}`);
  }
  return res.json();
}

export async function updateAnimal(userPk, animalId, body) {
  const res = await fetch(`/api/mypage/users/${userPk}/animals/${animalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "수정 실패");
  }

  return res.json();
}

export async function deleteAnimal(userPk, animalId) {
  const res = await fetch(`/api/mypage/users/${userPk}/animals/${animalId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    throw new Error("삭제 실패");
  }
}

