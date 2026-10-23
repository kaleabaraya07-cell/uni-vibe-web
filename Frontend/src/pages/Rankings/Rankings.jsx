import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import GlassPanel from "../../components/GlassPanel/GlassPanel";
import {
  CURRENT_SEASON,
  mockLeagueLeaderboard,
  mockLeagueHighlights,
  mockTopContributors,
  mockUserUniversityLeagueInfo,
} from "../../data/mockRankings";
import {
  Trophy,
  TrendingUp,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Clock,
  ShieldCheck,
  ChevronRight,
  Award,
  Users,
} from "lucide-react";
import "./Rankings.css";

function Rankings() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all"); // 'all' | 'my-uni' | 'contributors'

  const userUniId = user?.universityId || "uni1";
  const userUniData = mockLeagueLeaderboard.find((u) => u.universityId === userUniId) || mockLeagueLeaderboard[0];

  return (
    <div className="league-page">
      {/* Header Banner */}
      <header className="league-header">
        <div className="league-header__title-row">
          <div className="league-header__badge-group">
            <span className="league-live-tag">
              <span className="league-live-dot" /> LIVE
            </span>
            <span className="league-season-tag">
              <Clock size={13} /> {CURRENT_SEASON.name} (UTC)
            </span>
          </div>
          <h1 className="league-title">Uni Vibe League</h1>
          <p className="league-subtitle">
            The global collegiate championship. Points (PT) are earned through authentic campus engagement across verified student posts.
          </p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="league-highlights-grid">
          {/* Current Leader */}
          <GlassPanel className="league-highlight-card leader">
            <div className="highlight-tag leader">
              <Trophy size={14} /> Current Leader
            </div>
            <div className="highlight-body">
              <img
                src={mockLeagueHighlights.currentLeader.university.logo}
                alt=""
                className="highlight-logo"
              />
              <div className="highlight-info">
                <h3>{mockLeagueHighlights.currentLeader.university.name}</h3>
                <span className="highlight-score">
                  {mockLeagueHighlights.currentLeader.university.seasonPT.toLocaleString()} PT
                </span>
                <p className="highlight-sub">{mockLeagueHighlights.currentLeader.highlight}</p>
              </div>
            </div>
          </GlassPanel>

          {/* Fastest Climber */}
          <GlassPanel className="league-highlight-card climber">
            <div className="highlight-tag climber">
              <Flame size={14} /> Fastest Climber
            </div>
            <div className="highlight-body">
              <img
                src={mockLeagueHighlights.fastestClimber.university.logo}
                alt=""
                className="highlight-logo"
              />
              <div className="highlight-info">
                <h3>{mockLeagueHighlights.fastestClimber.university.name}</h3>
                <span className="highlight-movement">
                  <ArrowUpRight size={16} /> +2 Ranks
                </span>
                <p className="highlight-sub">{mockLeagueHighlights.fastestClimber.highlight}</p>
              </div>
            </div>
          </GlassPanel>

          {/* Trending Up */}
          <GlassPanel className="league-highlight-card trending">
            <div className="highlight-tag trending">
              <TrendingUp size={14} /> Trending Up
            </div>
            <div className="highlight-body">
              <img
                src={mockLeagueHighlights.trendingUp.university.logo}
                alt=""
                className="highlight-logo"
              />
              <div className="highlight-info">
                <h3>{mockLeagueHighlights.trendingUp.university.name}</h3>
                <span className="highlight-score">
                  {mockLeagueHighlights.trendingUp.university.seasonPT.toLocaleString()} PT
                </span>
                <p className="highlight-sub">{mockLeagueHighlights.trendingUp.highlight}</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </header>

      {/* Navigation Pills */}
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

      {/* Main Leaderboard Table */}
      {(selectedTab === "all" || selectedTab === "my-uni") && (
        <section className="league-section">
          <div className="league-section__header">
            <div>
              <h2>Top Universities Leaderboard</h2>
              <p className="league-section__desc">
                Ranked by cumulative Season {CURRENT_SEASON.year} PT across verified student vibes.
              </p>
            </div>
          </div>

          <div className="league-table-container">
            <table className="league-table">
              <thead>
                <tr>
                  <th className="th-rank">Rank</th>
                  <th className="th-mov">Movement</th>
                  <th className="th-uni">University</th>
                  <th className="th-pt">Season PT</th>
                  <th className="th-students">Students</th>
                  <th className="th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockLeagueLeaderboard.map((item) => {
                  const isUserUni = user?.universityId === item.universityId;
                  return (
                    <tr
                      key={item.universityId}
                      className={`league-row ${isUserUni ? "league-row--user" : ""}`}
                    >
                      <td className="td-rank">
                        <span className={`rank-badge rank-${item.rank}`}>
                          {item.rank === 1 ? "🥇 #1" : item.rank === 2 ? "🥈 #2" : item.rank === 3 ? "🥉 #3" : `#${item.rank}`}
                        </span>
                      </td>

                      <td className="td-mov">
                        {item.movement === "up" ? (
                          <span className="movement-tag up">
                            <ArrowUpRight size={14} /> +{item.movementValue}
                          </span>
                        ) : item.movement === "down" ? (
                          <span className="movement-tag down">
                            <ArrowDownRight size={14} /> -{item.movementValue}
                          </span>
                        ) : (
                          <span className="movement-tag same">
                            <Minus size={14} /> 0
                          </span>
                        )}
                      </td>

                      <td className="td-uni">
                        <div className="league-uni-cell">
                          <img src={item.logo} alt="" className="league-uni-logo" />
                          <div className="league-uni-names">
                            <div className="league-uni-name-row">
                              <span className="league-uni-name">{item.name}</span>
                              <span className="league-uni-short">({item.shortName})</span>
                              {isUserUni && <span className="your-uni-badge">Your Uni</span>}
                            </div>
                            <span className="league-uni-location">{item.location}</span>
                            {item.trophies?.length > 0 && (
                              <div className="league-trophy-strip">
                                {item.trophies.map((t) => (
                                  <span key={t} className="trophy-pill">
                                    🏆 {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="td-pt">
                        <span className="pt-value">{item.seasonPT.toLocaleString()}</span>
                        <span className="pt-unit">PT</span>
                      </td>

                      <td className="td-students">
                        <span className="students-count">
                          {item.activeStudents.toLocaleString()}
                        </span>
                      </td>

                      <td className="td-action">
                        <Link
                          to={`/university/${item.universityId}`}
                          className="view-uni-btn"
                        >
                          View Uni <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Your University Spotlight Card */}
      {user && (
        <section className="league-section">
          <GlassPanel className="your-uni-spotlight">
            <div className="your-uni-spotlight__header">
              <ShieldCheck size={24} className="spotlight-shield" />
              <div>
                <h3>Your University League Status</h3>
                <p>Track your student impact towards {userUniData.name}’s seasonal ranking.</p>
              </div>
            </div>

            <div className="your-uni-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">University Rank</span>
                <span className="metric-value highlight">#{userUniData.rank}</span>
                <span className="metric-sub">{userUniData.seasonPT.toLocaleString()} Total PT</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Your Personal Rank</span>
                <span className="metric-value">#{mockUserUniversityLeagueInfo.userRankWithinUni}</span>
                <span className="metric-sub">Within {userUniData.shortName}</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Your Contribution</span>
                <span className="metric-value">{mockUserUniversityLeagueInfo.userSeasonalPT} PT</span>
                <span className="metric-sub">{mockUserUniversityLeagueInfo.userContributionPercent}% of university total</span>
              </div>

              <div className="metric-box">
                <span className="metric-label">Top Department</span>
                <span className="metric-value text-small">{mockUserUniversityLeagueInfo.topDepartment}</span>
                <span className="metric-sub">Highest earner</span>
              </div>
            </div>
          </GlassPanel>
        </section>
      )}

      {/* Top Student Contributors Section */}
      <section className="league-section">
        <div className="league-section__header">
          <div>
            <h2>Top Student Contributors</h2>
            <p className="league-section__desc">
              Students generating the highest ranking points for their campus in Season {CURRENT_SEASON.year}.
            </p>
          </div>
        </div>

        <div className="top-contributors-grid">
          {mockTopContributors.map((c) => (
            <GlassPanel key={c.rank} className="contributor-card">
              <div className="contributor-rank-badge">#{c.rank}</div>
              <img src={c.user.avatar} alt={c.user.name} className="contributor-avatar" />
              <div className="contributor-info">
                <h4>{c.user.name}</h4>
                <span className="contributor-username">{c.user.username}</span>
                <span className="contributor-uni">{c.user.university}</span>
              </div>
              <div className="contributor-stats">
                <div className="contributor-pt">
                  <span className="contributor-pt-val">{c.studentPT}</span>
                  <span className="contributor-pt-label">PT</span>
                </div>
                <div className="contributor-meta">
                  <span>{c.postCount} posts</span>
                  <span>{c.contributionPercentage}% share</span>
                </div>
              </div>
              <Link to={`/profile/${c.user.id}`} className="contributor-link">
                View Profile
              </Link>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Plain-language overview; scoring details remain server-side. */}
      <section className="league-section explainer-section">
        <GlassPanel className="how-points-work-card">
          <div className="how-points-work__header">
            <div className="how-points-work__title">
              <Info size={20} className="info-icon" />
              <div>
                <h3>How the Uni Vibe League works</h3>
                <p>Standings recognize authentic, verified participation in university life.</p>
              </div>
            </div>
          </div>

          <div className="points-rules-grid">
            <div className="rule-card">
              <span className="rule-badge">1</span>
              <h4>Meaningful views</h4>
              <p>
                Posts need genuine watch time to contribute. Brief scroll-bys are not treated as meaningful views.
              </p>
            </div>

            <div className="rule-card">
              <span className="rule-badge">2</span>
              <h4>Community engagement</h4>
              <p>
                Likes, saves, and reposts help show which campus moments resonate with the community.
              </p>
            </div>

            <div className="rule-card">
              <span className="rule-badge">3</span>
              <h4>Verified contributions</h4>
              <p>
                Only eligible posts from verified university communities contribute to their standings.
              </p>
            </div>

            <div className="rule-card">
              <span className="rule-badge">4</span>
              <h4>Seasonal standings</h4>
              <p>
                Each season recognizes activity from its own dates, so every university starts fresh.
              </p>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}

export default Rankings;
