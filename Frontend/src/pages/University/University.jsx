import { useState } from "react";
import { useParams } from "react-router-dom";
import { getUniversityById } from "../../data/mockUniversities";
import { mockVibes } from "../../data/mockVibes";
import { mockEvents } from "../../data/mockEvents";
import { mockClubs } from "../../data/mockUniversities";
import { useLocale } from "../../context/LocaleContext";
import TabBar from "../../components/ui/TabBar/TabBar";
import RankingWidget from "../../components/RankingWidget/RankingWidget";
import "./Entity.css";

function University() {
  const { id } = useParams();
  const uni = getUniversityById(id);
  const { t } = useLocale();
  const [tab, setTab] = useState("vibes");
  if (!uni) return <p>University not found</p>;

  const tabs = [
    { id: "vibes", label: t("university.vibes") },
    { id: "events", label: t("university.events") },
    { id: "clubs", label: t("university.clubs") },
    { id: "rankings", label: t("university.rankings") },
  ];

  const vibes = mockVibes.filter((v) => v.universityId === id);
  const events = mockEvents.filter((e) => e.universityId === id);
  const clubs = mockClubs.filter((c) => c.universityId === id);

  return (
    <div className="entity-page">
      <img src={uni.cover} alt="" className="entity-page__cover" />
      <h1>{uni.name}</h1>
      <p className="entity-page__meta">{uni.location} • {uni.population.toLocaleString()} students • Rank #{uni.ranking}</p>
      <p>{uni.description}</p>
      <TabBar tabs={tabs} activeId={tab} onChange={setTab} />
      {tab === "vibes" && (
        <div className="entity-grid">{vibes.map((v) => <img key={v.id} src={v.media} alt="" />)}</div>
      )}
      {tab === "events" && events.map((e) => <div key={e.id} className="entity-list-item">{e.title} — {e.date}</div>)}
      {tab === "clubs" && clubs.map((c) => <div key={c.id} className="entity-list-item">{c.name} ({c.members} members)</div>)}
      {tab === "rankings" && <RankingWidget />}
    </div>
  );
}

export default University;
