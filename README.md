# Botany Identifier

A single-page Science Olympiad Botany practice tool. It shows a specimen image, you type what it is, and it shows the plant group, monocot/dicot, leaf venation, root system, floral pattern, and key ID features. It tracks score and streak, and offers "retry missed" at the end of a round.

Specimens are in `src/data/plants.js`. Images come from Wikimedia Commons, with credits in `src/data/plantImages.js`.

## Develop

```sh
npm install
npm run dev   # http://localhost:5180
```

## Deploy to GitHub Pages

Push to `main`, then go to repo **Settings → Pages → Source** and choose **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and publishes the site to `https://<user>.github.io/<repo>/`.
