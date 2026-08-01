import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("demo@univibe.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const { login, socialLogin } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) navigate(from, { replace: true });
    else setError(t("auth.invalid"));
  };

  const handleSocial = () => {
    socialLogin();
    navigate(from, { replace: true });
  };

  return (
    <div className="login">
      <p className="auth-layout__tagline">{t("app.tagline")}</p>
      <h2 className="login__title">{t("auth.welcomeBack")}</h2>
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
        {error && <p className="login__error">{error}</p>}
        <Button type="submit" variant="primary" className="login__submit">
          {t("auth.login")}
        </Button>
      </form>
      <p className="login__divider">{t("auth.orContinue")}</p>
      <div className="login__social">
        <Button variant="social" onClick={handleSocial}>{t("auth.google")}</Button>
        <Button variant="social" onClick={handleSocial}>{t("auth.facebook")}</Button>
        <Button variant="social" onClick={handleSocial}>{t("auth.apple")}</Button>
      </div>
      <p className="login__switch">
        {t("auth.noAccount")}{" "}
        <Link to="/signup">{t("auth.signup")}</Link>
      </p>
    </div>
  );
}

export default Login;
