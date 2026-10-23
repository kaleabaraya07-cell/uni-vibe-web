import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import rankingService from "../../services/rankingService";
import GlassPanel from "../../components/GlassPanel/GlassPanel";
import {
  Trophy,
  Clock,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import "./Rankings.css";

function Rankings() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [leaderboard, setLeaderboard] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const year = new Date().getUTCFullYear();

  useEffect(() => {
    let active = true;
    Promise.all([
      rankingService.getLeaderboard(year),
      rankingService.getTopContributors(year),
    ])
      .then(([universities, students]) => {
        if (!active) return;
        setLeaderboard(universities);
        setContributors(students);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load League standings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [year]);

  const userUniversity = leaderboard.find((item) => item.universityId === user?.universityId);
  const displayedUniversities = selectedTab === "my-uni"
    ? leaderboard.filter((item) => item.universityId === user?.universityId)
    : leaderboard;

  return (
    <div className="league-page">
      <header className="league-header">
        <div className="league-header__title-row">
          <div className="league-header__badge-group">
            <span className="league-live-tag">SEASON</span>
            <span className="league-season-tag"><Clock size={13} /> {year} (UTC)</span>
          </div>
          <h1 className="league-title">Uni Vibe League</h1>
          <p className="league-subtitle">
            University standings are calculated from verified four-second views and persistent likes, saves, and reposts.
          </p>
        </div>
        {leaderboard[0] && (
          <GlassPanel className="league-highlight-card leader">
            <div className="highlight-tag leader"><Trophy size={14} /> Season leader</div>
            <div className="highlight-body">
              <div className="highlight-info">
                <h3>{leaderboard[0].name}</h3>
                <span className="highlight-score">{leaderboard[0].seasonPT.toFixed(2)} PT</span>
                <p className="highlight-sub">Current {year} annual season leader</p>
              </div>
            </div>
          </GlassPanel>
        )}
      </header>

      <div className="league-nav-pills">
        <button
          type="button"
          className={`league-pill ${selectedTab === "all" ? "active" : ""}`}
          onClick={() => setSelectedTab("all")}
        >
          <Trophy size={15} /> All Universities
        </button>
        <button
          type="button"
          className={`league-pill ${selectedTab === "my-uni" ? "active" : ""}`}
          onClick={() => setSelectedTab("my-uni")}
        >
          <Users size={15} /> Your University
        </button>
        <button
          type="button"
          className={`league-pill ${selectedTab === "contributors" ? "active" : ""}`}
          onClick={() => setSelectedTab("contributors")}
        >
          <Award size={15} /> Top Contributors
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Loading League standings…</p>}

      {!loading && (selectedTab === "all" || selectedTab === "my-uni") && (
        <section className="league-section">
          <div className="league-section__header">
            <div>
              <h2>Top Universities Leaderboard</h2>
              <p className="league-section__desc">Season {year} annual standings, calculated by the server.</p>
            </div>
          </div>
          {displayedUniversities.length === 0 ? (
            <p className="saved-empty">
              {selectedTab === "my-uni" ? "Your university has no League points yet." : "No universities have earned points this season yet."}
            </p>
          ) : (
            <div className="league-table-container">
              <table className="league-table">
                <thead>
                  <tr>
                    <th className="th-rank">Rank</th>
                    <th className="th-uni">University</th>
                    <th className="th-pt">Season PT</th>
                    <th className="th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUniversities.map((item) => {
                    const isUserUni = user?.universityId === item.universityId;
                    return (
                      <tr key={item.universityId} className={`league-row ${isUserUni ? "league-row--user" : ""}`}>
                        <td className="td-rank"><span className={`rank-badge rank-${item.rank}`}>#{item.rank}</span></td>
                        <td className="td-uni">
                          <div className="league-uni-cell">
                            <div className="league-uni-names">
                              <div className="league-uni-name-row">
                                <span className="league-uni-name">{item.name}</span>
                                <span className="league-uni-short">({item.shortName})</span>
                                {isUserUni && <span className="your-uni-badge">Your Uni</span>}
                              </div>
                              {item.location && <span className="league-uni-location">{item.location}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="td-pt">
                          <span className="pt-value">{item.seasonPT.toFixed(2)}</span>
                          <span className="pt-unit">PT</span>
                        </td>
                        <td className="td-action">
                          <Link to={`/university/${item.universityId}`} className="view-uni-btn">
                            View Uni <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {user && userUniversity && selectedTab !== "contributors" && (
        <section className="league-section">
          <GlassPanel className="your-uni-spotlight">
            <div className="your-uni-spotlight__header">
              <ShieldCheck size={24} className="spotlight-shield" />
              <div>
                <h3>Your University League Status</h3>
                <p>Current annual standing for {userUniversity.name}.</p>
              </div>
            </div>
            <div className="your-uni-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">University Rank</span>
                <span className="metric-value highlight">#{userUniversity.rank}</span>
                <span className="metric-sub">{userUniversity.seasonPT.toFixed(2)} Season PT</span>
              </div>
            </div>
          </GlassPanel>
        </section>
      )}

      {selectedTab === "contributors" && !loading && (
        <section className="league-section">
          <div className="league-section__header">
            <div>
              <h2>Top Student Contributors</h2>
              <p className="league-section__desc">Verified contributors ranked by annual League points.</p>
            </div>
          </div>
          {contributors.length === 0 ? (
            <p className="saved-empty">No students have earned points this season yet.</p>
          ) : (
            <div className="top-contributors-grid">
              {contributors.map((contributor) => (
                <GlassPanel key={contributor.user.id} className="contributor-card">
                  <div className="contributor-rank-badge">#{contributor.rank}</div>
                  <div className="contributor-info">
                    <h4>{contributor.user.name}</h4>
                    <span className="contributor-uni">{contributor.user.university}</span>
                  </div>
                  <div className="contributor-stats">
                    <div className="contributor-pt">
                      <span className="contributor-pt-val">{contributor.studentPT.toFixed(2)}</span>
                      <span className="contributor-pt-label">PT</span>
                    </div>
                  </div>
                  <Link to={`/profile/${contributor.user.id}`} className="contributor-link">View Profile</Link>
                </GlassPanel>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Rankings;
