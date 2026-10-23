import apiClient, { ApiError } from "./apiClient";

export function mapApiUser(user) {
  return {
    ...user,
    name: user.display_name,
    username: user.username?.startsWith("@") ? user.username : `@${user.username}`,
    isStudent: user.is_student,
    verificationStatus: user.verification_status,
    verified: user.verification_status === "verified",
    universityId: user.university_id,
    university: user.university_id || "",
    bio: user.bio || "",
  };
}

export const authService = {
  async login(email, password, rememberMe = true) {
    const user = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    });
    return { ok: true, user: mapApiUser(user) };
  },

  async signup({
    name,
    username,
    email,
    password,
    isStudent = true,
    universityId = null,
    departmentName = "",
  }) {
    const payload = {
      display_name: name,
      username: username?.replace(/^@/, ""),
      email,
      password,
      is_student: Boolean(isStudent),
      university_id: isStudent ? universityId : null,
      department: isStudent ? departmentName : null,
    };
    await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return this.login(email, password);
  },

  async getCurrentUser() {
    try {
      return mapApiUser(await apiClient("/auth/me"));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  async updateProfile({ name, bio, department }) {
    return mapApiUser(await apiClient("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({
        display_name: name,
        bio,
        department: department || null,
      }),
    }));
  },

  async logout() {
    await apiClient("/auth/logout", { method: "POST" });
  },

  async socialLogin() {
    throw new Error("External sign-in is not configured yet.");
  },
};

export default authService;
