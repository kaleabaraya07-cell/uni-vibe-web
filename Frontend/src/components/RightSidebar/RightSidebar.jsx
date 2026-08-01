import { Link } from "react-router-dom";
import GlassPanel from "../GlassPanel/GlassPanel";
import { ChevronRight } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { universityStudents, upcomingEvent } from "../../data/mockData";
import RankingWidget from "../RankingWidget/RankingWidget";
import "./RightSidebar.css";

function RightSidebar() {
  const { t } = useLocale();

  return (
    <aside className="right-sidebar">
      <GlassPanel className="right-section">
        <div className="right-section__header">
          <h3>{t("feed.moreFromUni")}</h3>
          <Link to="/university/uni1" className="right-section__link">
            {t("common.seeAll")} <ChevronRight size={14} />
          </Link>
        </div>
        <div className="university-students">
          {universityStudents.map((s) => (
            <img key={s.id} src={s.avatar} alt="" className="university-students__avatar" />
          ))}
        </div>
      </GlassPanel>

      <RankingWidget />

      <GlassPanel className="right-section">
        <h3 className="right-section__title">{t("feed.upcomingEvents")}</h3>
        <Link to="/event/ev1" className="event-card">
          <div className="event-card__date">
            <span className="event-card__month">{upcomingEvent.date.split(" ")[0]}</span>
            <span className="event-card__day">{upcomingEvent.date.split(" ")[1]}</span>
          </div>
          <img src={upcomingEvent.image} alt={upcomingEvent.title} className="event-card__image" />
          <div className="event-card__info">
            <h4>{upcomingEvent.title}</h4>
            <p>{upcomingEvent.location}</p>
            <p className="event-card__time">{upcomingEvent.time}</p>
          </div>
        </Link>
        <Link to="/event/ev1" className="view-all-events">
          {t("feed.viewAllEvents")} <ChevronRight size={16} />
        </Link>
      </GlassPanel>
    </aside>
  );
}

export default RightSidebar;
