export interface Player {
  id: number;
  username: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: Player;
}

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1"
).replace(/\/$/, "");
const tokenStorageKey = "codeadventure.accessToken";

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Não foi possível contactar o servidor. Confirma que a API está em execução.",
      );
    }
    throw error;
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const detail =
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : "O pedido não foi aceite. Verifica os dados e tenta novamente.";
    throw new ApiError(detail, response.status);
  }

  return (await response.json()) as T;
}

export async function authenticate(
  mode: "login" | "register",
  username: string,
  password: string,
): Promise<Player> {
  const result = await request<AuthResponse>(`/auth/${mode}`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  sessionStorage.setItem(tokenStorageKey, result.access_token);
  return result.user;
}

export async function getCurrentPlayer(): Promise<Player | null> {
  const token = sessionStorage.getItem(tokenStorageKey);
  if (!token) return null;

  try {
    return await request<Player>("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      sessionStorage.removeItem(tokenStorageKey);
      return null;
    }
    throw error;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(tokenStorageKey);
}
