import { useState, useCallback } from "react";
import { currentUser, mockCredentials, mockUsers } from "../data/mockUsers";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, password) => {
    if (
      email === mockCredentials.email &&
      password === mockCredentials.password
    ) {
      setUser(currentUser);
      return { ok: true };
    }
    const found = mockUsers.find(
      (u) => u.email === email && password === "demo123"
    );
    if (found) {
      setUser(found);
      return { ok: true };
    }
    return { ok: false };
  }, []);

  const signup = useCallback((name, username, email) => {
    const newUser = {
      id: `u${Date.now()}`,
      name,
      username: username.startsWith("@") ? username : `@${username}`,
      email,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      university: "EPSU",
      universityId: "uni1",
      department: "Undeclared",
      departmentId: "dept1",
      year: "1st Year",
      bio: "",
      verified: false,
      followers: 0,
      following: 0,
      vibeCount: 0,
    };
    setUser(newUser);
    return { ok: true };
  }, []);

  const socialLogin = useCallback(() => {
    setUser(currentUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        socialLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
