import "./AppDownloadSection.scss";
import { Link } from "react-router-dom";
import { APP_DOWNLOAD_ROUTE } from "./appDownload.constants";

type AppDownloadCTAProps = {
  className?: string;
};

const AppDownloadCTA = ({ className = "" }: AppDownloadCTAProps) => {
  return (
    <aside className={`app-download-cta ${className}`.trim()}>
      <div className="app-download-cta__text">
        <p className="app-download-cta__title">Continuez sur mobile</p>
        <p className="app-download-cta__description">
          Recevez vos actus, feedbacks et rapports directement dans
          l'application.
        </p>
      </div>
      <Link
        to={APP_DOWNLOAD_ROUTE}
        className="app-download-cta__link"
        aria-label="Accéder à la section de téléchargement de l'application Usearly"
      >
        Télécharger l'application
      </Link>
    </aside>
  );
};

export default AppDownloadCTA;
