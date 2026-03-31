import axios from "axios";

/**
 * Axios instance pre-configured with base URL and JWT interceptor.
 * In development, requests are proxied through Next.js rewrites.
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("atsify_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("atsify_token");
        localStorage.removeItem("atsify_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ========================
// Auth Service
// ========================

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthUser> {
    const response = await api.post("/auth/login", data);
    const userData = response.data.data;
    return userData;
  },

  async register(data: RegisterData): Promise<AuthUser> {
    const response = await api.post("/auth/register", data);
    const userData = response.data.data;
    return userData;
  },
};

// ========================
// Resume Service
// ========================

export interface ResumeData {
  id: string;
  fileName: string;
  score: number | null;
  createdAt: string;
  analysisId?: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
}

export const resumeService = {
  async upload(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  async getHistory(): Promise<ResumeData[]> {
    const response = await api.get("/resume/history");
    return response.data.data;
  },
};

// ========================
// Analysis Service
// ========================

export interface AnalysisData {
  id: string;
  resumeId: string;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  createdAt: string;
}

export const analysisService = {
  async analyze(resumeId: string, jobDescription: string): Promise<AnalysisData> {
    const params = new URLSearchParams();
    params.append("resumeId", resumeId);
    params.append("jobDescription", jobDescription);
    const response = await api.post("/analyze", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data.data;
  },

  async getHistory(): Promise<AnalysisData[]> {
    const response = await api.get("/analysis/history");
    return response.data.data;
  },

  async getById(id: string): Promise<AnalysisData> {
    const response = await api.get(`/analysis/${id}`);
    return response.data.data;
  },
};
