import type { User } from "../../shared-kernel";

const parseCookie = (
  cookieHeader: string | null,
  name: string
): string | null => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[name] || null;
};

export const getServerUser = (request: Request): User | null => {
  const cookieHeader = request.headers.get("Cookie");
  const userStr = parseCookie(cookieHeader, "user");
  const token = parseCookie(cookieHeader, "authToken");

  if (!userStr || !token) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(userStr));
  } catch {
    return null;
  }
};

export const isServerAuthenticated = (request: Request): boolean => {
  const user = getServerUser(request);
  const cookieHeader = request.headers.get("Cookie");
  const token = parseCookie(cookieHeader, "authToken");

  return !!(user && token);
};
