import { createContext, useContext } from "react";

// status: "off"       no backend configured, so there's no login
//         "loading"   checking for an existing session
//         "signedIn"  user is set
//         "signedOut" no session
export const AuthContext = createContext(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside <AuthProvider>");
  return auth;
}
