import { useCallback, useEffect, useMemo, useState } from "react";
import { hasBackend } from "../api/client";
import * as authApi from "../api/auth";
import { AuthContext } from "./useAuth";

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ status: hasBackend ? "loading" : "off", user: null });

  // Restore the session from the backend's cookie on page load.
  useEffect(() => {
    if (!hasBackend) return;
    const controller = new AbortController();
    authApi
      .fetchCurrentUser({ signal: controller.signal })
      .then(({ user }) => setState({ status: "signedIn", user }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "signedOut", user: null });
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (identifier, password) => {
    const { user } = await authApi.login(identifier, password);
    setState({ status: "signedIn", user });
    return user;
  }, []);

  // The last registration step creates the account and signs in.
  const finishRegistration = useCallback(async (details) => {
    const { user } = await authApi.finishRegistration(details);
    setState({ status: "signedIn", user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Sign out locally even if the server can't be reached.
    }
    setState({ status: "signedOut", user: null });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, finishRegistration, logout }),
    [state, login, finishRegistration, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
