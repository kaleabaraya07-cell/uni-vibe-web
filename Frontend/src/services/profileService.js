import apiClient from "./apiClient";
import { mapApiUser } from "./authService";
import postService from "./postService";

export const profileService = {
  async getUserProfile(userId) {
    const user = await apiClient(`/users/${encodeURIComponent(userId)}`);
    return mapApiUser(user);
  },

  async updateProfile(params) {
    return mapApiUser(await apiClient("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({
        display_name: params.name,
        bio: params.bio,
        department: params.department || null,
      }),
    }));
  },

  getUserPosts(userId) {
    return postService.getUserPosts(userId).then((result) => result.posts);
  },

  getUserSavedPosts() {
    return postService.getSavedPosts();
  },

  getUserLikedPosts() {
    return postService.getLikedPosts();
  },
};

export default profileService;
