import { useState, useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(items, pageSize = 3) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, items.length));
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
  }, [items.length, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleItems = items.slice(0, Math.min(visibleCount, items.length));
  const hasMore = visibleCount < items.length;

  return { visibleItems, hasMore, sentinelRef };
}
