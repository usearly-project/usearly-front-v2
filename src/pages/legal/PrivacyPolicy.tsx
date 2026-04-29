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
            Usearly ne vend, ne partage, ne transfère ni ne loue les données des
            utilisateurs. Certaines données peuvent être traitées par des
            prestataires techniques (hébergement, infrastructure serveur, cloud)
            uniquement dans le cadre du fonctionnement du service.
          </p>
        </section>

        <section>
          <h2>6. Transmission et stockage des données</h2>

          <p>
            Les données collectées via l’extension et la plateforme Usearly sont
            transmises de manière sécurisée aux serveurs de Usearly afin de
            permettre leur traitement, leur analyse, leur stockage et leur
            association aux signalements effectués par les utilisateurs.
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
            Afin d’assurer le bon fonctionnement du service et d’améliorer la
            qualité des signalements, certaines données techniques peuvent être
            utilisées :
          </p>

          <ul>
            <li>
              Informations liées au navigateur utilisé (ex : Chrome, Firefox)
            </li>
            <li>Informations techniques liées à l’appareil</li>
            <li>
              Journaux techniques nécessaires au fonctionnement du service
            </li>
          </ul>

          <p>Ces données sont utilisées uniquement pour :</p>

          <ul>
            <li>Assurer la stabilité technique du service</li>
            <li>
              Améliorer la qualité des signalements (ex : identifier un problème
              spécifique à un navigateur)
            </li>
            <li>Prévenir les dysfonctionnements techniques</li>
          </ul>

          <p>
            Ces données ne sont pas utilisées à des fins de suivi, de profilage
            ou de publicité.
          </p>

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
        <section>
          <h2>11. Accès au contenu des pages web</h2>

          <p>
            Dans le cadre du fonctionnement de l’extension Usearly, certaines
            données issues de la page web active peuvent être temporairement
            utilisées, uniquement lorsque l’utilisateur déclenche une action.
          </p>

          <ul>
            <li>
              Le contenu visible de la page (texte, structure) peut être utilisé
              uniquement pour contextualiser un signalement
            </li>
            <li>
              Les captures d’écran peuvent contenir des éléments visuels de la
              page (images, texte) uniquement lorsque l’utilisateur choisit de
              capturer une zone
            </li>
          </ul>

          <p>
            Ces données ne sont jamais collectées en continu, ni analysées en
            arrière-plan. Elles sont utilisées uniquement dans le cadre de
            l’action initiée par l’utilisateur.
          </p>

          <p>
            Aucune analyse automatique, aucun tracking, ni surveillance du
            contenu de navigation n’est effectué par l’extension.
          </p>
        </section>
        <section>
          <h2>12. Extension Usearly – Traitement des données</h2>

          <p>
            L’extension Chrome Usearly collecte et traite des données uniquement
            afin de fournir ses fonctionnalités principales.
          </p>

          <h3>Collecte des données</h3>
          <p>
            Les données sont collectées uniquement lorsque l’utilisateur
            interagit avec l’extension (ex : ouverture du menu, envoi d’un
            signalement, capture d’écran).
          </p>

          <h3>Captures d’écran</h3>
          <p>
            Les captures d’écran sont entièrement optionnelles et réalisées
            uniquement à la demande explicite de l’utilisateur, s’il souhaite
            illustrer ou préciser un signalement.
          </p>

          <p>
            Ces captures peuvent contenir des éléments du contenu de la page web
            (texte, images) uniquement dans le cadre de l’action déclenchée par
            l’utilisateur.
          </p>

          <p>
            Aucune capture en arrière-plan, aucun enregistrement automatique ni
            aucune surveillance continue n’est effectué par l’extension.
          </p>
          <h3>Utilisation des données</h3>
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul>
            <li>Permettre les signalements et interactions</li>
            <li>Améliorer l’expérience utilisateur</li>
            <li>Assurer le bon fonctionnement du service</li>
          </ul>

          <h3>Partage des données</h3>
          <p>
            Usearly ne vend pas, ne partage pas, ne transfère pas et ne loue pas
            les données des utilisateurs à des tiers à des fins commerciales ou
            publicitaires.
          </p>

          <h3>Données techniques</h3>
          <p>
            Les données techniques (comme les journaux techniques ou les
            informations liées au navigateur) sont utilisées uniquement pour des
            raisons de sécurité, de prévention des abus et de stabilité du
            service. Elles ne sont pas utilisées à des fins de suivi, de
            profilage ou de publicité.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
