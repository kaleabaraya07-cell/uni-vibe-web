import { useLocale } from "../../context/LocaleContext";
import { useFeed } from "../../context/FeedContext";
import VibeCard from "../../components/VibeCard/VibeCard";
import "./Saved.css";

function Saved() {
  const { t } = useLocale();
  const { getSavedVibes } = useFeed();
  const saved = getSavedVibes();

  return (
    <div className="saved-page">
      <h1>{t("saved.title")}</h1>
      {saved.length === 0 ? (
        <p className="saved-empty">No saved vibes yet. Tap bookmark on a vibe to save it.</p>
      ) : (
        <div className="saved-feed">
          {saved.map((v) => <VibeCard key={v.id} vibe={v} />)}
        </div>
      )}
    </div>
  );
}

export default Saved;
