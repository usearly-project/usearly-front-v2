import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "**/*.scss"],
  },
  {
    // --- 🌍 CONFIGURATION GLOBALE ---
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // ✅ hooks : on garde les règles de base
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",

      // ✅ formatter avec Prettier
      "prettier/prettier": "error",

      // ✅ variables inutilisées
      "@typescript-eslint/no-unused-vars": ["error"],

      // ❌ on désactive le blocage sur any
      "@typescript-eslint/no-explicit-any": "off",

      // --- 📏 RÈGLES DE MAINTENABILITÉ (MODIFIÉES EN WARN POUR LE PUSH) ---

      // Alerte si un fichier dépasse 300 lignes (Passé en "warn" pour ne pas bloquer les collègues)
      "max-lines": [
        "warn",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Alerte si une fonction dépasse 100 lignes
      "max-lines-per-function": [
        "warn",
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Empêche les fonctions trop complexes
      complexity: ["warn", 12],
    },
  },
  {
    // --- 🎯 EXCEPTIONS POUR LES FICHIERS DE DATA ET CONSTANTES ---
    files: [
      "**/*Config.ts",
      "**/*Brands.ts",
      "**/constants/*.ts",
      "**/data/*.ts",
      "**/types.ts",
    ],
    rules: {
      "max-lines": "off",
      "max-lines-per-function": "off",
      complexity: "off",
    },
  },
);
