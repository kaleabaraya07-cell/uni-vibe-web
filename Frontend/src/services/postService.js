import apiClient, { mediaUrl } from "./apiClient";

export function mapApiPost(post) {
  return {
    id: post.id,
    type: post.media_type,
    media: mediaUrl(post.media_url),
    caption: post.caption,
    music: "Original Audio",
    category: post.category,
    location: post.university?.name || post.university_id,
    hashtags: post.hashtags || [],
    likes: post.likes,
    comments: post.comments,
    shares: 0,
    reposts: post.reposts,
    saves: post.saves,
    views: post.views,
    validViews: post.views,
    season: String(post.season_year),
    universityId: post.university_id,
    user: {
      id: post.author.id,
      name: post.author.display_name,
      username: `@${post.author.username}`,
      avatar: mediaUrl(post.author.avatar_url) || "",
      isStudent: post.author.is_student,
      verified: post.author.verification_status === "verified",
      university: post.author.university_id || "Uni Vibe Community",
      department: "",
    },
    viewerState: {
      liked: post.liked_by_me,
      saved: post.saved_by_me,
      reposted: post.reposted_by_me,
    },
    createdAt: post.created_at,
  };
}

export const postService = {
  async getFeedPosts({ page = 1, limit = 20 } = {}) {
    const result = await apiClient(`/feed?page=${page}&limit=${limit}`);
    return {
      posts: result.data.map(mapApiPost),
      hasMore: result.data.length === limit,
      total: null,
    };
  },

  async getPostById(id) {
    const post = await apiClient(`/posts/${encodeURIComponent(id)}`);
    return mapApiPost(post);
  },

  async createPost({ caption, file, category, hashtags }) {
    const body = new FormData();
    body.set("caption", caption);
    body.set("category", category || "Campus life");
    body.set("hashtags", hashtags || "");
    if (file) body.set("media", file);
    return mapApiPost(await apiClient("/posts", { method: "POST", body }));
  },

  async getSavedPosts() {
    const result = await apiClient("/posts/saved");
    return result.map(mapApiPost);
  },

  async getLikedPosts() {
    const result = await apiClient("/posts/liked");
    return result.map(mapApiPost);
  },

  async getUserPosts(userId, { page = 1, limit = 20 } = {}) {
    const result = await apiClient(
      `/feed?user_id=${encodeURIComponent(userId)}&page=${page}&limit=${limit}`
    );
    return {
      posts: result.data.map(mapApiPost),
      hasMore: result.data.length === limit,
    };
  },

  async getUniversityPosts(universityId, { page = 1, limit = 20 } = {}) {
    const result = await apiClient(
      `/feed?university_id=${encodeURIComponent(universityId)}&page=${page}&limit=${limit}`
    );
    return {
      posts: result.data.map(mapApiPost),
      hasMore: result.data.length === limit,
    };
  },

  toggleLike(postId) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/likes`, { method: "POST" });
  },

  toggleSave(postId) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/saves`, { method: "POST" });
  },

  toggleRepost(postId) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/reposts`, { method: "POST" });
  },

  addComment(postId, body) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  },

  async getComments(postId) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/comments`);
  },

  startView(postId) {
    return apiClient(`/posts/${encodeURIComponent(postId)}/views/start`, { method: "POST" });
  },

  completeView(postId, viewSessionId, watchedSeconds) {
    return apiClient(
      `/posts/${encodeURIComponent(postId)}/views/${encodeURIComponent(viewSessionId)}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ watched_seconds: watchedSeconds }),
      }
    );
  },
};

export default postService;
