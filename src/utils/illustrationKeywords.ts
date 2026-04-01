export const CATEGORY_MAPPING: Record<
  string,
  { high: string[]; low: string[] }
> = {
  bancaire: {
    high: [
      "banque",
      "virement",
      "compte",
      "coffre",
      "argent",
      "investissement",
      "épargne",
    ],
    low: [
      "carte",
      "crédit",
      "paiement",
      "reçu",
      "reçus",
      "points",
      "économie",
      "frais",
    ],
  },
  tv_cinema: {
    high: ["cinéma", "film", "série", "netflix", "popcorn", "clap"],
    low: ["vidéo", "télé", "regarder", "canapé", "écran"],
  },
  culture_musique: {
    high: ["musique", "concert", "album", "artiste", "rock", "festival"],
    low: [
      "chanson",
      "casque",
      "livre",
      "lecture",
      "écouter",
      "ticket",
      "billet",
    ],
  },
  ecommerce: {
    high: ["commande", "achat", "panier", "caddie", "shopping", "colis"],
    low: [
      "magasin",
      "vêtement",
      "vêtements",
      "mode",
      "taille",
      "stock",
      "prix",
      "sac",
    ],
  },
  food_drink: {
    high: ["restaurant", "burger", "cocktail", "smoothie", "café", "brasserie"],
    low: [
      "repas",
      "manger",
      "boire",
      "faim",
      "soif",
      "glace",
      "ice",
      "livraison",
    ],
  },
  hotelerie_immobilier: {
    high: ["hôtel", "chambre", "logement", "maison", "nuit", "résidence"],
    low: ["clé", "clef", "location", "lit", "porte"],
  },
  voyage_transport: {
    high: ["avion", "vol", "train", "valise", "vacances", "trajet"],
    low: ["itinéraire", "transport", "gare", "chemin", "réservation", "billet"],
  },
  sport: {
    high: [
      "sport",
      "match",
      "podium",
      "maillot",
      "entraînement",
      "foot",
      "basket",
    ],
    low: ["course", "cible", "sac", "ballon", "chaussure", "sneaker"],
  },
  general: {
    high: [
      "interface",
      "design",
      "animation",
      "rapidité",
      "performance",
      "top",
      "génial",
    ],
    low: [
      "durable",
      "like",
      "coeur",
      "love",
      "bravo",
      "rire",
      "message",
      "appli",
      "site",
    ],
  },
};

export const CATEGORY_IMAGES: Record<string, string> = {
  bancaire: "cartecredit.svg",
  tv_cinema: "clapcinema.svg",
  culture_musique: "notemusique.svg",
  ecommerce: "caddie.svg",
  food_drink: "burger.svg",
  hotelerie_immobilier: "lit.svg",
  voyage_transport: "avion.svg",
  sport: "maillot.svg",
  general: "coeurdoigt.svg",
};

export const GENERAL_POOL = [
  "applaudissement.svg",
  "coeurdoigt.svg",
  "coeurlike.svg",
  "emojifacelove.svg",
  "flechecoeur.svg",
  "messageaime.svg",
  "messagelike.svg",
  "ordilike.svg",
  "pouceenlair.svg",
  "screenordilike.svg",
  "telephonelike.svg",
];
