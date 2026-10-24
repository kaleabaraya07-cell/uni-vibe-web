/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import postService from "../services/postService";

const FeedContext = createContext(null);

export function FeedProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [vibes, setVibes] = useState([]);
  const [savedVibes, setSavedVibes] = useState([]);
  const [savedOwnerId, setSavedOwnerId] = useState(null);
  const [liked, setLiked] = useState(new Set());
  const [reposted, setReposted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const applyPosts = useCallback((posts, replace) => {
    const next = replace ? posts : [...vibes, ...posts];
    setVibes(next);
    setLiked(new Set(next.filter((post) => post.viewerState.liked).map((post) => post.id)));
    setReposted(new Set(next.filter((post) => post.viewerState.reposted).map((post) => post.id)));
  }, [vibes]);

  const loadFeed = useCallback(async ({ nextPage = 1, replace = false } = {}) => {
    if (replace) setLoading(true);
    else setLoadingMore(true);
    setError("");
    try {
      const result = await postService.getFeedPosts({ page: nextPage });
      applyPosts(result.posts, replace);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (requestError) {
      setError(requestError.message || "Unable to load the feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [applyPosts]);

  const refreshFeed = useCallback(() => loadFeed({ nextPage: 1, replace: true }), [loadFeed]);
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) return loadFeed({ nextPage: page + 1 });
    return Promise.resolve();
  }, [hasMore, loadFeed, loadingMore, page]);

  useEffect(() => {
    if (authLoading) return;
    const request = window.setTimeout(() => void refreshFeed(), 0);
    return () => window.clearTimeout(request);
  }, [authLoading, refreshFeed, user?.id]);

  useEffect(() => {
    let active = true;
    const userId = user?.id;
    if (!userId || authLoading) {
      return undefined;
    }
    postService
      .getSavedPosts()
      .then((posts) => {
        if (!active) return;
        setSavedVibes(posts);
        setSavedOwnerId(userId);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load your saved vibes.");
      });
    return () => {
      active = false;
    };
  }, [authLoading, user?.id]);

  const toggleReaction = useCallback(async (id, kind) => {
    setError("");
    try {
      const result = await postService[`toggle${kind}`](id);
      if (kind !== "Save") {
        const stateSetter = kind === "Like" ? setLiked : setReposted;
        stateSetter((current) => {
          const next = new Set(current);
          if (result.active) next.add(id);
          else next.delete(id);
          return next;
        });
      }
      const countKey = kind === "Like" ? "likes" : kind === "Save" ? "saves" : "reposts";
      const stateKey = kind === "Like" ? "liked" : kind === "Save" ? "saved" : "reposted";
      setVibes((current) => current.map((post) => (
        post.id === id
          ? {
              ...post,
              [countKey]: result.count,
              viewerState: { ...post.viewerState, [stateKey]: result.active },
            }
          : post
      )));
      if (kind === "Save") {
        if (result.active) {
          const post = vibes.find((item) => item.id === id);
          if (post && user) {
            setSavedOwnerId(user.id);
            setSavedVibes((current) => [
              { ...post, saves: result.count, viewerState: { ...post.viewerState, saved: true } },
              ...current.filter((item) => item.id !== id),
            ]);
          }
        } else {
          setSavedVibes((current) => current.filter((post) => post.id !== id));
        }
      }
      return true;
    } catch (requestError) {
      setError(requestError.message || "Unable to update this vibe.");
      return false;
    }
  }, [user, vibes]);

  const toggleLike = useCallback((id) => toggleReaction(id, "Like"), [toggleReaction]);
  const toggleSave = useCallback((id) => toggleReaction(id, "Save"), [toggleReaction]);
  const toggleRepost = useCallback((id) => toggleReaction(id, "Repost"), [toggleReaction]);

  const addComment = useCallback(async (id, body) => {
    setError("");
    try {
      const comment = await postService.addComment(id, body);
      setVibes((current) => current.map((post) => (
        post.id === id ? { ...post, comments: post.comments + 1 } : post
      )));
      return comment;
    } catch (requestError) {
      setError(requestError.message || "Unable to add your comment.");
      return null;
    }
  }, []);

  const addVibe = useCallback(async ({ caption, file, category, hashtags }) => {
    setError("");
    try {
      const post = await postService.createPost({ caption, file, category, hashtags });
      applyPosts([post], false);
      return post;
    } catch (requestError) {
      setError(requestError.message || "Unable to publish your vibe.");
      throw requestError;
    }
  }, [applyPosts]);

  const hideVibe = useCallback((id) => {
    setVibes((current) => current.filter((post) => post.id !== id));
  }, []);

  const increaseRecommendation = useCallback(() => {
    setError("Recommendations are not available until the server workflow is implemented.");
  }, []);

  const recordValidView = useCallback(async (id, viewSessionId, watchedSeconds) => {
    if (!viewSessionId || watchedSeconds < 4) return false;
    try {
      await postService.completeView(id, viewSessionId, watchedSeconds);
      setVibes((current) => current.map((post) => (
        post.id === id
          ? { ...post, views: post.views + 1, validViews: post.validViews + 1 }
          : post
      )));
      return true;
    } catch (requestError) {
      setError(requestError.message || "Unable to record this view.");
      return false;
    }
  }, []);

  const startView = useCallback(async (id) => {
    if (!user) return null;
    try {
      const result = await postService.startView(id);
      return result.view_session_id;
    } catch (requestError) {
      setError(requestError.message || "Unable to start view tracking.");
      return null;
    }
  }, [user]);

  const getSavedVibes = useCallback(
    () => savedOwnerId === user?.id ? savedVibes : [],
    [savedOwnerId, savedVibes, user?.id]
  );

  return (
    <FeedContext.Provider
      value={{
        vibes,
        liked,
        reposted,
        loading,
        loadingMore,
        hasMore,
        error,
        loadMore,
        refreshFeed,
        toggleLike,
        toggleSave,
        toggleRepost,
        addComment,
        addVibe,
        hideVibe,
        increaseRecommendation,
        startView,
        recordValidView,
        getSavedVibes,
        isLiked: (id) => liked.has(id),
        isSaved: (id) => savedOwnerId === user?.id && savedVibes.some((post) => post.id === id),
        isReposted: (id) => reposted.has(id),
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within FeedProvider");
  return ctx;
}
