# DeutschDaily — English → German → Nepali

A free static personal German language learning web app for daily use.

## Features

- Type an English word or sentence; translation appears automatically after you pause typing.
- Curated common phrases translate **offline** to German and Nepali.
- Unfamiliar phrases use the free MyMemory translation API (online, best-effort).
- German sentence and word-by-word speech via your device's speech synthesis; normal and slow speeds.
- Approximate pronunciation guides in English sounds and Nepali script.
- Built-in daily flashcards, saved phrases stored locally, and tappable German alphabet.
- Responsive desktop/mobile interface, installable PWA on supporting browsers.
- No npm, build pipeline, API key or paid account needed.

## Run locally

You can double-click `index.html` to view the app, but for the most reliable experience (especially install/offline features), serve it via localhost.

### Python (recommended)

Open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Visit **http://localhost:5500** on your computer. Stop with `Ctrl+C`.

### VS Code

Use a local development web server (e.g. VS Code's Live Server extension).

## Publish free on GitHub Pages

1. Create a **new repository** called `german-daily-companion` (separate from your production projects).
2. Upload **all the files in this folder** to the repository root and commit to `main`.
3. Go to repository **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**; branch `main`, folder `/(root)`; save.
5. Once GitHub completes deployment, the URL should follow this pattern: `https://YOUR-USERNAME.github.io/german-daily-companion/`.
6. Open on mobile and choose **Add to Home Screen** / **Install app** where supported.

## Limitations / important notes

- MyMemory's free anonymous quota is **5,000 characters per day**; requests have a 500-byte input limit. The app sends typed text to MyMemory **only when the phrase is not stored locally**. Do not enter confidential information. Translations may be imperfect or unavailable at times. [MyMemory official limits](https://mymemory.translated.net/doc/usagelimits.php) and [API specification](https://mymemory.translated.net/doc/spec.php).
- For known curated phrases, the English/Nepali phonetic spellings are hand-authored but simplified. For arbitrary phrases, the spellings are **automatically approximated**, not a trustworthy dictionary or IPA. Listen to the German audio to learn the sound.
- Audio needs device/browser speech-synthesis support and a German voice (typically present on desktop/mobile but sometimes must be installed).
- Offline support includes the site itself, curated phrases, cached online translations and saved phrases. Brand-new phrases need internet.
- Saved favorites stay only on the same browser/device. Clearing site data resets them.
- The translation service is external and unaffiliated. For production-grade unlimited translation, set up your own backend translation provider and store keys securely **server-side**, not in GitHub Pages JavaScript.
- The software is an educational starter, not professional translation service.

## Structure

`index.html` – page layout and controls; `styles.css` – styling; `phrases.js` – curated phrasebook/alphabet; `app.js` – functionality; `sw.js` – offline app cache; `manifest.webmanifest` and `icon.svg` – installation/icon.

## Free use

This starter app may be modified for your personal learning or deployed to your own GitHub Pages repository.

## Translation behavior (v2)

- Built-in common phrases and alphabet letters work offline.
- Other input is translated using MyMemory when connected to the internet. The service has quotas and may be unavailable.
- Successful online German translations are **automatically saved on this device** (up to 250 recent items) and shown in **Recent translations** for reuse offline. The Nepali meaning is added when available.
- An unchanged English response is rejected rather than displayed as German, except for a short allowlist of words spelled identically in both languages. This is a safety check, not a guarantee of translation quality.
- When the translator fails, the app displays a clear error and a **Try again** button.
- English and Nepali pronunciation guides for newly translated text are approximate; device speech synthesis is best for listening.
- No backend, login or account is required; translations and favorites are stored in the local browser only. Clearing browser data may remove them. Inputs sent for online translation are handled by a third-party service.

## Improvements (v3)

- **Six offline A1 starter units**, each with five multiple-choice questions, German audio on reveal, Nepali meaning, and local progress tracking. These are *starter units*, **not a complete CEFR A1/B1 course**.
- **Translation** still uses offline phrases and the free MyMemory service for new phrases. API limits and accuracy limitations remain.
- **Honest pronunciation**: curated phrases retain simplified English and Nepali phonetic guides. For arbitrary online translations the app deliberately no longer invents pronunciation spellings using inaccurate character substitutions; users must listen with an installed German text-to-speech voice.
- **German voice picker** enumerates compatible German voices from the user's operating system; audio does not fall back to an incorrectly accented non-German voice.
- **Light/dark mode**, increased mobile word-button tap targets, safer offline cache versioning and network-first navigation.
- **JSON export and restore** of saved favorites, recent translations and lesson progress. No remote account or sync.

Note: Multiple-choice lessons are comprehension practice; the app does not yet evaluate spoken pronunciation. The voice picker requires German speech voices installed on the user's device. The website itself can work offline once cached, but unknown translations require internet.

Backup restore validates essential fields and replaces existing local progress. Keep exported JSON files private.
