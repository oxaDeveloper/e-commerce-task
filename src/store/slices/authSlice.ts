import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import {
  clearToken,
  setToken,
  getToken,
  setLastKnownEmail,
  setLastKnownRole,
  getLastKnownRole,
  getLastKnownEmail,
  clearLastKnownEmail,
  clearLastKnownRole,
} from "../../utils/storage";
import { getEmailFromJwt, parseJwt } from "../../utils/jwt";
import { DEVELOPER_MODE_STORAGE_KEY } from "../../utils/constants";

export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  developerMode: boolean;
}

const initialState: AuthState = {
  user: null,
  token: getToken(),
  status: "idle",
  error: null,
  developerMode: localStorage.getItem(DEVELOPER_MODE_STORAGE_KEY) === "true",
};

function deriveRoleFromClaims(claims: any): UserRole {
  const authorities: string[] = Array.isArray(claims?.authorities)
    ? claims.authorities
    : typeof claims?.authorities === "string"
    ? claims.authorities.split(" ")
    : Array.isArray(claims?.roles)
    ? claims.roles
    : [];
  const roleField =
    (claims?.role as string) || (claims?.realm_access?.roles || [])[0] || "";
  const all = [roleField, ...authorities].join(",").toUpperCase();
  return all.includes("ADMIN") ? "ADMIN" : "USER";
}

export const bootstrapAuth = createAsyncThunk("auth/bootstrap", async () => {
  const token = getToken();
  if (!token) return null;

  const claims = parseJwt(token);
  const emailFromJwt = getEmailFromJwt(token);
  let role = deriveRoleFromClaims(claims);
  const storedRole = getLastKnownRole();

  if (storedRole === "ADMIN" || storedRole === "USER") {
    role = storedRole as UserRole;
  }

  // Try to get email from various sources
  let email = emailFromJwt;
  if (!email) {
    email = getLastKnownEmail() || "";
  }

  const user: AuthUser = {
    id: (claims?.id as string) || (claims?.sub as string) || "user",
    email,
    role,
  };

  if (user.email) setLastKnownEmail(user.email);
  return { token, user } as { token: string; user: AuthUser };
});

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { username: string; password: string }) => {
    const res = await api.post<any>("/auth/login", payload);
    let body = res.data;
    if (body && typeof body === "object" && "data" in body) body = body.data;

    const token: string = body.token || body.accessToken || body.jwt;

    // Backend response structure: { username, email, role, token }
    let user: AuthUser | undefined;

    if (body.username && body.email && body.role) {
      // Backend provides user data directly
      user = {
        id: body.username,
        email: body.email,
        role: body.role as UserRole,
      };
    } else if (body.user) {
      // Backend provides user object
      user = body.user as AuthUser;
    } else {
      // Fallback: extract from JWT
      const claims = parseJwt(token);
      const emailFromJwt = getEmailFromJwt(token);
      const roleFromJwt: UserRole = deriveRoleFromClaims(claims);

      // Try to get email from various sources
      let email = emailFromJwt;
      if (!email && payload.username.includes("@")) {
        email = payload.username; // If username is actually an email
      }

      user = {
        id:
          (claims?.id as string) || (claims?.sub as string) || payload.username,
        email: email || "", // Don't create fake emails
        role: roleFromJwt,
      };
    }

    // Ensure email is set
    if (!user.email) {
      const emailFromJwt = getEmailFromJwt(token);
      if (emailFromJwt) {
        user.email = emailFromJwt;
      } else if (payload.username.includes("@")) {
        user.email = payload.username;
      }
    }

    if (user.email) setLastKnownEmail(user.email);
    setLastKnownRole(user.role);

    return { token, user } as { token: string; user: AuthUser };
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: { username: string; email: string; password: string }) => {
    const res = await api.post<any>("/auth/register", payload);
    let body = res.data;
    if (body && typeof body === "object" && "data" in body) body = body.data;

    const token: string = body.token || body.accessToken || body.jwt;

    // Backend response structure: { username, email, role, token }
    let user: AuthUser;

    if (body.username && body.email && body.role) {
      // Backend provides user data directly
      user = {
        id: body.username,
        email: body.email,
        role: body.role as UserRole,
      };
    } else if (body.user) {
      // Backend provides user object
      user = body.user as AuthUser;
    } else {
      // Fallback: extract from JWT
      const claims = parseJwt(token);
      const roleFromJwt: UserRole = deriveRoleFromClaims(claims);

      user = {
        id:
          (claims?.id as string) || (claims?.sub as string) || payload.username,
        email: payload.email, // Use the email from registration form
        role: roleFromJwt,
      };
    }

    if (user.email) setLastKnownEmail(user.email);
    setLastKnownRole(user.role);

    return { token, user } as { token: string; user: AuthUser };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      clearToken();

      // Clear stored credentials to prevent dev admin data from persisting
      const storedEmail = getLastKnownEmail();
      const storedRole = getLastKnownRole();

      // If stored data contains dev admin info, clear it
      if (storedEmail === "admin@example.com" || storedRole === "ADMIN") {
        clearLastKnownEmail();
        clearLastKnownRole();
      }
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setToken(action.payload.token);
      if (action.payload.user.email)
        setLastKnownEmail(action.payload.user.email);
      setLastKnownRole(action.payload.user.role);
    },
    setDeveloperMode(state, action: PayloadAction<boolean>) {
      state.developerMode = action.payload;
      localStorage.setItem(
        DEVELOPER_MODE_STORAGE_KEY,
        action.payload.toString()
      );
    },
    enableDeveloperMode(state) {
      state.developerMode = true;
      localStorage.setItem(DEVELOPER_MODE_STORAGE_KEY, "true");
    },
    disableDeveloperMode(state) {
      state.developerMode = false;
      localStorage.setItem(DEVELOPER_MODE_STORAGE_KEY, "false");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
        setToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
        setToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Register failed";
      });
  },
});

export const {
  logout,
  setCredentials,
  setDeveloperMode,
  enableDeveloperMode,
  disableDeveloperMode,
} = authSlice.actions;
export default authSlice.reducer;
