# DeutschDaily — unified daily learning journey

**Status:** original six-part self-study implementation; this is not a verified exam score, pronunciation assessor or qualified bilingual proofread.

## What changed

The Overview page now puts one guided, untimed, approximately ten-minute lesson near the top rather than making learners choose among seven sections. The lesson selects the earliest of the existing **36 A1 units** whose six course activities have not all been practised. It is separate from that formal course progress.

| Step | Minutes (suggested) | Practice |
|---|---:|---|
| Discover | 1 | Four original German words with English/Nepali meaning and speech |
| Listen | 2 | One original German listening question; keep transcript hidden unless help is requested |
| Build | 2 | Arrange all words of the lesson's original grammar example |
| Read | 2 | One original reading prompt and multiple-choice question |
| Speak | 2 | Respond without a displayed model, then reveal one sample; optional on-device recording if supported |
| Recall | 1 | A vocabulary question or a previously missed listening/reading item |

**Suggested durations are not timers.** There is no forced streak, punishment or paid unlock. The sequence is always optional: the original course, all tools and A1 exam practice remain directly accessible. This version reuses the 36-unit curriculum, so the **activity types still repeat** and further editorial variety may be desirable.

## Adaptive review

Incorrect listening/reading selections and recall words are held in a local bounded queue (30). Errors are shown with a calm retry prompt and are prioritized in the final recall step on the same or a later session. Successfully remembering a queued item removes it; the session can be resumed at the current step.

The queue is **not a psychometrically validated adaptive learning algorithm**. It is a simple mistake-prioritization scaffold. The six-step practice record never marks an original A1 unit mastered or changes its existing six progress flags.

## Privacy, backup, offline

- State: `deutschdaily-daily-journey-v1` (date, original unit ID, six-step index).
- Review: `deutschdaily-daily-mistakes-v1` (up to 30 known original vocabulary or comprehension task identifiers).
- Existing version-2 learning backups now optionally contain these entries and validate imported values against original task IDs and texts. Existing backups remain supported.
- Text-to-speech requires an installed German device voice. Otherwise exercises remain readable and functional.
- Speaking recordings use the existing optional local-only recording controls and are not uploaded or backed up.
- Original PWA installation and local cache continue to work offline; new translations, dictionaries and external source links still require the internet.

## Quality checks

`node daily-journey.test.mjs` exercises 10-minute step metadata, safe next-unit selection, wrong-answer review, word ordering, listening/reading, speaking progression and local progress isolation. The automated Chromium and WebKit browser workflows test opening the daily flow and responsive behavior; the Chromium suite also tests incorrect-answer retry and axe-core accessibility. **Neither represents physical device or beginner usability testing.**

## Usability follow-ups

Test with beginners who have never studied German: ask whether they can complete a first lesson without guidance, understand German vs Nepali sound aids, find their saved progress, and recall a difficult word two days later. Prioritize meaningful language progress over leaderboards, forced streaks or busy animations.
