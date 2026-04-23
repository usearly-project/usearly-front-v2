import type { PlanetPopFeedBrandConfig } from "./types";

export const POP_FEED_BRANDS = [
  // Exemple de configuration pour une marque, à dupliquer et adapter pour les autres marques
  // {
  //   id: "boursorama",
  //   label: "Boursorama",
  //   image: "/assets/brandLogo/bourso.png",
  //   copy: {
  //     report: "La connexion saute parfois.",
  //     reportLinked: "Même friction ici, j'ai dû relancer l'app.",
  //     suggestion: [
  //       "J'aimerais qu'il y ait un solde plus synthétique.",
  //       "Ce serait bien que les dépenses du mois soient mieux résumées.",
  //       "Ce serait top que les infos clés soient plus mises en avant.",
  //     ],
  //     coupDeCoeur: [
  //       "J'adore la vue des comptes.",
  //       "J'aime la lisibilité du tableau de bord.",
  //       "Trop bien, les comptes sont faciles à parcourir.",
  //     ],
  //   },
  // },
  {
    id: "instagram",
    label: "Instagram",
    image: "/assets/brandLogo/instagram.png",
    copy: {
      report: "Je peux pas recevoir mes messages...",
      reportLinked: "Moi aussi j’ai le même problème !",
    },
  },
  {
    id: "Vinted",
    label: "Vinted",
    image: "/assets/brandLogo/vinted.png",
    copy: {
      report: "Colis marqué livré mais non reçu.",
      reportLinked: "J'ai eu la même chose.",
    },
  },
  {
    id: "CanalPlus",
    label: "Canal+",
    image: "/assets/brandLogo/canal.png",
    copy: {
      report: "Impossible de finaliser mon abonnement Canal+.",
      reportLinked: "J'ai un problème dans le formulaire.",
    },
  },
  {
    id: "spotify",
    label: "Spotify",
    image: "/assets/brandLogo/spotify.png",
    copy: {
      coupDeCoeur: [
        "J’adore les playlists personnalisées, elles sont vraiment bien faites.",
      ],
    },
  },
  {
    id: "Revolut",
    label: "Revolut",
    image: "/assets/brandLogo/revolut.png",
    copy: {
      coupDeCoeur: ["Application claire et facile à utiliser."],
    },
  },
  {
    id: "TooGoodToGo",
    label: "Too Good To Go",
    image: "/assets/brandLogo/toogoodtogo.png",
    copy: {
      coupDeCoeur: [
        "Trop bien de faire des économies et éviter le gaspillage.",
      ],
    },
  },
  {
    id: "Sncf",
    label: "Sncf",
    image: "/assets/brandLogo/sncf.png",
    copy: {
      suggestion: ["J’aimerais être informé en temps réel des retards."],
    },
  },
  {
    id: "ubereats",
    label: "Uber Eats",
    image: "/assets/brandLogo/uberEats.png",
    copy: {
      suggestion: [
        "J’aimerais une estimation plus précise du temps de livraison...",
      ],
    },
  },
  {
    id: "Amazon",
    label: "Amazon",
    image: "/assets/brandLogo/amazon.png",
    copy: {
      suggestion: ["J'aurais aimé choisir le jour précis de la livraison."],
    },
  },
] as const satisfies readonly PlanetPopFeedBrandConfig[];
