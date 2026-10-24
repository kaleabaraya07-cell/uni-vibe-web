import { useCallback, useEffect, useState } from "react";
import authService from "../services/authService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error) => {
        if (active) setAuthError(error.message || "Unable to restore your session.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    const result = await authService.login(email, password, rememberMe);
    setUser(result.user);
    setAuthError("");
    return result;
  }, []);

  const signup = useCallback(async (params) => {
    const result = await authService.signup(params);
    setUser(result.user);
    setAuthError("");
    return result;
  }, []);

  const socialLogin = useCallback(() => authService.socialLogin(), []);

  const updateProfile = useCallback(async (params) => {
    const updatedUser = await authService.updateProfile(params);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const updateProfileImage = useCallback(async (imageType, file) => {
    const updatedUser = await authService.updateProfileImage(imageType, file);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setAuthError("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: Boolean(user),
        login,
        signup,
        socialLogin,
        updateProfile,
        updateProfileImage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
