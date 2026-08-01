import { Link } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import Button from "../../components/ui/Button/Button";
import "./NotFound.css";

function NotFound() {
  const { t } = useLocale();

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>{t("common.notFound")}</p>
      <Link to="/">
        <Button variant="primary">{t("common.goHome")}</Button>
      </Link>
    </div>
  );
}

export default NotFound;
