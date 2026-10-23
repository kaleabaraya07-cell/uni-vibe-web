import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("demo@univibe.com");
  const [password, setPassword] = useState("demo123");
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");

  const { login, socialLogin } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password, rememberMe);
    if (result.ok) navigate(from, { replace: true });
    else setError(t("auth.invalid") || "Invalid email or password");
  };

  const handleSocial = () => {
    socialLogin();
    navigate(from, { replace: true });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgot(false);
      setForgotSent(false);
    }, 2000);
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

          {error && <p className="login__error">{error}</p>}

          <Button type="submit" variant="primary" className="login__submit">
            {t("auth.login")}
          </Button>

          <div className="login__demo-badge">
            <span>Demo: <strong>demo@univibe.com</strong> • <strong>demo123</strong></span>
          </div>
        </form>
      ) : (
        <form className="login__form" onSubmit={handleForgotSubmit}>
          <p className="login__forgot-desc">
            Enter your email and we'll send you instructions to reset your Uni Vibe password.
          </p>
          <Input
            label={t("auth.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {forgotSent ? (
            <p className="login__success-msg">Reset link dispatched to your email!</p>
          ) : (
            <Button type="submit" variant="primary" className="login__submit">
              Send Reset Instructions
            </Button>
          )}
          <button
            type="button"
            className="login__forgot-cancel"
            onClick={() => setShowForgot(false)}
          >
            Back to Login
          </button>
        </form>
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
