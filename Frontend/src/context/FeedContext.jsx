/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { mockVibes } from "../data/mockVibes";

const FeedContext = createContext(null);

export function FeedProvider({ children }) {
  const [vibes, setVibes] = useState(mockVibes);
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [reposted, setReposted] = useState(new Set());
  const [shared, setShared] = useState(new Set());
  const localMediaUrls = useRef(new Set());
  const validViewIds = useRef(new Set());

  useEffect(
    () => () => {
      localMediaUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  const toggleLike = useCallback((id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      const wasLiked = next.has(id);
      if (wasLiked) next.delete(id);
      else next.add(id);
      setVibes((vibesList) =>
        vibesList.map((v) =>
          v.id === id ? { ...v, likes: v.likes + (wasLiked ? -1 : 1) } : v
        )
      );
      return next;
    });
  }, []);

  const toggleSave = useCallback((id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      const wasSaved = next.has(id);
      if (wasSaved) next.delete(id);
      else next.add(id);
      setVibes((vibesList) =>
        vibesList.map((v) =>
          v.id === id ? { ...v, saves: v.saves + (wasSaved ? -1 : 1) } : v
        )
      );
      return next;
    });
  }, []);

  const toggleRepost = useCallback((id) => {
    setReposted((prev) => {
      const next = new Set(prev);
      const wasReposted = next.has(id);
      if (wasReposted) next.delete(id);
      else next.add(id);
      setVibes((vibesList) =>
        vibesList.map((v) =>
          v.id === id
            ? { ...v, reposts: (v.reposts || 0) + (wasReposted ? -1 : 1) }
            : v
        )
      );
      return next;
    });
  }, []);

  const toggleShare = useCallback((id) => {
    setShared((prev) => new Set(prev).add(id));
    setVibes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, shares: v.shares + 1 } : v))
    );
  }, []);

  const addComment = useCallback((id) => {
    setVibes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, comments: v.comments + 1 } : v))
    );
  }, []);

  const addVibe = useCallback((vibe) => {
    if (vibe.media.startsWith("blob:")) localMediaUrls.current.add(vibe.media);
    setVibes((prev) => [vibe, ...prev]);
  }, []);

  const hideVibe = useCallback((id) => {
    setVibes((prev) => prev.filter((vibe) => vibe.id !== id));
  }, []);

  const increaseRecommendation = useCallback((id) => {
    setVibes((prev) => prev.map((vibe) => (vibe.id === id ? { ...vibe, recommendationScore: (vibe.recommendationScore || 0) + 1 } : vibe)));
  }, []);

  const recordValidView = useCallback((id) => {
    if (validViewIds.current.has(id)) return;
    validViewIds.current.add(id);
    setVibes((prev) =>
      prev.map((vibe) =>
        vibe.id === id
          ? { ...vibe, views: (vibe.views || 0) + 1, validViews: (vibe.validViews || 0) + 1 }
          : vibe
      )
    );
  }, []);

  const getSavedVibes = useCallback(
    () => vibes.filter((v) => saved.has(v.id)),
    [vibes, saved]
  );

  return (
    <FeedContext.Provider
      value={{
        vibes,
        liked,
        saved,
        reposted,
        shared,
        toggleLike,
        toggleSave,
        toggleRepost,
        toggleShare,
        addComment,
        addVibe,
        hideVibe,
        increaseRecommendation,
        recordValidView,
        getSavedVibes,
        isLiked: (id) => liked.has(id),
        isSaved: (id) => saved.has(id),
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
