import { getUserById as getUById, currentUser, mockUsers } from "../data/mockUsers";
import { mockVibes } from "../data/mockVibes";

/**
 * User Profile Service
 */
export const profileService = {
  async getProfile(userId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const user = getUById(userId) || (userId === currentUser.id ? currentUser : null);
    if (!user) throw new Error("User not found");
    return { ...user };
  },

  async updateProfile(userId, updates) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const user = mockUsers.find((u) => u.id === userId) || currentUser;
    Object.assign(user, updates);
    return { ...user };
  },

  async getUserPosts(userId) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return mockVibes.filter((v) => v.user.id === userId);
  },

  async getUserSavedPosts(userId) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (!userId) throw new Error("User ID is required");
    // Return mock saved vibes
    return mockVibes.slice(0, 3);
  },

  async getUserLikedPosts(userId) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (!userId) throw new Error("User ID is required");
    return mockVibes.slice(1, 4);
  },
};

export default profileService;
