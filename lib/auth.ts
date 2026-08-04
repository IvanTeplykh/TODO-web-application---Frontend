const TOKEN_KEY = "todo_auth_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const fromLocal = localStorage.getItem(TOKEN_KEY);
  if (fromLocal) return fromLocal;

  const fromSession = sessionStorage.getItem(TOKEN_KEY);
  if (fromSession) return fromSession;

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith(`${TOKEN_KEY}=`));
  if (tokenCookie) {
    const val = tokenCookie.split("=")[1];
    if (val) return decodeURIComponent(val);
  }
  return null;
};

export const setToken = (token: string, rememberMe?: boolean) => {
  if (typeof window === "undefined") return;

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }

  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
};
