import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import SearchBar from "../../components/SearchBar/SearchBar";
import TabBar from "../../components/ui/TabBar/TabBar";
import searchService from "../../services/searchService";
import "./Search.css";

const emptyResults = { vibes: [], people: [], universities: [] };

function Search() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("vibes");
  const [results, setResults] = useState(emptyResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    { id: "vibes", label: "Vibes" },
    { id: "people", label: "People" },
    { id: "universities", label: "Universities" },
    { id: "clubs", label: "Clubs" },
    { id: "events", label: "Events" },
  ];

  useEffect(() => {
    const cleaned = query.trim();
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (!cleaned) {
        setResults(emptyResults);
        setError("");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      searchService.search(cleaned, 20, { signal: controller.signal })
        .then((nextResults) => setResults(nextResults))
        .catch((requestError) => {
          if (!controller.signal.aborted) {
            setError(requestError.message || "Unable to search Uni Vibe.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, cleaned ? 250 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const unavailable = tab === "clubs" || tab === "events";
  const tabResults = unavailable ? [] : results[tab];

  return (
    <div className="search-page">
      <h1>{t("common.search")}</h1>
      <SearchBar value={query} onChange={setQuery} placeholder={t("search.placeholder")} />
      <TabBar tabs={tabs} activeId={tab} onChange={setTab} />
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Searching…</p>}
      <div className="search-results">
        {!loading && tab === "vibes" && results.vibes.map((vibe) => (
          <Link key={vibe.id} to={`/feed#post-${encodeURIComponent(vibe.id)}`} className="search-result">
            {vibe.caption}
          </Link>
        ))}
        {!loading && tab === "people" && results.people.map((person) => (
          <Link key={person.id} to={`/profile/${person.id}`} className="search-result">
            {person.name} {person.username}
          </Link>
        ))}
        {!loading && tab === "universities" && results.universities.map((university) => (
          <Link key={university.id} to={`/university/${university.id}`} className="search-result">
            {university.name}
          </Link>
        ))}
        {!loading && unavailable && (
          <p className="search-empty">Search for clubs and events will be available when those services are implemented.</p>
        )}
        {!loading && !unavailable && query.trim() && tabResults.length === 0 && (
          <p className="search-empty">No results yet — try another keyword.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
