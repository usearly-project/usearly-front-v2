import type { PlanetPopFeedBrandConfig } from "./types";

export const POP_FEED_BRANDS = [
  {
    id: "nike",
    label: "Nike",
    image: "/assets/brandLogo/nike.png",
    copy: {
      report: "Le choix de taille bugue souvent.",
      reportLinked: "Même souci ici, le sélecteur m'a bloqué aussi.",
      suggestion: [
        "Ce serait bien qu'il y ait un guide de tailles plus visuel.",
        "J'aimerais que les différences entre les coupes soient mieux affichées.",
        "Ce serait top qu'il y ait un vrai comparateur de tailles.",
      ],
      coupDeCoeur: [
        "J'aime les visuels produit.",
        "J'adore quand les détails des sneakers sont bien montrés.",
        "Trop bien, les pages produit donnent envie.",
      ],
    },
  },
  {
    id: "boursorama",
    label: "Boursorama",
    image: "/assets/brandLogo/bourso.png",
    copy: {
      report: "La connexion saute parfois.",
      reportLinked: "Même friction ici, j'ai dû relancer l'app.",
      suggestion: [
        "J'aimerais qu'il y ait un solde plus synthétique.",
        "Ce serait bien que les dépenses du mois soient mieux résumées.",
        "Ce serait top que les infos clés soient plus mises en avant.",
      ],
      coupDeCoeur: [
        "J'adore la vue des comptes.",
        "J'aime la lisibilité du tableau de bord.",
        "Trop bien, les comptes sont faciles à parcourir.",
      ],
    },
  },
  {
    id: "airbnb",
    label: "Airbnb",
    image: "/assets/brandLogo/airbnd.png",
    copy: {
      report: "Les frais arrivent trop tard.",
      reportLinked: "Même ressenti ici, le total change trop tard.",
      suggestion: [
        "Ce serait top que les logements soient mieux comparés.",
        "J'aimerais que les frais soient visibles plus tôt.",
        "Ce serait bien que la comparaison entre plusieurs annonces soit plus simple.",
      ],
      coupDeCoeur: [
        "Trop bien, les filtres rassurent vite.",
        "J'aime la clarté des cartes.",
        "J'adore la façon dont on peut vite se projeter.",
      ],
    },
  },
  {
    id: "leboncoin",
    label: "leboncoin",
    image: "/assets/brandLogo/lbo.png",
    copy: {
      report: "La messagerie se désynchronise.",
      reportLinked: "Même bug ici, mes messages n'arrivent pas.",
      suggestion: [
        "J'aimerais qu'il y ait un historique de recherche.",
        "Ce serait bien que les filtres utilisés soient mieux mémorisés.",
        "Ce serait top qu'il y ait plus d'alertes personnalisées.",
      ],
      coupDeCoeur: [
        "J'aime que les fiches aillent droit au but.",
        "J'adore le côté direct des annonces.",
        "Trop bien, ça va à l'essentiel sans détour.",
      ],
    },
  },
  {
    id: "duolingo",
    label: "Duolingo",
    image: "/assets/brandLogo/duo.png",
    copy: {
      report: "Les rappels reviennent trop souvent.",
      reportLinked: "Même souci, les notifs repartent seules.",
      suggestion: [
        "Ce serait bien qu'ils proposent plus de révision ciblée.",
        "J'aimerais choisir les rappels plus finement.",
        "Ce serait top de mieux adapter les exercices aux erreurs.",
      ],
      coupDeCoeur: [
        "J'adore la progression.",
        "J'aime la sensation d'avancer vite.",
        "Trop bien, il me motive à revenir chaque jour.",
      ],
    },
  },
  {
    id: "instagram",
    label: "Instagram",
    image: "/assets/brandLogo/instagram.png",
    copy: {
      report: "Je peux pas recevoir mes messages...",
      reportLinked: "Moi aussi j’ai le même problème !",
      suggestion: [
        "J'aimerais que les DM non lus soient triés.",
        "Ce serait bien que le rangement des messages soit amélioré.",
        "Ce serait top que les conversations importantes soient mieux séparées.",
      ],
      coupDeCoeur: [
        "Trop bien, les transitions sont hyper fluides.",
        "J'aime la nervosité de l'interface.",
        "J'adore la fluidité des interactions.",
      ],
    },
  },
  {
    id: "ubereats",
    label: "Uber Eats",
    image: "/assets/brandLogo/uberEats.png",
    copy: {
      report: "Le suivi livreur saute parfois.",
      reportLinked: "Même souci ici, le tracking décroche.",
      suggestion: [
        "J’aimerais une estimation plus précise du temps de livraison...",
        "Ce serait top que les délais soient filtrés plus finement.",
        "Ce serait bien que les frais soient plus lisibles avant le panier.",
      ],
      coupDeCoeur: [
        "J'aime que le panier soit super lisible.",
        "J'adore la clarté du parcours de commande.",
        "Trop bien, ça va vite à l'essentiel.",
      ],
    },
  },
  {
    id: "spotify",
    label: "Spotify",
    image: "/assets/brandLogo/spotify.png",
    copy: {
      report: "La lecture change parfois d'appareil.",
      reportLinked: "Même bug ici, ça reprend sur le mauvais appareil.",
      suggestion: [
        "J'aimerais que les playlists soient triées par humeur.",
        "Ce serait bien que ça filtre mieux selon le moment de la journée.",
        "Ce serait top que les recommandations soient davantage expliquées.",
      ],
      coupDeCoeur: [
        "J'adore quand les recos tombent juste.",
        "J'aime la sensation de découverte.",
        "Trop bien, l'ambiance recherchée est souvent bien comprise.",
        "J’adore les playlists personnalisées, elles sont vraiment bien faites.",
      ],
    },
  },
  {
    id: "netflix",
    label: "Netflix",
    image: "/assets/brandLogo/netflix.png",
    copy: {
      report: "La reprise d'épisode saute parfois.",
      reportLinked: "Même souci ici, la lecture repart mal parfois.",
      suggestion: [
        "Ce serait bien que ça filtre mieux selon la durée.",
        "J'aimerais que les formats courts et longs soient mieux distingués.",
        "Ce serait top qu'il y ait des suggestions plus rapides à choisir.",
      ],
      coupDeCoeur: [
        "J’adore la nouvelle fonctionnalité “Moments” !",
        "Trop bien, la home donne vite envie de lancer quelque chose.",
        "J'aime la façon dont les contenus sont mis en scène.",
        "J'adore quand on trouve vite quoi regarder.",
      ],
    },
  },
  {
    id: "Sncf",
    label: "Sncf",
    image: "/assets/brandLogo/sncf.png",
    copy: {
      report: "Je n'arrive pas à mettre mon abonnement dans l'app.",
      reportLinked: "Même souci ici !",
      suggestion: [
        "J’aimerais être informé en temps réel des retards.",
        "Ce serait bien d’avoir une meilleure estimation du temps réel d’arrivée.",
        "J’aimerais voir le niveau d’affluence dans les trains avant de monter.",
      ],
      coupDeCoeur: [
        "J’adore la facilité pour réserver un billet en quelques clics.",
        "L’app est pratique pour centraliser tous mes trajets.",
        "Trop bien de pouvoir ajouter ses billets directement dans le téléphone.",
        "J’aime la clarté des informations pour préparer un voyage.",
      ],
    },
  },
  {
    id: "Revolut",
    label: "Revolut",
    image: "/assets/brandLogo/revolut.png",
    copy: {
      report: "Certaines transactions n'apparaîssent pas dans l’historique.",
      reportLinked:
        "Même problème ici, les notifications ne sont pas toujours présente.",
      suggestion: [
        "J’aimerais avoir plus de contrôle sur les notifications en temps réel.",
        "Ce serait utile d’avoir une meilleure visibilité sur les frais à l’étranger.",
        "J’aimerais pouvoir catégoriser automatiquement mes dépenses de façon plus précise.",
      ],
      coupDeCoeur: [
        "J’adore la facilité pour envoyer de l’argent en quelques secondes.",
        "L’interface est vraiment fluide et agréable à utiliser.",
        "Trop pratique pour gérer ses dépenses à l’étranger sans prise de tête.",
        "J’aime bien les statistiques de dépenses, c’est super clair.",
      ],
    },
  },
  {
    id: "Amazon",
    label: "Amazon",
    image: "/assets/brandLogo/amazon.png",
    copy: {
      report: "Les délais de livraison ne sont pas toujours respectés.",
      reportLinked: "Pareil ! Ce n’est pas toujours clair ou précis.",
      suggestion: [
        "J’aimerais une estimation de livraison en temps réel.",
        "Ce serait utile d’avoir des avis plus filtrés pour éviter les faux commentaires.",
        "J’aimerais une meilleure organisation des résultats de recherche.",
      ],
      coupDeCoeur: [
        "J’adore la rapidité pour commander en quelques clics.",
        "Trop pratique de pouvoir tout trouver au même endroit.",
        "Le système de recommandation est vraiment efficace.",
        "J’aime la simplicité du suivi de commande.",
      ],
    },
  },
  {
    id: "Vinted",
    label: "Vinted",
    image: "/assets/brandLogo/vinted.png",
    copy: {
      report:
        "Certains vendeurs ne répondent pas ou mettent beaucoup trop de temps à expédier.",
      reportLinked: "La même chose.",
      suggestion: [
        "J’aimerais avoir des recommandations plus précises selon mes tailles et préférences.",
        "Ce serait utile d’avoir un système de vérification des articles plus poussé.",
        "J’aimerais mieux filtrer les résultats (état réel, taille, qualité).",
      ],
      coupDeCoeur: [
        "J’adore pouvoir vendre facilement des vêtements que je ne porte plus.",
        "Trop pratique pour trouver des pièces à petit prix.",
        "J’aime le côté éco-responsable de la plateforme.",
        "La messagerie entre acheteurs et vendeurs est simple et efficace.",
      ],
    },
  },
  {
    id: "CanalPlus",
    label: "Canal+",
    image: "/assets/brandLogo/canalplus.png",
    copy: {
      report: "La lecture plante parfois ou met du temps à se lancer.",
      reportLinked:
        "Même souci ici, la qualité vidéo s’adapte mal même avec une bonne connexion.",
      suggestion: [
        "J’aimerais avoir une meilleure reprise de lecture quand je change d’appareil.",
        "Ce serait bien d’avoir des recommandations plus personnalisées.",
        "J’aimerais une navigation plus fluide entre les catégories et les contenus.",
      ],
      coupDeCoeur: [
        "J’adore la qualité des contenus exclusifs proposés.",
        "Trop bien d’avoir du sport et des séries au même endroit.",
        "L’interface est globalement agréable et moderne.",
        "J’aime pouvoir télécharger les contenus pour les regarder hors ligne.",
      ],
    },
  },
  {
    id: "TooGoodToGo",
    label: "Too Good To Go",
    image: "/assets/brandLogo/toogoodtogo.png",
    copy: {
      report:
        "Les paniers sont parfois décevants par rapport à ce qui est annoncé.",
      reportLinked:
        "Même problème ici, le contenu des paniers est souvent imprévisible.",
      suggestion: [
        "J’aimerais avoir plus de détails sur le contenu des paniers avant de réserver.",
        "Ce serait bien d’avoir un système de notation plus précis des commerçants.",
        "J’aimerais pouvoir filtrer selon mes préférences alimentaires (végétarien, halal, etc.).",
      ],
      coupDeCoeur: [
        "J’adore le concept anti-gaspillage, c’est vraiment utile.",
        "Trop bien de pouvoir récupérer de la nourriture à petit prix.",
        "L’application est simple et rapide à utiliser.",
        "J’aime découvrir de nouveaux commerces près de chez moi.",
      ],
    },
  },
] as const satisfies readonly PlanetPopFeedBrandConfig[];
