import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import SearchBar from "../../components/SearchBar/SearchBar";
import TabBar from "../../components/ui/TabBar/TabBar";
import { mockVibes } from "../../data/mockVibes";
import { mockUsers } from "../../data/mockUsers";
import { mockUniversities, mockClubs } from "../../data/mockUniversities";
import { mockEvents } from "../../data/mockEvents";
import "./Search.css";

function Search() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("vibes");
  const q = query.toLowerCase();

  const tabs = [
    { id: "vibes", label: "Vibes" },
    { id: "people", label: "People" },
    { id: "universities", label: "Universities" },
    { id: "clubs", label: "Clubs" },
    { id: "events", label: "Events" },
  ];

  const results = {
    vibes: mockVibes.filter((v) => v.caption.toLowerCase().includes(q)),
    people: mockUsers.filter((u) => u.name.toLowerCase().includes(q) || u.username.includes(q)),
    universities: mockUniversities.filter((u) => u.name.toLowerCase().includes(q)),
    clubs: mockClubs.filter((c) => c.name.toLowerCase().includes(q)),
    events: mockEvents.filter((e) => e.title.toLowerCase().includes(q)),
  };

  return (
    <div className="search-page">
      <h1>{t("common.search")}</h1>
      <SearchBar value={query} onChange={setQuery} placeholder={t("search.placeholder")} />
      <div className="search-page__highlights">
        <span>Trending</span>
        <span>#CampusLife</span>
        <span>#Hackathon</span>
        <span>#Basketball</span>
      </div>
      <TabBar tabs={tabs} activeId={tab} onChange={setTab} />
      <div className="search-results">
        {tab === "vibes" && results.vibes.map((v) => (
          <Link key={v.id} to="/feed" className="search-result">{v.caption}</Link>
        ))}
        {tab === "people" && results.people.map((u) => (
          <Link key={u.id} to={`/profile/${u.id}`} className="search-result">{u.name} {u.username}</Link>
        ))}
        {tab === "universities" && results.universities.map((u) => (
          <Link key={u.id} to={`/university/${u.id}`} className="search-result">{u.name}</Link>
        ))}
        {tab === "clubs" && results.clubs.map((c) => (
          <Link key={c.id} to={`/club/${c.id}`} className="search-result">{c.name}</Link>
        ))}
        {tab === "events" && results.events.map((e) => (
          <Link key={e.id} to={`/event/${e.id}`} className="search-result">{e.title}</Link>
        ))}
        {results[tab].length === 0 && <p className="search-empty">No results yet — try another keyword.</p>}
      </div>
    </div>
  );
}

export default Search;
