import { createContext, useContext, useState, useCallback } from "react";
import { mockVibes } from "../data/mockVibes";

const FeedContext = createContext(null);

export function FeedProvider({ children }) {
  const [vibes, setVibes] = useState(mockVibes);
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [shared, setShared] = useState(new Set());

  const toggleLike = useCallback((id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      const wasLiked = next.has(id);
      if (wasLiked) next.delete(id);
      else next.add(id);
      setVibes((vibes) =>
        vibes.map((v) =>
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
      setVibes((vibes) =>
        vibes.map((v) =>
          v.id === id ? { ...v, saves: v.saves + (wasSaved ? -1 : 1) } : v
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
    setVibes((prev) => [vibe, ...prev]);
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
        shared,
        toggleLike,
        toggleSave,
        toggleShare,
        addComment,
        addVibe,
        getSavedVibes,
        isLiked: (id) => liked.has(id),
        isSaved: (id) => saved.has(id),
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
