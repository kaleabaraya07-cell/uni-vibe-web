import { useEffect, useRef } from "react";
import { useFeed } from "../../context/FeedContext";
import VibeCard from "../VibeCard/VibeCard";
import LoadingSkeleton from "../ui/LoadingSkeleton/LoadingSkeleton";
import "./VibeFeed.css";

function VibeFeed() {
  const { vibes, loading, loadingMore, hasMore, error, loadMore } = useFeed();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void loadMore();
    }, { rootMargin: "300px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (loading) return <div className="vibe-feed"><LoadingSkeleton count={2} /></div>;

  return (
    <div className="vibe-feed">
      {error && <p className="vibe-feed__error" role="alert">{error}</p>}
      {vibes.length === 0 && !error && <p className="vibe-feed__empty">No vibes yet. Be the first to share one.</p>}
      {vibes.map((vibe) => <VibeCard key={vibe.id} vibe={vibe} />)}
      {hasMore && <div ref={sentinelRef} className="vibe-feed__sentinel" />}
      {loadingMore && <LoadingSkeleton count={1} />}
    </div>
  );
}

export default VibeFeed;
