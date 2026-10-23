import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import universityService from "../../services/universityService";
import postService from "../../services/postService";
import { useLocale } from "../../context/LocaleContext";
import TabBar from "../../components/ui/TabBar/TabBar";
import RankingWidget from "../../components/RankingWidget/RankingWidget";
import { Sparkles, Users, CalendarRange } from "lucide-react";
import "./Entity.css";

function University() {
  const { id } = useParams();
  const [uni, setUni] = useState(null);
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLocale();
  const [tab, setTab] = useState("vibes");

  useEffect(() => {
    let active = true;
    Promise.all([
      universityService.getUniversityById(id),
      postService.getUniversityPosts(id),
    ])
      .then(([university, feed]) => {
        if (!active) return;
        setUni(university);
        setVibes(feed.posts);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this university.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p role="status">Loading university…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!uni) return <p>University not found.</p>;

  const tabs = [
    { id: "vibes", label: t("university.vibes") },
    { id: "events", label: t("university.events") },
    { id: "clubs", label: t("university.clubs") },
    { id: "rankings", label: t("university.rankings") },
  ];

  return (
    <div className="entity-page">
      {uni.cover
        ? <img src={uni.cover} alt="" className="entity-page__cover" />
        : <div className="entity-page__cover" aria-hidden="true" />}
      <h1>{uni.name}</h1>
      <p className="entity-page__meta">{uni.location} • University community</p>
      <p>{uni.description}</p>
      <div className="entity-page__badges">
        <span><Sparkles size={14} /> Trending campus</span>
        <span><Users size={14} /> Student community</span>
        <span><CalendarRange size={14} /> Events will appear here</span>
      </div>
      <TabBar tabs={tabs} activeId={tab} onChange={setTab} />
      {tab === "vibes" && (
        vibes.length > 0
          ? <div className="entity-grid">{vibes.map((v) => v.media ? <img key={v.id} src={v.media} alt="" /> : <p key={v.id}>{v.caption}</p>)}</div>
          : <p>No vibes have been shared by this university yet.</p>
      )}
      {tab === "events" && <p>Campus events are not available yet.</p>}
      {tab === "clubs" && <p>Campus clubs are not available yet.</p>}
      {tab === "rankings" && <RankingWidget />}
    </div>
  );
}

export default University;
