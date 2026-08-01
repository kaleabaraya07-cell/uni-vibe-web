import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import "../Login/Login.css";

function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, socialLogin } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(name, username, email, password);
    navigate("/", { replace: true });
  };

  const handleSocial = () => {
    socialLogin();
    navigate("/", { replace: true });
  };

  return (
    <div className="login">
      <p className="auth-layout__tagline">{t("app.tagline")}</p>
      <h2 className="login__title">{t("auth.createAccount")}</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <Input label={t("auth.name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label={t("auth.username")} value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input label={t("auth.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label={t("auth.password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="primary" className="login__submit">{t("auth.signup")}</Button>
      </form>
      <p className="login__divider">{t("auth.orContinue")}</p>
      <div className="login__social">
        <Button variant="social" onClick={handleSocial}>{t("auth.google")}</Button>
        <Button variant="social" onClick={handleSocial}>{t("auth.facebook")}</Button>
        <Button variant="social" onClick={handleSocial}>{t("auth.apple")}</Button>
      </div>
      <p className="login__switch">
        {t("auth.hasAccount")}{" "}
        <Link to="/login">{t("auth.login")}</Link>
      </p>
    </div>
  );
}

export default SignUp;
