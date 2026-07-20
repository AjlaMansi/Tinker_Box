# Tinker_Box — starter kit

A tiny game portal you own completely: a homepage (the "corkboard") that links out
to individual games (the "patches"). No backend, no build tools, no cost.

```
game-site/
├── index.html              ← the homepage / game menu
├── assets/
│   └── style.css            ← shared portal styling
└── games/
    └── yarn-snake/
        ├── index.html        ← the game page
        ├── style.css         ← game-specific styling
        └── game.js            ← game logic
```

## 1. Try it locally first

You don't need a server to test it — just open `index.html` in a browser
(double-click it, or drag it into a Chrome tab). Everything runs client-side.

If you want it to behave exactly like it will online (some browsers restrict
local file access a little), you can also run a tiny local server from
inside the `game-site` folder:

```bash
# if you have Python installed:
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 2. Put it on GitHub

1. Create a free GitHub account at github.com if you don't have one.
2. Create a new repository — name it whatever you like, e.g. `tinker-box`.
   Keep it public (required for free GitHub Pages).
3. On your computer, open a terminal inside this `game-site` folder and run:

```bash
git init
git add .
git commit -m "first patch: yarn snake"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tinker-box.git
git push -u origin main
```

(No git installed? You can also just drag-and-drop all the files into the
GitHub repo page in your browser — "Add file" → "Upload files".)

## 3. Turn on GitHub Pages

1. In your repo on GitHub, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and folder to `/ (root)`. Save.
4. Wait ~1 minute. Your site will be live at:
   `https://YOUR-USERNAME.github.io/tinker-box/`

Every time you `git push` new changes, the live site updates automatically
in about a minute. That's your whole deployment pipeline — free, forever,
no server to maintain.

## 4. Adding your next game

1. Make a new folder under `games/`, e.g. `games/my-new-game/`.
2. Give it its own `index.html`, `style.css`, `game.js` (copy yarn-snake's
   files as a starting template if that helps).
3. Add a new `<a class="patch">` card in the root `index.html` pointing at
   `games/my-new-game/index.html`.
4. Commit and push. Done — it shows up on the board.

## Notes on the current game

Yarn Snake is a reskinned classic snake: arrow keys / WASD on desktop,
on-screen pad or swipe on mobile. Score and best score are saved in the
browser's `localStorage`, so they persist per-visitor but aren't shared
across devices or people (that would need a real backend + database later,
which you can add down the line if you ever want leaderboards).
