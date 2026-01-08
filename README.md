# Application Web de Conseils (FR)

Application monopage qui affiche des conseils **uniquement en français** et permet de donner un avis (**Utile** / **Pas utile**) avec un message de confirmation. Aucun backend.

## Utilisation

- Selon la plateforme, le dossier servi peut être `public/`.
  - En local: ouvrez `index.html` (ou `french/index.html`)
  - En déploiement “statique”: utilisez `public/index.html` (ou `public/french/index.html`)
- Ou lancez un serveur local (optionnel) :
- Lancez un serveur local (optionnel) :

```bash
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Fichiers

- `index.html` : structure de la page
- `styles.css` : styles (design doux + transitions)
- `script.js` : logique (tirage aléatoire, feedback, confirmation)
- `french/` : copie du site si votre hébergement attend un sous-dossier

