import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import universityService from "../../services/universityService";
import verificationService from "../../services/verificationService";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Modal from "../../components/ui/Modal/Modal";
import {
  GraduationCap,
  Compass,
  CheckCircle2,
  Building2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import "./SignUp.css";

function SignUp() {
  const [step, setStep] = useState(1); // 1 = Account Info, 2 = Student Status & University
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isStudent, setIsStudent] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [selectedUniId, setSelectedUniId] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [universityEmail, setUniversityEmail] = useState("");
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  // University Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqUniName, setReqUniName] = useState("");
  const [reqUniLocation, setReqUniLocation] = useState("");
  const [reqUniWebsite, setReqUniWebsite] = useState("");
  const [reqSubmitted, setReqSubmitted] = useState(false);

  const { signup, socialLogin } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    universityService
      .getUniversities()
      .then((items) => {
        if (!active) return;
        setUniversities(items);
        setSelectedUniId(items[0]?.id || "");
      })
      .catch((error) => {
        if (active) setRequestError(error.message || "Could not load universities.");
      });
    return () => {
      active = false;
    };
  }, []);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setRequestError("");
    const departmentName = customDept.trim();
    let accountWasCreated = false;

    try {
      await signup({
        name,
        username,
        email,
        password,
        isStudent,
        universityId: isStudent ? selectedUniId : null,
        departmentName: isStudent ? departmentName : null,
      });
      accountWasCreated = true;
      setAccountCreated(true);
      if (isStudent) {
        await verificationService.submitRequest({ universityEmail });
      }
      navigate("/", { replace: true });
    } catch (error) {
      setRequestError(accountWasCreated
        ? `Your account was created, but the verification request was not submitted: ${error.message || "server error"}`
        : error.message || "Unable to complete sign up.");
    } finally {
      setSubmitting(false);
    }
  };

  const retryVerification = async () => {
    setSubmitting(true);
    setRequestError("");
    try {
      await verificationService.submitRequest({ universityEmail });
      navigate("/", { replace: true });
    } catch (error) {
      setRequestError(`Verification request was not submitted: ${error.message || "server error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocial = async () => {
    try {
      await socialLogin();
      navigate("/", { replace: true });
    } catch (error) {
      setRequestError(error.message || "External sign-in is not configured yet.");
    }
  };

  const handleUniversityRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    try {
      await universityService.submitUniversityRequest({
        name: reqUniName,
        location: reqUniLocation,
        website: reqUniWebsite,
        applicantEmail: email,
      });
      setReqSubmitted(true);
    } catch (error) {
      setRequestError(error.message || "Unable to submit your university request.");
    }
  };

  return (
    <div className="signup-page">
      <p className="auth-layout__tagline">{t("app.tagline")}</p>
      <h2 className="signup-title">{t("auth.createAccount")}</h2>

      {/* Step Indicator */}
      <div className="signup-steps">
        <div className={`signup-step-pill ${step >= 1 ? "active" : ""}`}>
          <span className="step-num">1</span> Account Details
        </div>
        <div className={`signup-step-pill ${step >= 2 ? "active" : ""}`}>
          <span className="step-num">2</span> Campus Profile
        </div>
      </div>

      {accountCreated ? (
        <div className="signup-form">
          <p className="signup-notice" role="status">
            Your account was created. Submit the university verification request to continue.
          </p>
          {requestError && <p className="login__error" role="alert">{requestError}</p>}
          <Button type="button" variant="primary" className="signup-submit" disabled={submitting} onClick={retryVerification}>
            {submitting ? "Submitting request…" : "Retry verification request"}
          </Button>
        </div>
      ) : step === 1 && (
        <form className="signup-form" onSubmit={handleNextStep}>
          <Input
            label={t("auth.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kalab Araya"
            required
          />
          <Input
            label={t("auth.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. kalab"
            required
          />
          <Input
            label={t("auth.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label={t("auth.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={12}
            required
          />

          <Button type="submit" variant="primary" className="signup-submit">
            Continue to Campus Profile <ArrowRight size={16} />
          </Button>

          <p className="login__divider">{t("auth.orContinue")}</p>
          <div className="login__social">
            <Button type="button" variant="social" onClick={handleSocial}>
              {t("auth.google")}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-question-card">
            <label className="signup-label">Are you currently a university student?</label>
            <div className="signup-student-toggle">
              <button
                type="button"
                className={`signup-role-card ${isStudent ? "selected" : ""}`}
                onClick={() => setIsStudent(true)}
              >
                <GraduationCap size={24} className="role-icon" />
                <div className="role-info">
                  <span className="role-title">Yes, I'm a Student</span>
                  <span className="role-desc">Post vibes, represent university in League & join clubs</span>
                </div>
              </button>

              <button
                type="button"
                className={`signup-role-card ${!isStudent ? "selected" : ""}`}
                onClick={() => setIsStudent(false)}
              >
                <Compass size={24} className="role-icon" />
                <div className="role-info">
                  <span className="role-title">No, Campus Explorer</span>
                  <span className="role-desc">Discover campus life, view vibes & follow universities</span>
                </div>
              </button>
            </div>
          </div>

          {isStudent ? (
            <div className="signup-student-fields">
              <div className="input-group">
                <label className="signup-label">Select Your University</label>
                <select
                  className="signup-select"
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  required
                  disabled={universities.length === 0}
                >
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.shortName})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="signup-link-btn"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  <Building2 size={13} /> My university isn't listed
                </button>
              </div>

              <div className="input-group">
                <Input
                  label="Department / Field of Study"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="e.g. Biomedical Engineering"
                />
                <Input
                  label="University email for verification"
                  type="email"
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                />
              </div>

              <div className="signup-notice">
                <CheckCircle2 size={16} className="notice-icon" />
                <span>
                  Student accounts remain pending until an administrator approves their university verification request.
                </span>
              </div>
            </div>
          ) : (
            <div className="signup-explorer-notice">
              <Compass size={18} />
              <p>
                As a general explorer, you can browse all universities, watch vibes, follow events, and explore campus culture. (Post creation is reserved for verified university students).
              </p>
            </div>
          )}

          <div className="signup-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="signup-back-btn"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <Button type="submit" variant="primary" className="signup-submit" disabled={submitting || (isStudent && universities.length === 0)}>
              {submitting ? "Creating account…" : "Complete Sign Up"}
            </Button>
          </div>
        </form>
      )}

      {requestError && <p className="login__error" role="alert">{requestError}</p>}

      <p className="login__switch">
        {t("auth.hasAccount")}{" "}
        <Link to="/login">{t("auth.login")}</Link>
      </p>

      {/* University Request Modal */}
      <Modal
        open={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request University Addition"
      >
        {reqSubmitted ? (
          <div className="uni-req-success">
            <CheckCircle2 size={44} className="uni-req-icon" />
            <h3>Request Submitted!</h3>
            <p>Our campus team will review and add your university to Uni Vibe soon.</p>
          </div>
        ) : (
          <form className="uni-req-form" onSubmit={handleUniversityRequest}>
            <p className="uni-req-desc">
              Can't find your institution? Tell us about your university and our verification team will review it.
            </p>
            <Input
              label="University Official Name"
              value={reqUniName}
              onChange={(e) => setReqUniName(e.target.value)}
              placeholder="e.g. Hawassa University"
              required
            />
            <Input
              label="City & Country"
              value={reqUniLocation}
              onChange={(e) => setReqUniLocation(e.target.value)}
              placeholder="e.g. Hawassa, Ethiopia"
              required
            />
            <Input
              label="University Website (optional)"
              value={reqUniWebsite}
              onChange={(e) => setReqUniWebsite(e.target.value)}
              placeholder="https://hu.edu.et"
            />
            <Button type="submit" variant="primary" className="uni-req-submit">
              Submit University Request
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default SignUp;
