export const SUGGEST_CATEGORY_MAPPING: Record<
  string,
  { high: string[]; low: string[] }
> = {
  ecommerce: {
    high: [
      "commande",
      "achat",
      "panier",
      "caddie",
      "produit",
      "taille",
      "photo",
      "modèle",
      "mesure",
      "mesures",
      "personnalisation",
    ],
    low: [
      "validation",
      "collection",
      "vetements",
      "vêtements",
      "sac",
      "colis",
      "livraison",
      "date",
      "stock",
      "prix",
    ],
  },
  bancaire: {
    high: [
      "banque",
      "carte",
      "crédit",
      "virement",
      "coffre",
      "compte",
      "iban",
      "rib",
    ],
    low: [
      "paiement",
      "argent",
      "points",
      "économie",
      "reçu",
      "facture",
      "frais",
    ],
  },
  culture_musique: {
    high: ["concert", "star", "musique", "vinyle", "artiste", "album"],
    low: ["billet", "ticket", "chanson", "écoute", "rock", "célébrité"],
  },
  food_drink: {
    high: ["restaurant", "burger", "cocktail", "café", "coffee", "boisson"],
    low: [
      "menu",
      "repas",
      "manger",
      "boire",
      "faim",
      "soif",
      "livraison",
      "glace",
    ],
  },
  tv_cinema: {
    high: ["cinéma", "film", "série", "netflix", "popcorn", "clap"],
    low: ["canapé", "séance", "télé", "regarder", "vidéo"],
  },
  hotelerie_immobilier: {
    high: ["hôtel", "chambre", "logement", "maison", "nuit"],
    low: ["porte", "location", "panneau", "clef", "clé"],
  },
  voyage_transport: {
    high: ["avion", "vol", "train", "valise", "vacances", "réservation"],
    low: ["trajet", "itinéraire", "gare", "chemin", "transport", "billet"],
  },
  sport: {
    high: ["sport", "basket", "foot", "football", "match", "podium"],
    low: ["sneaker", "chaussure", "course", "cible", "basketball", "ballon"],
  },
  sante: {
    high: ["santé", "médical", "soins", "docteur", "hôpital"],
    low: ["coeur", "heart"],
  },
  general: {
    high: [
      "idée",
      "proposer",
      "nouveau",
      "changer",
      "ajouter",
      "pourquoi pas",
      "amélioration",
      "serait bien",
    ],
    low: ["durable", "belle", "magie", "plus", "moins"],
  },
};

export const SUGGEST_CATEGORY_IMAGES: Record<string, string> = {
  bancaire: "cartecredit.svg",
  culture_musique: "star.svg",
  ecommerce: "caddie.svg",
  food_drink: "coffee.svg",
  tv_cinema: "clapcinema.svg",
  hotelerie_immobilier: "panneauporte.svg",
  voyage_transport: "valise.svg",
  sport: "podium.svg",
  sante: "heart.svg",
  general: "emojiteteetoile.svg",
};

export const SUGGEST_GENERAL_POOL = [
  "baguettemagie.svg",
  "defaut.svg",
  "emojietoile.svg",
  "emojiteteetoile.svg",
  "vote.svg",
];
