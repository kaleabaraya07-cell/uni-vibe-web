import { currentUser, mockUsers, mockCredentials } from "../data/mockUsers";
import { mockUniversities } from "../data/mockUniversities";

/**
 * Authentication & Account Service
 * Provides async abstractions ready for Python/FastAPI backend integration.
 */
export const authService = {
  async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && password === mockCredentials.password) {
      return { success: true, user, token: "mock-jwt-token" };
    }
    // Also allow demo fallback
    if (email === mockCredentials.email && password === mockCredentials.password) {
      return { success: true, user: currentUser, token: "mock-jwt-token" };
    }
    throw new Error("Invalid email or password");
  },

  async signup({
    name,
    username,
    email,
    password,
    isStudent = true,
    universityId = null,
    departmentId = null,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const selectedUni = universityId
      ? mockUniversities.find((u) => u.id === universityId)
      : null;

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      username: username.startsWith("@") ? username : `@${username}`,
      email,
      avatar: `https://i.pravatar.cc/150?u=${username}`,
      coverImage: selectedUni?.cover || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      isStudent: Boolean(isStudent),
      verificationStatus: isStudent ? "pending" : "none",
      verified: false,
      university: selectedUni?.shortName || (isStudent ? "Pending Verification" : ""),
      universityId: isStudent ? universityId : null,
      department: isStudent ? (departmentId || "General Studies") : "",
      departmentId: isStudent ? departmentId : null,
      year: isStudent ? "1st Year" : "",
      bio: isStudent ? "Uni Vibe newcomer 🎓" : "Exploring campus life on Uni Vibe ✨",
      followers: 0,
      following: 0,
      vibeCount: 0,
      leaguePT: 0,
    };

    return { success: true, user: newUser, token: "mock-jwt-token" };
  },

  async getCurrentUser() {
    return currentUser;
  },

  async logout() {
    return { success: true };
  },
};

export default authService;
