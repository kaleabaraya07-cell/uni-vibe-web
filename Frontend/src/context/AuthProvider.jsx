import { useState, useCallback, useEffect } from "react";
import { currentUser, mockCredentials, mockUsers } from "../data/mockUsers";
import { mockUniversities } from "../data/mockUniversities";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [rememberUser, setRememberUser] = useState(() => {
    try {
      return Boolean(localStorage.getItem("univibe_current_user"));
    } catch {
      return true;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem("univibe_current_user") ||
        sessionStorage.getItem("univibe_current_user");
      if (saved) return JSON.parse(saved);
    } catch {
      return null;
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        const storage = rememberUser ? localStorage : sessionStorage;
        const otherStorage = rememberUser ? sessionStorage : localStorage;
        storage.setItem("univibe_current_user", JSON.stringify(user));
        otherStorage.removeItem("univibe_current_user");
      } else {
        localStorage.removeItem("univibe_current_user");
        sessionStorage.removeItem("univibe_current_user");
      }
    } catch {
      // ignore storage error
    }
  }, [rememberUser, user]);

  const login = useCallback((email, password, rememberMe = true) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (
      cleanEmail === mockCredentials.email.toLowerCase() &&
      password === mockCredentials.password
    ) {
      setRememberUser(rememberMe);
      setUser(currentUser);
      return { ok: true, user: currentUser };
    }
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && password === "demo123"
    );
    if (found) {
      setRememberUser(rememberMe);
      setUser(found);
      return { ok: true, user: found };
    }
    // Also allow any demo login with password demo123
    if (cleanEmail && password === "demo123") {
      setRememberUser(rememberMe);
      const demoFallback = {
        ...currentUser,
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
      };
      setUser(demoFallback);
      return { ok: true, user: demoFallback };
    }
    return { ok: false, error: "Invalid email or password" };
  }, []);

  const signup = useCallback((params) => {
    // Supports either an object or legacy signature (name, username, email, password)
    let payload = params;
    if (typeof params === "string") {
      const [name, username, email] = arguments;
      payload = { name, username, email };
    }

    const {
      name,
      username,
      email,
      isStudent = true,
      universityId = null,
      departmentId = null,
      departmentName = "",
    } = payload;

    const selectedUni = universityId
      ? mockUniversities.find((u) => u.id === universityId)
      : null;

    const newUser = {
      id: `u${Date.now()}`,
      name,
      username: username?.startsWith("@") ? username : `@${username || "user"}`,
      email,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email || name)}`,
      coverImage: selectedUni?.cover || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      isStudent: Boolean(isStudent),
      // Verified students can create posts; new student accounts start with verified=true for demo/prototype or pending
      verificationStatus: isStudent ? "verified" : "none",
      verified: Boolean(isStudent),
      university: selectedUni ? selectedUni.shortName : (isStudent ? "University Student" : ""),
      universityId: isStudent ? (universityId || "uni1") : null,
      department: isStudent ? (departmentName || "Engineering") : "",
      departmentId: isStudent ? departmentId : null,
      year: isStudent ? "1st Year" : "",
      bio: isStudent ? "Uni Vibe campus student 🎓" : "Exploring university life on Uni Vibe ✨",
      followers: 0,
      following: 0,
      vibeCount: 0,
      leaguePT: 0,
    };

    setUser(newUser);
    return { ok: true, user: newUser };
  }, []);

  const socialLogin = useCallback(() => {
    setUser(currentUser);
    return { ok: true, user: currentUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("univibe_current_user");
      sessionStorage.removeItem("univibe_current_user");
    } catch {
      // ignore
    }
  }, []);

  const switchAccount = useCallback((targetUser) => {
    setUser(targetUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        socialLogin,
        logout,
        switchAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
