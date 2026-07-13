import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground">
      <div className="text-center px-4">
        <h1 className="text-6xl font-display font-bold mb-4 text-gradient-primary">
          {t("notFound.code")}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">{t("notFound.message")}</p>
        <a href="/" className="text-primary hover:underline font-medium">
          {t("notFound.backHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
