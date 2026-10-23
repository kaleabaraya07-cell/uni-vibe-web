import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import GlassPanel from "../../components/GlassPanel/GlassPanel";
import Button from "../../components/ui/Button/Button";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Bell,
  CheckCircle2,
  Building2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import "./Opportunities.css";

const upcomingCategories = [
  {
    id: "jobs",
    title: "Campus Jobs",
    icon: Briefcase,
    description: "On-campus student assistantships, department tutoring, lab management, and flexible work-study roles built around your class schedule.",
    examples: ["Research Assistant", "Lab Tech", "Library Monitor", "Peer Tutor"],
    status: "Launching Season 2026",
    color: "#2d8cff",
  },
  {
    id: "internships",
    title: "Verified Internships",
    icon: TrendingUp,
    description: "Curated summer and semester internships from top companies, tech startups, and partner organizations verified directly for university students.",
    examples: ["Software Engineering", "Business Development", "Data Science", "Design Fellow"],
    status: "Curated for Students",
    color: "#2ed573",
  },
  {
    id: "scholarships",
    title: "Scholarships & Grants",
    icon: GraduationCap,
    description: "Institutional grants, merit scholarships, conference sponsorships, and study-abroad stipends tailored to your faculty and major.",
    examples: ["STEM Merit Grant", "Academic Excellence", "Leadership Stipend", "Exchange Program"],
    status: "Direct Applications",
    color: "#ffd700",
  },
];

function Opportunities() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [interest, setInterest] = useState("all");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="opportunities-page">
      {/* Hero Announcement Header */}
      <div className="opportunities-hero">
        <div className="opportunities-hero__badge">
          <Sparkles size={14} /> Future Campus Destination
        </div>
        <h1>Student-First Career & Campus Opportunities</h1>
        <p className="opportunities-hero__desc">
          Uni Vibe is preparing a dedicated ecosystem for students to discover verified campus jobs, summer internships, and academic scholarships tailored to their university and degree.
        </p>

        {/* Waitlist Form */}
        <GlassPanel className="opportunities-waitlist-panel">
          {submitted ? (
            <div className="waitlist-success">
              <CheckCircle2 size={36} className="waitlist-success-icon" />
              <h3>You're on the priority notification list!</h3>
              <p>We'll notify {email} when opportunities unlock for {user?.university || "your university"}.</p>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
              <div className="waitlist-form__header">
                <Bell size={18} className="bell-icon" />
                <span>Get notified when opportunities launch at your campus</span>
              </div>
              <div className="waitlist-inputs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your campus email"
                  required
                  className="waitlist-input"
                />
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="waitlist-select"
                >
                  <option value="all">All Opportunities</option>
                  <option value="jobs">Campus Jobs</option>
                  <option value="internships">Internships</option>
                  <option value="scholarships">Scholarships</option>
                </select>
                <Button type="submit" variant="primary" className="waitlist-btn">
                  Join Priority Waitlist <ArrowRight size={15} />
                </Button>
              </div>
            </form>
          )}
        </GlassPanel>
      </div>

      {/* Category Previews */}
      <section className="opportunities-preview-section">
        <h2 className="preview-heading">What’s coming to Uni Vibe</h2>
        <div className="opportunities-category-grid">
          {upcomingCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <GlassPanel key={cat.id} className="opportunity-preview-card">
                <div
                  className="cat-icon-wrap"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <Icon size={24} />
                </div>
                <div className="cat-header">
                  <h3>{cat.title}</h3>
                  <span className="cat-status">{cat.status}</span>
                </div>
                <p className="cat-desc">{cat.description}</p>
                <div className="cat-tags">
                  {cat.examples.map((ex) => (
                    <span key={ex} className="cat-tag">
                      {ex}
                    </span>
                  ))}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </section>

      {/* Campus Employer Partner Banner */}
      <GlassPanel className="opportunities-partner-banner">
        <div className="partner-content">
          <Building2 size={24} className="partner-icon" />
          <div>
            <h3>Are you a campus department or hiring partner?</h3>
            <p>Connect directly with top university talent, student leaders, and passionate contributors.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => alert("Partner registration portal opening soon. Contact partnerships@univibe.com")}
        >
          Partner Inquiries
        </Button>
      </GlassPanel>
    </div>
  );
}

export default Opportunities;
