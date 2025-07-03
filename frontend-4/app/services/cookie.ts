// Cookie utility service for managing authentication tokens
export class CookieService {
  private static readonly AUTH_TOKEN_KEY = "authToken";
  private static readonly AUTH_STATUS_KEY = "authStatus";
  private static readonly COOKIE_OPTIONS = {
    path: "/",
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };

  // Check if we're in a browser environment
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
  }

  // Set a cookie with the given name, value, and options
  static set(
    name: string,
    value: string,
    options: Partial<typeof CookieService.COOKIE_OPTIONS> = {}
  ) {
    if (!CookieService.isBrowser()) {
      return; // Skip on server-side
    }

    const opts = { ...CookieService.COOKIE_OPTIONS, ...options };

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (opts.path) cookieString += `; path=${opts.path}`;
    if (opts.secure) cookieString += "; secure";
    if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`;
    if (opts.maxAge) cookieString += `; max-age=${opts.maxAge}`;

    document.cookie = cookieString;
  }

  // Get a cookie value by name
  static get(name: string): string | null {
    if (!CookieService.isBrowser()) {
      return null; // Return null on server-side
    }

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  // Remove a cookie by setting it to expire in the past
  static remove(name: string) {
    if (!CookieService.isBrowser()) {
      return; // Skip on server-side
    }

    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  // Set auth token cookie
  static setAuthToken(token: string) {
    CookieService.set(CookieService.AUTH_TOKEN_KEY, token);
  }

  // Get auth token from cookie
  static getAuthToken(): string | null {
    return CookieService.get(CookieService.AUTH_TOKEN_KEY);
  }

  // Remove auth token cookie
  static removeAuthToken() {
    CookieService.remove(CookieService.AUTH_TOKEN_KEY);
  }

  // Set auth status cookie
  static setAuthStatus(status: string) {
    CookieService.set(CookieService.AUTH_STATUS_KEY, status);
  }

  // Get auth status from cookie
  static getAuthStatus(): string | null {
    return CookieService.get(CookieService.AUTH_STATUS_KEY);
  }

  // Remove auth status cookie
  static removeAuthStatus() {
    CookieService.remove(CookieService.AUTH_STATUS_KEY);
  }
}
