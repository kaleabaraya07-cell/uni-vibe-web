import { useLocale } from "../../context/LocaleContext";
import { mockLiveStreams } from "../../data/mockOpportunities";
import Badge from "../../components/ui/Badge/Badge";
import "./Live.css";

function Live() {
  const { t } = useLocale();

  return (
    <div className="live-page">
      <h1>{t("live.title")}</h1>
      <div className="live-grid">
        {mockLiveStreams.map((stream) => (
          <div key={stream.id} className="live-card">
            <div className="live-card__thumb">
              <img src={stream.thumbnail} alt={stream.title} />
              <Badge variant="live">LIVE</Badge>
              <span className="live-card__viewers">{stream.viewers} watching</span>
            </div>
            <div className="live-card__info">
              <img src={stream.user.avatar} alt="" className="live-card__avatar" />
              <div>
                <h3>{stream.title}</h3>
                <p>{stream.user.name}</p>
              </div>
            </div>
            <button type="button" className="live-card__join">{t("live.join")}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Live;
