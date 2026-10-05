import { api } from "./client";

// Auth endpoints the backend is expected to provide (see README, "Connecting
// a backend"). Each successful call returns { user }, where user is
// { id, name, role, studentId?, email? } and role is one of
// "student", "faculty", "staff" or "admin".

// The signed-in user, or a 401 error when there's no session.
export const fetchCurrentUser = ({ signal } = {}) => api("/auth/me", { signal });

// identifier is a student ID or an email address.
export const login = (identifier, password) =>
  api("/auth/login", { method: "POST", body: { identifier, password } });

export const logout = () => api("/auth/logout", { method: "POST" });

// Registration, step 1: checks the allowlist and emails a 6-digit code.
export const startRegistration = ({ schoolId, fullName, email }) =>
  api("/auth/register/start", { method: "POST", body: { schoolId, fullName, email } });

// Registration, step 2: creates the account and signs in. Returns { user }.
export const finishRegistration = ({ schoolId, email, code, password }) =>
  api("/auth/register/verify", { method: "POST", body: { schoolId, email, code, password } });

// Forgot password: emails a code to the account (same reply either way).
export const requestPasswordReset = (identifier) =>
  api("/auth/password/forgot", { method: "POST", body: { identifier } });

export const resetPassword = ({ identifier, code, password }) =>
  api("/auth/password/reset", { method: "POST", body: { identifier, code, password } });
