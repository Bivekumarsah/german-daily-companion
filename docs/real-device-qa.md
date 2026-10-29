# DeutschDaily real-device QA: manual checklist

**Status: Not performed.** Chromium and WebKit browser-engine emulation in GitHub Actions is useful regression testing, but a Linux-based WebKit run is **not an iPhone** and a desktop Chromium mobile viewport is **not an Android phone**.

## Record each test session

Complete and sign one row per actual physical phone before claiming real-device testing:

| Device / OS / browser | Test date | QA tester | Result | Evidence / issue |
|---|---|---|---|---|
| Android phone · Chrome (recent) | Pending | Pending | Not tested | — |
| Android phone · alternate browser (optional) | Pending | Pending | Not tested | — |
| iPhone · Safari (recent iOS) | Pending | Pending | Not tested | — |
| iPhone · Safari (older supported iOS) | Pending | Pending | Not tested | — |

Use personally available test devices or a willing human tester. Do not fabricate test measurements, screenshots, operating-system versions or tester signatures.

## Hands-on cases to test

- [ ] Load home, course, vocabulary, pronunciation and exam pages on mobile data and Wi-Fi; check no horizontal scrolling, overlap or obscured lower navigation in portrait and landscape.
- [ ] Navigate through the 36 units; tap a lesson activity, close/reopen the app and verify saved progress remains intact.
- [ ] From Vocabulary, check *die Eltern* shows "plural-only", *das Wort* distinguishes *Wörter* and *Worte*, and *das Gleis* shows corrected English/Nepali explanations and opens Duden sources.
- [ ] Play normal and slow German speech and choose a real German device voice; confirm no English voice fallback is silently treated as correct German pronunciation.
- [ ] In Exam → Speaking, grant microphone permission intentionally, record and replay locally, then switch turn, hide tab, leave page and confirm the recording and microphone stop. Also test denial and lack of support.
- [ ] In Exam → Listening and Reading, choose English-guided or German mode, answer, submit and review; no transcript leaks before submission.
- [ ] In Writing, enter an obvious example of a supported grammar error and then a correct example. Ensure instructions explain that absence of warnings is **not** proof of correctness.
- [ ] Toggle dark/light, system text-size enlargement (200%), reduced motion, VoiceOver (iOS) or TalkBack (Android), and keyboard/switch support where possible.
- [ ] Install the PWA, disconnect from the internet, reload all locally cached study materials; online translation and external dictionary links are expected to require internet.
- [ ] Check back navigation, 320–390px effective viewport scaling, orientation changes, soft keyboard obscuring textareas, focus visibility and target sizes.
- [ ] Record any failures as reproducible GitHub issues with safe screenshots (never share learner recordings or personally identifying details without consent).

**Acceptance rule:** Do not raise mobile, microphone, or accessibility quality to a verified 9/10 until real tests are documented and critical failures are resolved.
