# Event Identifier

Science Olympiad identification practice with two subjects, switched with the tabs at the top:

- **Botany – Identification Practice.** 101 plants, organs, cross-sections, and diseases. After each answer you see the plant group, monocot/dicot, venation, root system, floral pattern, and key features.
- **Rocks & Minerals – Identification Practice.** Every specimen on the 2027 national list (50 minerals + 24 rocks). After each answer you see the classification, composition, color, luster, hardness, streak, crystal form/texture, the key identifying property, and one detail to remember.

For each specimen you see an image, type what it is (small typos are OK), then study the answer card. The app tracks score and streak, and offers "retry missed" at the end of a round. Stats are saved in each person's browser.

Live site: https://coder-st.github.io/event_identifier/ (`#rocks` opens the Rocks & Minerals tab directly).

## Data

- Botany: `src/data/plants.js` (images and credits in `src/data/plantImages.js`)
- Rocks & minerals: `src/data/rocks.js` (images and credits in `src/data/rockImages.js`)

All images are CC-licensed or public-domain files from Wikimedia Commons, and each shows its author and license.

## Develop

```sh
npm install
npm run dev   # http://localhost:5180
```

## Deploy

Every push to `main` builds and publishes to GitHub Pages through `.github/workflows/deploy.yml`.
