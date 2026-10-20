export interface Player {
  id: number;
  username: string;
}

export interface DashboardLevel {
  id: number;
  title: string;
  objective: string;
  xp_reward: number;
  status: "available" | "locked" | "completed";
  stars: number | null;
}

export interface DashboardWorld {
  id: number;
  title: string;
  description: string;
  icon: string;
  theme_color: string;
  status: "available" | "locked" | "completed";
  completed_levels: number;
  total_levels: number;
  levels: DashboardLevel[];
}

export interface PlayerDashboard {
  player: Player;
  total_xp: number;
  completed_levels: number;
  total_levels: number;
  progress_percentage: number;
  worlds: DashboardWorld[];
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

export async function getPlayerDashboard(): Promise<PlayerDashboard> {
  try {
    return await request<PlayerDashboard>("/users/me/dashboard", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(tokenStorageKey) ?? ""}`,
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      sessionStorage.removeItem(tokenStorageKey);
    }
    throw error;
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function clearSession(): void {
  sessionStorage.removeItem(tokenStorageKey);
}
