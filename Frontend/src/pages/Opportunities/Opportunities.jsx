import { useState } from "react";
import { useLocale } from "../../context/LocaleContext";
import { mockOpportunities } from "../../data/mockOpportunities";
import Button from "../../components/ui/Button/Button";
import { Search, Filter, Sparkles } from "lucide-react";
import "./Opportunities.css";

function Opportunities() {
  const { t } = useLocale();
  const [items, setItems] = useState(mockOpportunities);
  const [query, setQuery] = useState("");

  const toggleSave = (id) => {
    setItems((prev) => prev.map((o) => o.id === id ? { ...o, saved: !o.saved } : o));
  };

  const filtered = items.filter((opp) => opp.title.toLowerCase().includes(query.toLowerCase()) || opp.type.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="opportunities-page">
      <h1>{t("opportunities.title")}</h1>
      <div className="opportunities-page__toolbar">
        <label className="opportunities-page__search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search opportunities" />
        </label>
        <button type="button" className="opportunities-page__filter"><Filter size={16} /> Filters</button>
      </div>
      <div className="opportunities-list">
        {filtered.map((opp) => (
          <article key={opp.id} className="opportunity-card">
            <span className="opportunity-card__type">{opp.type}</span>
            <h3>{opp.title}</h3>
            <p className="opportunity-card__company">{opp.company} • {opp.location}</p>
            <p>{opp.description}</p>
            <p className="opportunity-card__deadline">Deadline: {opp.deadline}</p>
            <div className="opportunity-card__actions">
              <Button variant={opp.saved ? "secondary" : "primary"} onClick={() => toggleSave(opp.id)}>
                {opp.saved ? "Saved" : t("common.save")}
              </Button>
              <Button variant="ghost">{t("common.share")}</Button>
              <span className="opportunity-card__badge"><Sparkles size={14} /> Apply now</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Opportunities;
