import { useFeed } from "../../context/FeedContext";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import VibeCard from "../VibeCard/VibeCard";
import "./VibeFeed.css";

function VibeFeed() {
  const { vibes } = useFeed();
  const { visibleItems, hasMore, sentinelRef } = useInfiniteScroll(vibes, 3);

  return (
    <div className="vibe-feed">
      {visibleItems.map((vibe) => (
        <VibeCard key={vibe.id} vibe={vibe} />
      ))}
      {hasMore && <div ref={sentinelRef} className="vibe-feed__sentinel" />}
    </div>
  );
}

export default VibeFeed;
