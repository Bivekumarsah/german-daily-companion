# DeutschDaily — English → German → नेपाली · Independent A1 Study Course

**[Open the live app](https://bivekumarsah.github.io/german-daily-companion/)**

A free static progressive-web-app for personal German study, with English explanations and Nepali meanings. The **36-unit A1 syllabus** is independently written to cover the everyday CEFR A1 objectives described publicly by the Goethe-Institut and the Council of Europe. **Not an official Goethe-Institut product, partnership, licensed textbook or certificate.** Completing the site is not proof of A1 proficiency and cannot guarantee exam success.

## Current features

- 36 structured A1 units across foundations, people & home, grammar, everyday life, practical situations and exam preparation
- 260 curated unit vocabulary entries (some repeated across units for revision) with English and Nepali meanings, German speech buttons, and selected hand-written approximate English-sound/Nepali pronunciation guides for example sentences
- Grammar notes with English and Nepali explanations and spoken examples
- Interactive, mobile-friendly sentence-building and visual vocabulary exercises across all 36 original units, including listen-first micro-practice
- **Pronunciation Lab in Daily Practice:** 12 original A1 sound lessons (including ich/ach ch, sch, ei/ie, eu/äu, ö, ü, w, z, initial sp/st and ß/ss); 24 example words with English and Nepali approximate sound cues; two-round listening identification; slow speech; short listen-and-repeat speaking drills and optional on-device microphone replay. Practice markers are self-reported and backed up as JSON. This is **not** automated pronunciation scoring.
- **Two additional full question-count independent A1 exam practice sets**: each has 15 listening questions and 15 reading questions (30 objective questions per set), 2 writing form/message tasks and 3 speaking preparation tasks. Timed practice, objective-score feedback and answer review; not official Goethe material or authentic recorded audio.
- **Ten independent bilingual thematic vocabulary packs**: 100 noun entries with German article, English/Nepali meaning, plural notes, optional device audio and five-question practice. Of these 100 entries, 60 are new compared with the existing 244 unique course strings, 40 are purposeful reinforcement; the two banks together have 304 distinct case-folded German entries.
- **A1 Grammar Clinic:** 12 short bilingual English/Nepali workshops with 36 original fill-in-the-blank grammar questions, instant retry/feedback and slow German listening; lessons link back to the existing course.
- **German Essentials:** 216 bilingual verbs, connectors, prepositions and useful expression cards in 27 everyday groups, each with an original context sentence and tap-to-listen audio. These add 213 distinct entries beyond the prior 304, yielding **517 unique case-folded German entry strings across three banks**. This is not a Goethe headword count or confirmed 100% coverage.
- Original listening comprehension questions with German device text-to-speech; replay slowly, reveal transcript after answering
- Original reading comprehension with short everyday messages and multiple choice
- **Writing Coach across all 36 A1 units**: unique task-goal checklists, word-length guidance, optional explicitly saved local draft, easy copy/export to ask for teacher feedback; **does not grade grammar**. Mock writing messages also include goal review; mock forms show filled-field counts.
- **Six guided speaking roleplays** in the two A1 mocks: 18 listen-and-answer turns with German slow/normal speech, English/Nepali cues, transcripts revealed on request and examples revealed after self-practice. **No automatic speaking score.**
- Guided writing prompts and examples; writing is **self-reviewed**, not auto-graded
- Speaking prompts; optional local microphone recording with playback when supported; **no speech recognition or automatic marking**
- Per-unit six-skill practice tracking, topic/search filters and course completion summary (tracking activity, **not mastery**)
- Offline vocabulary word bank with a simple spaced-review schedule (Again / Good / Easy), exported/restored with progress
- A separately labeled original **exam-style practice sampler**: 12 listening + 12 reading MCQs, three writing and three speaking prompts; shorter than real exam; not an official exam or pass score
- Preserved English → German → Nepali translator, common 78 phrase entries, offline glossary, pronunciation audio, favorites, recent translations, starter flashcard drills and German alphabet
- Independent routed academy views (`#/dashboard`, `#/course`, `#/vocabulary`, `#/exam`, `#/translator`, `#/practice`, `#/resources`) with top navigation and a compact mobile dock; direct links work on GitHub Pages
- A dashboard with course progress (practice tracking, not proficiency), themed unit navigation and deep links to units, e.g. `#/course/a1-01`
- Optional per-section A1 practice countdown timers (20/25/20/15 minutes); shorter drills than the actual exams
- Original A1 exam-style everyday form, invitation email and course-absence writing prompts with clear self-check rubrics; original role-play speaking prompts
- Mobile-friendly with a five-section bottom dock plus More menu for practice/resources, dark/light mode, versioned service worker, import/export including the new course progress
- No backend, account, advertisement, tracking pixel, subscription, npm dependency or payment required

**Full-source Goethe A1 vocabulary audit:** See [19-page official-source concordance and remaining gap review](docs/goethe-full-concordance.md), with 373 exact source-label matches, five editorial variants and 305 unmatched candidate labels; **this does not imply Goethe exam completion**. Earlier [176-entry spot-check](docs/a1-vocabulary-accuracy-audit.md) remains as a separate historical regression check.

**Editorial vocabulary audit:** See [the source-grounded Goethe checkpoint audit](docs/a1-vocabulary-accuracy-audit.md) and run `node audit-a1.mjs` to reproduce the 176 selected reference comparisons; all 37 previously missing exact-label entries in that fixed sample have now been added, but the entire official ~650-word list has **not** yet been exhaustively checked. The official complete word-list concordance has **not** been certified.

**Coverage and gaps:** See [Goethe-aligned content register](docs/a1-exam-coverage-register.md) for what is implemented and what still requires vocabulary, language, phone-browser and exam-method validation.

## Exam structure & external sources

The real **Goethe-Zertifikat A1: Start Deutsch 1** exam has four parts (the durations are approximate): **Hören 20 min; Lesen 25 min; Schreiben 20 min; Sprechen 15 min**. The oral part is a group examination. The app's sample prompts are not copied from Goethe's exam and do not replicate its full length or professional scoring.

**Credit/reference** (links also appear inside the app):

1. [Goethe-Institut — Goethe-Zertifikat A1: Start Deutsch 1 official exam description](https://www.goethe.de/ins/de/en/prf/gzsd1.cfm). Exam skill categories, purpose and general scope. © Goethe-Institut for its own website, exam materials and marks.
2. [Goethe-Institut — official, free A1 model exercises, authentic audio, speaking videos, and vocabulary reference](https://www.goethe.de/en/spr/prf/ueb/pa1.html). **Use these for formal exam preparation.** Linked, not embedded or republished.
3. [Council of Europe — CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search). Publicly described A1 can-do competence areas. CEFR terminology attributed to the Council of Europe.
4. [Goethe-Institut — free online pronunciation training](https://www.goethe.de/en/spr/ueb/ast.html). Optional professional pronunciation exercises and feedback, linked but not republished.
5. [Deutsche Welle — German alphabet and pronunciation](https://www.dw.com/downloads/26294179/lektion1-learner-pronunciation.pdf). Reference on umlauts, diphthongs and ß; original copyrights remain with the source.

**Attribution notice:** DeutschDaily is an independent application and is **not affiliated with, endorsed by or certified by Goethe-Institut or the Council of Europe**. "Goethe-Zertifikat" is used descriptively to identify the external examination and link to its official resources. Course examples and exercises are original DeutschDaily content. Official Goethe material remains on Goethe's own website under its own terms.

## Known limitations

- This is a broad A1 study pathway, **not a guarantee of full official vocabulary coverage** or teacher-verified language mastery. Work through the **official Goethe vocabulary list and model exams** before sitting an exam.
- Audio is generated by the device's German text-to-speech voice, **not native-speaker Goethe exam recordings**. Install a German voice for best results.
- English-style/Nepali phonetic guidance (including new sound examples) is **approximate**, not reviewed or certified by a native German phonetics instructor. Some sounds (notably /ç/, ö and ü) have no direct English/Nepali equivalent. Device-generated audio is the primary reference. Arbitrary online translations are intentionally not given invented phonetic spellings. Listen to native speech and the official recordings to improve accuracy.
- Writing and speaking require a tutor/partner or external feedback for reliable assessment. The app only lets you self-check against example responses and optionally record/replay yourself. Microphone recording stays in browser memory and is discarded on reload.
- The translator uses the public [MyMemory API](https://mymemory.translated.net/doc/spec.php) for phrases not in the built-in dictionary. It has third-party quotas, may return imperfect translations, and needs internet. Typed text is sent to the third-party service. **Do not enter private personal data.**
- Offline access covers the downloaded app shell, course units, locally saved translations and phrasebook. First load must be online to install the service worker. Local progress can be lost if browser storage is cleared; export a backup regularly.
- The study-progress percentage counts practiced activities, **not official proficiency**. The exam sampler's automated MCQ score is not an A1 certificate.

## Local development

```bash
python -m http.server 5500
# Open http://localhost:5500
```

No build step. GitHub Pages publishes from `main` / root. To regenerate the original course content from editable Python authoring source:

```bash
python build_course.py
```

## Testing

```bash
node --check app.js
node --check a1-course.js
node --check a1-course-data.js
node --check sw.js
node test.mjs
```

GitHub Actions runs the smoke tests on each push. For true production readiness, also test speech voices, mobile browsers, microphone permission and contrast/accessibility on real devices.

## Privacy & safety

Learn with fictional form information. Favorites, translations and progress are saved locally. Exporting progress creates a JSON file on your device; importing it restores valid learning records. Optional microphone recordings are not uploaded, saved in localStorage or sent to servers. See the API limitation above regarding **online translation text**, which does leave your browser.
