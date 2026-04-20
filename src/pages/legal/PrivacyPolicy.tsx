import Footer from "@src/components/layout/Footer";
import "./LegalPages.scss";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="legal-container">
        <h1>Politique de confidentialité Usearly</h1>

        <p className="legal-updated">
          Dernière mise à jour : {new Date().getFullYear()}
        </p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Usearly est conçu pour respecter la vie privée des utilisateurs.
            Cette politique explique quelles données sont collectées, comment
            elles sont utilisées et protégées dans le cadre de l’utilisation de
            la plateforme et de l’extension Chrome Usearly.
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>

          <p>
            Usearly peut collecter certaines données personnelles ainsi que des
            données liées à l’activité sur le site web dans le cadre de
            l’utilisation du service et de l’extension Chrome.
          </p>

          <p>Ces données incluent notamment :</p>

          <ul>
            <li>Un pseudonyme (fourni par l’utilisateur)</li>
            <li>Une adresse email (dans le cadre de la création de compte)</li>
            <li>
              L’âge (requis afin de vérifier que l’utilisateur respecte l’âge
              minimum d’utilisation du service)
            </li>
            <li>Le sexe (facultatif)</li>
            <li>
              Les contributions publiées (signalements, suggestions, votes,
              commentaires)
            </li>
          </ul>

          <p>
            <strong>
              Dans le cadre de l’extension Chrome, les données suivantes peuvent
              être collectées uniquement lorsque l’utilisateur interagit avec
              l’extension :
            </strong>
          </p>

          <ul>
            <li>L’URL du site web sur lequel un signalement est effectué</li>
            <li>
              Les interactions utilisateur (clics liés au signalement,
              confirmations)
            </li>
            <li>Le contenu des signalements soumis volontairement</li>
            <li>
              Les captures d’écran ajoutées volontairement par l’utilisateur
            </li>
            <li>
              Les enregistrements vocaux (uniquement si l’utilisateur utilise la
              dictée vocale)
            </li>
          </ul>

          <p>
            Ces données ne sont collectées que lorsque l’utilisateur effectue
            une action explicite dans l’extension ou sur la plateforme.
          </p>
        </section>

        <section>
          <h2>3. Utilisation des données</h2>
          <p>Les données collectées sont utilisées uniquement pour :</p>

          <ul>
            <li>
              Permettre aux utilisateurs de signaler des problèmes et partager
              des suggestions
            </li>
            <li>Améliorer l’expérience utilisateur</li>
            <li>Regrouper et analyser les signalements</li>
            <li>Fournir des solutions pertinentes aux problèmes rencontrés</li>
            <li>Assurer le bon fonctionnement du service</li>
          </ul>

          <p>
            Les analyses sont réalisées à partir de données agrégées lorsque
            cela est possible.
          </p>
        </section>

        <section>
          <h2>4. Permissions du navigateur</h2>
          <p>
            L’extension Usearly utilise uniquement les autorisations nécessaires
            à son fonctionnement :
          </p>

          <ul>
            <li>
              activeTab : pour interagir avec la page active lorsque
              l’utilisateur déclenche une action
            </li>
            <li>
              scripting : pour injecter l’interface Usearly sur la page active
            </li>
            <li>
              tabs : pour identifier l’URL du site concerné par un signalement
            </li>
            <li>
              storage : pour stocker les préférences utilisateur localement
            </li>
            <li>
              contextMenus : pour ajouter des options de signalement accessibles
              rapidement
            </li>
          </ul>

          <p>
            Ces autorisations sont utilisées uniquement lorsque l’utilisateur
            interagit avec l’extension et jamais en arrière-plan sans action de
            sa part.
          </p>
        </section>

        <section>
          <h2>5. Partage des données</h2>
          <p>
            Usearly ne vend ni ne loue les données des utilisateurs. Certaines
            données peuvent être traitées par des prestataires techniques
            (hébergement, infrastructure serveur, cloud) uniquement dans le
            cadre du fonctionnement du service.
          </p>
        </section>

        <section>
          <h2>6. Transmission et stockage des données</h2>

          <p>
            Les données collectées via l’extension et la plateforme Usearly sont
            transmises de manière sécurisée aux serveurs de Usearly afin de
            permettre le traitement, l’analyse et l’association des signalements
            effectués par les utilisateurs.
          </p>

          <p>
            Ces données sont stockées sur des serveurs sécurisés et ne sont
            accessibles qu’aux systèmes nécessaires au fonctionnement de la
            plateforme.
          </p>

          <p>
            Certaines données peuvent être traitées par des prestataires
            techniques (hébergement cloud, infrastructure serveur) uniquement
            dans le cadre du fonctionnement du service.
          </p>
        </section>

        <section>
          <h2>7. Données techniques</h2>

          <p>
            Afin d’assurer la sécurité et le bon fonctionnement du service,
            certaines données techniques peuvent être collectées :
          </p>

          <ul>
            <li>Adresse IP</li>
            <li>Journaux de connexion</li>
            <li>Informations liées au navigateur ou à l’appareil</li>
          </ul>

          <p>Ces données sont utilisées uniquement pour :</p>

          <ul>
            <li>Sécuriser le service</li>
            <li>Prévenir les abus</li>
            <li>Assurer la stabilité technique</li>
          </ul>

          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour
            protéger les données des utilisateurs contre tout accès non
            autorisé, modification ou divulgation.
          </p>
        </section>

        <section>
          <h2>8. Conservation des données</h2>
          <p>
            Les données sont conservées uniquement pendant la durée nécessaire
            au fonctionnement du service et supprimées lorsqu’elles ne sont plus
            utiles.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>Pour toute question relative à la confidentialité :</p>
          <p className="legal-contact">📩 support@usearly.com</p>
        </section>

        <section>
          <h2>10. Transparence</h2>
          <p>
            Usearly s’engage à une transparence totale concernant l’utilisation
            des données. Aucune donnée n’est collectée à l’insu de l’utilisateur
            et toutes les actions impliquant des données nécessitent une
            interaction explicite.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
