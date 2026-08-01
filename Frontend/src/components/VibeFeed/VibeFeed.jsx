import { useEffect, useMemo, useState } from "react";
import { useFeed } from "../../context/FeedContext";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import VibeCard from "../VibeCard/VibeCard";
import Stories from "../Stories/Stories";
import LoadingSkeleton from "../ui/LoadingSkeleton/LoadingSkeleton";
import "./VibeFeed.css";

function VibeFeed() {
  const { vibes } = useFeed();
  const { visibleItems, hasMore, sentinelRef } = useInfiniteScroll(vibes, 3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const feedContent = useMemo(() => {
    if (loading) return <LoadingSkeleton count={2} />;
    return (
      <>
        {visibleItems.map((vibe) => (
          <VibeCard key={vibe.id} vibe={vibe} />
        ))}
        {hasMore && <div ref={sentinelRef} className="vibe-feed__sentinel" />}
      </>
    );
  }, [hasMore, loading, sentinelRef, visibleItems]);

  return (
    <div className="vibe-feed">
      <Stories />
      {feedContent}
    </div>
  );
}

export default VibeFeed;
