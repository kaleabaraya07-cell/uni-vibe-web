import { mockVibes, getVibeById as getVById } from "../data/mockVibes";
import { mockStories } from "../data/mockStories";

/**
 * Posts, Vibes & Stories Service
 */
export const postService = {
  async getFeedPosts({ page = 1, limit = 10, category = null } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let posts = [...mockVibes];
    if (category && category !== "All") {
      posts = posts.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    const startIndex = (page - 1) * limit;
    return {
      posts: posts.slice(startIndex, startIndex + limit),
      hasMore: startIndex + limit < posts.length,
      total: posts.length,
    };
  },

  async getPostById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getVById(id) || null;
  },

  async createPost(postData, currentUser) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Core business rule check: Only verified university students can create posts
    if (!currentUser?.isStudent || currentUser?.verificationStatus !== "verified") {
      throw new Error("Only verified university students can create posts on Uni Vibe.");
    }

    const newPost = {
      id: `v_${Date.now()}`,
      ...postData,
      user: currentUser,
      likes: 0,
      comments: 0,
      shares: 0,
      reposts: 0,
      saves: 0,
      views: 0,
      validViews: 0,
      createdAt: new Date().toISOString(),
      season: "2026",
    };

    mockVibes.unshift(newPost);
    return newPost;
  },

  async toggleLike(postId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const post = mockVibes.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    return { success: true, likes: post.likes + 1 };
  },

  async repost(postId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const post = mockVibes.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    post.reposts = (post.reposts || 0) + 1;
    return { success: true, reposts: post.reposts };
  },

  async toggleSave(postId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const post = mockVibes.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    post.saves = (post.saves || 0) + 1;
    return { success: true, saves: post.saves };
  },

  async getStories() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...mockStories];
  },
};

export default postService;
