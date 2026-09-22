# Netflix — The Story of Us

A private Netflix-inspired anniversary experience.

## Flow
1. `index.html` — cinematic Netflix intro
2. `pages/login.html` — sign in
3. `pages/profiles.html` — **Who's watching?** with Debo + Her profiles
4. `pages/home.html` — Netflix-style home
5. Story → cinematic cover video → main movie player
6. Our Song → dedicated music player

## Login
- Email: `her@email.com`
- Password: `ouranniversary2026`

## Hosted videos
The large videos are hosted on Viddler so GitHub/Netlify does not need to store hundreds of MB of MP4 files.

- Main story: `https://viddler.com/5hUoC3`
- Song: `https://viddler.com/Nqz7zZ`

The site embeds these players responsively and keeps only the lightweight cover video inside `assets/`.

The included `assets/story-cover.mp4` is the reference/cover video and is already wired into the homepage, story card, opening sequence, and scrapbook cover.

The main story and song use Viddler's responsive embedded player. This avoids downloading or storing the large MP4 files in the GitHub repository.

## Deploy
Upload the whole `Site` folder to Netlify or GitHub. Do not rename the folders or the remaining asset filenames.
