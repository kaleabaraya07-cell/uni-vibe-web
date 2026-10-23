import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, socialLogin, authError, loading } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message || t("auth.invalid") || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocial = async () => {
    try {
      await socialLogin();
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "External sign-in is not configured yet.");
    }
  };

  return (
    <div className="login">
      <p className="auth-layout__tagline">{t("app.tagline")}</p>
      <h2 className="login__title">{t("auth.welcomeBack")}</h2>

      {!showForgot ? (
        <form className="login__form" onSubmit={handleSubmit}>
          <Input
            label={t("auth.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t("auth.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login__options-row">
            <label className="login__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="login__forgot-link"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>

          {(error || authError) && <p className="login__error" role="alert">{error || authError}</p>}

          <Button type="submit" variant="primary" className="login__submit" disabled={submitting || loading}>
            {submitting ? "Signing in…" : t("auth.login")}
          </Button>

          <div className="login__demo-badge">
            <span>Use your registered Uni Vibe account.</span>
          </div>
        </form>
      ) : (
        <div className="login__form">
          <p className="login__forgot-desc">
            Password reset is not available yet. No reset email has been sent.
          </p>
          <button
            type="button"
            className="login__forgot-cancel"
            onClick={() => setShowForgot(false)}
          >
            Back to Login
          </button>
        </div>
      )}

      <p className="login__divider">{t("auth.orContinue")}</p>
      <div className="login__social">
        <Button variant="social" onClick={handleSocial}>
          {t("auth.google")}
        </Button>
      </div>

      <p className="login__switch">
        {t("auth.noAccount")}{" "}
        <Link to="/signup">{t("auth.signup")}</Link>
      </p>

      <div className="login__legal">
        <span>By continuing, you agree to Uni Vibe's </span>
        <a href="#terms">Terms of Service</a>
        <span> and </span>
        <a href="#privacy">Privacy Policy</a>.
      </div>
    </div>
  );
}

export default Login;
