# ACM VITRERIE — prototype de site vitrine

Démo **statique** réalisée pour **ACM VITRERIE** (enseigne « ACM VITRERIE – BATIVERRE »),
vitrerie / miroiterie à Villeurbanne (69100).

## Ouvrir la démo

Double-cliquez sur `index.html` : le site fonctionne **hors ligne**, sans serveur, sans installation.
Aucune requête réseau, aucune police externe, aucune image distante.

## Structure

```
acm-vitrerie-demo/
├─ index.html                  page unique (toutes les sections)
├─ assets/
│  ├─ css/styles.css           design system + composants (polices intégrées en base64)
│  ├─ fonts/                   (dossier vide : polices en base64 dans styles.css)
│  ├─ js/main.js               animations, filtres, accordéon, formulaire
│  └─ img/favicon.svg          logo (SVG)
├─ preview-email-hero.png      ← pièce jointe e-mail · 1200 × 927 px · 328 Ko
├─ preview-email-mobile.png    ← pièce jointe e-mail · 390 × 1 447 px · 194 Ko
├─ preview-email-full.png      ← pièce jointe e-mail · 1200 × 11 648 px · 1 138 Ko
├─ preview-desktop-fullres.png rendu plein format 1440 px (archive, 3,1 Mo)
├─ preview-mobile-fullres.png  rendu plein format 390 px (archive, 2,1 Mo)
├─ preview-hero-fullres.png    rendu plein format 1440 px (archive, 726 Ko)
└─ README.md
```

## Sections

1. En-tête collant + menu mobile + appel en un clic
2. Bandeau d'accueil (verre, lumière, reflets) + marqueurs de confiance
3. Chiffres clés (données registre uniquement)
4. Prestations (8 cartes, icônes SVG inline, halo suivant le curseur)
5. Réalisations (galerie filtrable + comparateur avant / après)
6. Zone d'intervention (pastilles cliquables + carte stylisée)
7. Méthode en 5 étapes
8. Formulaire de devis (validation front-end, confirmation)
9. Témoignages (12 avis Google réels — mosaïque 3 colonnes, 1 colonne sur mobile)
10. Questions fréquentes (accordéon)
11. Bandeau d'appel à l'action + pied de page complet + mentions légales

## Données réelles utilisées

Registre national des entreprises (INSEE, API `recherche-entreprises.api.gouv.fr`, SIREN 808 431 985,
re-contrôlé le 24/11/2026) :

| Élément | Valeur |
|---|---|
| Raison sociale | ACM VITRERIE |
| Enseigne | ACM VITRERIE – BATIVERRE |
| Nom commercial | ACM VITRERIE – GENAS VITRERIE – ARTIVERRE |
| SIREN | 808 431 985 |
| SIRET (siège) | 808 431 985 00015 |
| SIRET (2ᵉ établissement) | 808 431 985 00023 — **fermé au 01/06/2023** |
| Code NAF / APE | 43.34Z (4334ZA) — Travaux de vitrerie et de miroiterie |
| Forme juridique | SAS (code 5710) |
| Dirigeant | Jérôme Alain Gabriel Chamaux — Président de SAS |
| Effectif | tranche 01 (1 à 2 salariés) |
| Création | 03/12/2014 — début d'activité 01/06/2023 |
| Siège | 40 rue Mal Foch, 69100 Villeurbanne |
| 2ᵉ établissement | 12 B rue Louis Maynard, 69100 Villeurbanne (fermé au 01/06/2023) — **adresse volontairement non affichée sur la page** |
| Téléphone | 09 86 25 98 64 |
| E-mail | acmvitrerie@gmail.com |
| TVA | FR20808431985 |
| RGE | non (aucune qualification RGE au registre) |

**Nuance importante :** l'enseigne et les noms commerciaux ci-dessus sont enregistrés au registre sur le
**2ᵉ établissement (fermé au 01/06/2023)** ; le siège (40 rue Mal Foch) ne porte aucune enseigne propre.
Le registre ne publie **aucune zone d'intervention**, **aucun horaire**, **aucun avis client**,
**aucune certification** et **aucune garantie** : ces informations n'apparaissent donc pas sur la page
sous forme d'affirmation, seulement sous forme d'emplacement à compléter.

**Les avis clients, eux, sont publics et vérifiables :** ils proviennent de la fiche Google de l'atelier
(« ACM VITRERIE — Vitrerie · miroiterie », 40 rue Mal Foch, 69100 Villeurbanne), relevée le 24/11/2026.
Note agrégée affichée par Google : **5,0/5 · 15 avis**. Les 12 avis publiés ci-dessous sont transcrits
verbatim (auteur, note, date relative, texte), orthographe et fautes d'origine conservées ; la mention
de Google « Les avis ne sont pas vérifiés » est reproduite sur la page, ainsi que le compteur exact
(12 avis affichés sur 15). Les 3 avis restants de la fiche ne sont pas affichés.

## À remplacer avant mise en ligne

Tous les points à/personnaliser sont signalés dans le code par le mot-clé **`PLACEHOLDER`**
(28 occurrences) :

- `index.html` — horaires d'ouverture, zone d'intervention, liste des prestations, délais annoncés,
  références normatives (NF EN 12150 / 12600), visuels de la galerie, capital social,
  hébergeur, branchement du formulaire sur la messagerie ou le CRM.
- Le formulaire n'envoie rien : il affiche une confirmation. Le brancher sur le traitement
  de devis du client.
- Les compositions graphiques de la galerie et de la carte sont des illustrations vectorielles,
  pas des photos de chantiers.
- Les avis affichés ne sont pas des maquettes : ce sont les **12 avis réellement publiés sur la fiche
  Google** de l'atelier (5,0/5 · 15 avis), transcrits verbatim. Les 3 avis restants de la fiche
  ne sont pas affichés ; ne jamais ajouter d'avis non réel.
- Les marqueurs de confiance du bandeau d'accueil et la liste des communes sont des **emplacements** :
  les valider avec le dirigeant avant toute publication.

## Contrôle qualité (24/11/2026, Chrome headless, page chargée en `file://`)

| Contrôle | Résultat |
|---|---|
| Erreurs JavaScript (console + page) | 0 |
| Requêtes réseau échouées | 0 |
| Requêtes externes (hors `file:` / `data:`) | 0 — site 100 % hors ligne |
| Débordement horizontal (320 / 768 / 1440 px) | aucun |
| Filtres de la galerie | OK (vitrine 2, garde-corps 1, sur-mesure 2, douche 1, tous 6) |
| Accordéon FAQ | OK (ouverture 120 px, fermeture, `aria-expanded` à jour) |
| Formulaire de devis | OK (6 champs invalides bloquent l'envoi ; confirmation `ACMV-XXXX` ; remise à zéro) |
| Menu mobile | OK (ouverture, fermeture par lien / burger / `Échap`) |
| `<title>` / meta description | 59 / 171 caractères, + balises `og:` |
| Section « Avis clients » | 12 cartes rendues, 0 masquée, 0 texte tronqué (320 / 768 / 1440 px) |
| Note agrégée affichée | 5,0/5 · 15 avis sur Google + mention « Les avis ne sont pas vérifiés » |
| Favicon | `assets/img/favicon.svg` chargée (888 octets) |
| Mentions légales | bloc présent : ACM VITRERIE, SIREN, SIRET, NAF, TVA, dirigeant, enseignes |
| Poids total de la page | 423 688 octets (~414 Ko) |

**Polices :** Archivo + Inter variables, 4 `@font-face` en woff2, encodées en base64 dans `styles.css`
→ 267 820 caractères de base64, soit **200 865 octets (~196 Ko) de polices pour 310 820 octets de CSS
(64,6 % du fichier)**. Le site étant 100 % hors ligne et destiné à un envoi par e-mail ou une mise en ligne
en une seule page, l'auto-hébergement reste le bon choix : il supprime toute requête vers un CDN et donc
tout risque de page « nue » hors connexion. En revanche, si le site passe sur un hébergement classique avec
un vrai `<link>` vers des `.woff2`, ce poids peut être déplacé dans des fichiers séparés (cache HTTP,
chargement non bloquant) **sans changer le rendu**.

## Accessibilité

- Responsive 320 / 390 / 768 / 1440 px, sans débordement horizontal.
- `prefers-reduced-motion` respecté (animations désactivées).
- Navigation clavier, `aria-expanded`, `aria-live`, lien d'évitement.
- Contrastes conformes AA sur les textes courants.

---

*Prototype de démonstration — les informations réelles proviennent du registre public des entreprises.*
