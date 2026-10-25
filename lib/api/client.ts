const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("maktabim_token");
}

// Cache (5 sekund)
const _cache = new Map<string, { data: any; time: number }>();
const CACHE_TTL = 5000;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getToken();
  
  const isGet = !options.method || options.method === "GET";
  const cacheKey = `${path}`;

  // GET so'rovlar uchun cache tekshirish
  if (isGet) {
    const cached = _cache.get(cacheKey);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return cached.data as T;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["X-User-Token"] = token;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (networkErr) {
    console.error("[API] Network xato:", url, networkErr);
    throw new ApiError("Serverga ulanib bo'lmadi", 0);
  }

  const text = await res.text();
  let data: any = null;

  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(`Server noto'g'ri javob (${res.status})`, res.status);
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) || `Xatolik (${res.status})`;
    throw new ApiError(message, res.status);
  }

  // GET natijasini cache ga yozish
  if (isGet) {
    _cache.set(cacheKey, { data, time: Date.now() });
  } else {
    _cache.clear(); // POST/DELETE bo'lsa cache tozalanadi
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { API_URL };