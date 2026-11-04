# DeutschDaily A1 — section-by-section quality improvement plan

Updated: 2026-11-04. **Goal: independently verifiable 9/10-quality learning experiences in each area; not a claim that 9/10 is achieved, nor a Goethe certification or pass guarantee.**

## Principles and acceptance criteria

Quality must be earned through evidence, not by assigning inflated ratings. A section can be considered **ready for a 9/10 assessment** only after (1) representative features work on desktop and actual Android/iPhone browsers, (2) a qualified German reviewer checks language, (3) a qualified Nepali reviewer checks explanations and phonetic approximations where relevant, (4) real beginners can use the section without coaching, and (5) accessibility, offline/privacy behavior and regression tests have documented results. Authentic exam delivery and professional scoring additionally require exam-specific checks.

**Do not conflate:** amount of code shipped, total vocabulary card strings, study progress, exam performance, CEFR A1 proficiency, or official Goethe-institute endorsement.

| Section | Implemented baseline | Priority upgrade and evidence needed |
|---|---|---|
| Beginner onboarding / dashboard | Routed dashboard; guided six-step ~10-minute practice | Observe five first-time learners completing a session unassisted; improve confusing labels; check low-data use |
| 36-unit curriculum | 36 structured lessons, six practice skills | Lesson-by-lesson expert content QA, pacing, prerequisites, uneven topic depth and variation review |
| Vocabulary & flashcards | 260 original unit vocabulary entries plus thematic/essentials banks and spaced review | Verify exact senses, article/plural forms, Goethe source concordance and recall retention; document all missing headwords |
| Pronunciation | TTS buttons, 12-sound lab, 36 bilingual grammar-example sound cues | English-sound AND नेपाली-script guides across all original words/phrases where verified; human phonetics review; physical device German-voice test |
| Grammar | 12 workshops, original examples, sentence builders | A1 form/function correctness pass, graduated hints, independent retention checks and accessible keyboard controls |
| Listening | Original comprehension activities voiced by device TTS | Natural authentic-speed listening practice, varied speakers and noise contexts where licensed, official Goethe audio links; no synthetic-voice-as-native claim |
| Reading | Original short messages and questions | Diverse real-life A1 formats, clear error rationales, progressive difficulty, expert language validation |
| Writing | 36 prompt checklists, saved drafts and seven narrow offline hints | Writing rubrics with a qualified teacher; safe/accurate task feedback; honest limitations on auto-grading |
| Speaking | 18 roleplay turns, optional local recording and replay | Human speaking practice and rubrics; device permission tests; do not claim machine pronunciation or CEFR scoring |
| Mock exams | Two original sets with 60 objective questions and self-reviewed productive tasks | Check format/timing against current public Goethe specs, authentic audio links, independent examiner scoring and no false pass predictor |
| Revision / progress | Offline review, practice completion, backup and error-prioritizing recall | Restore/export reliability, transparent practice-vs-mastery labels, retention validation without punitive streaks |
| Design, accessibility, mobile & offline | Responsive navigation, dark/light themes, service worker, Chromium/WebKit emulator checks | Actual Android Chrome and iPhone Safari signoffs, keyboard and screen-reader checks, reduced motion, offline and mic consent tests |

## First focused improvement — 2026-11-04 (pull request)

1. Daily Discover now shows four German words with English/Nepali meanings visible by default, and individual **Hide meaning / Show meaning** controls for active recall. Accessible state and button targets are exposed. Listening remains optional.
2. After successfully building a grammar sentence, learners see the existing approximate **English-sound and Nepali-script guides** alongside normal/slow German TTS and an explicit accuracy disclaimer. The hints remain hidden until the sentence is solved.
3. The original grammar-example pronunciation fields for units **04, 17, 25, 32** were truncated. Their missing sentence endings are supplied as approximate cues; **human phonetic verification still pending**.
4. Automated regression coverage checks meaning reveal, accessible expanded state, pronunciation after successful sentence building, four repaired endings and no course-progress contamination.

## What this does NOT complete

- All **260 original unit vocabulary entries currently lack dedicated `pronEnglish`/`pronNepali` fields**. Do not generate misleading phonetic approximations automatically or claim every word has a verified guide.
- The whole Goethe source-label comparison still has **305 candidate labels unmatched** as documented in `docs/goethe-full-concordance.md`. Candidate-label counts are not a certified list of missing principal A1 headwords; examine inflected and derived forms by hand.
- The **762-row editorial queue** has not received qualified bilingual signoff.
- Real Android and iPhone QA remains unsigned. Chromium and Linux WebKit emulation are not physical phone testing.
- Speaking pronunciation, writing quality and exam pass likelihood are not automatically graded.

## Next sequence (gate each stage before deployment)

1. **Vocabulary and phonetics:** reconcile source words and senses, annotate individual entries with reviewer-checked English/Nepali cues, add an explicit coverage counter; test audio/TTS and offline fallbacks.
2. **Comprehension and grammar:** grow varied, contextual listen/read/write challenges, comprehensible bilingual explanations and graduated review instead of endless repetitive MCQs.
3. **Speaking and writing:** publish teacher-facing rubrics and sample answers; invite expert assessment; protect learner audio/text privacy.
4. **Goethe exam rehearsal:** test real format/timing with official linked model materials and informed no-pass-guarantee copy.
5. **Release gates:** CI green, manual Android/iOS tests signed, accessibility review, nontechnical beginner sessions and updated documentation. Only then consider a public rating higher.

References: `README.md`, `docs/a1-exam-coverage-register.md`, `docs/a1-human-editorial-review.md`, `docs/real-device-qa.md`, `docs/daily-learning-journey.md`.
