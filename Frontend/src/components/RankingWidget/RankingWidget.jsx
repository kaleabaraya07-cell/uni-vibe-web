import GlassPanel from "../GlassPanel/GlassPanel";
import { useLocale } from "../../context/LocaleContext";
import { topContributors } from "../../data/mockData";
import "./RankingWidget.css";

function RankingWidget() {
  const { t } = useLocale();

  return (
    <GlassPanel className="ranking-widget">
      <h3 className="ranking-widget__title">{t("feed.topContributors")}</h3>
      <ul className="ranking-widget__list">
        {topContributors.map((c) => (
          <li key={c.rank} className="ranking-widget__item">
            <span className="ranking-widget__rank">{c.rank}</span>
            <img src={c.avatar} alt={c.name} className="ranking-widget__avatar" />
            <span className="ranking-widget__name">{c.name}</span>
            <span className="ranking-widget__points">{c.points}</span>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

export default RankingWidget;
