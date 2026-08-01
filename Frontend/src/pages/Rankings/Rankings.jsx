import { useLocale } from "../../context/LocaleContext";
import { mockUniversities } from "../../data/mockUniversities";
import RankingWidget from "../../components/RankingWidget/RankingWidget";
import "./Rankings.css";

function Rankings() {
  const { t } = useLocale();

  return (
    <div className="rankings-page">
      <h1>{t("rankings.title")}</h1>
      <section>
        <h2>Universities</h2>
        <ul className="rankings-list">
          {mockUniversities.map((u) => (
            <li key={u.id}><span>#{u.ranking}</span> {u.shortName} — {u.vibeScore.toLocaleString()} pts</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Top Students</h2>
        <RankingWidget />
      </section>
    </div>
  );
}

export default Rankings;
