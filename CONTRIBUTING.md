# Contributing to DeutschDaily

Thank you for helping improve this free, independent A1 German learning project. Beginners use this app in English and Nepali, so small, accurate, accessible improvements matter.

## Before you begin

1. Read the [README](README.md) for the current learning scope and validation limits.
2. Check existing issues and pull requests to avoid duplicate work.
3. For a substantial feature or content expansion, open an issue first to discuss the approach.
4. Create a focused branch and submit a pull request against `main`. Please avoid direct changes to the production branch.

## Good first contributions

- Fix a typo or unclear English/Nepali explanation with a reliable reference.
- Improve keyboard access, visible focus, tap target sizing, or mobile layout.
- Add or improve a small automated regression test.
- Improve documentation for offline functionality, speech synthesis limitations, or real-device testing.
- Report reproducible issues with browser, operating system, screen size, steps, and expected/actual behavior.

## Accuracy and attribution

- German articles, plurals, spelling, sentence examples, and Nepali translations require careful review. Cite a suitable source when proposing factual language corrections.
- Do not copy copyrighted textbook lessons, examination audio, or commercial question banks.
- Keep content clearly independent of the Goethe-Institut. Do not present practice results as official exam scores.
- Automated content checks do **not** replace qualified German and Nepali editorial review. Keep pending reviews labeled honestly.

## User experience and privacy

- Prefer short, predictable, beginner-friendly interactions with optional audio and clear written equivalents.
- Test with keyboard-only navigation and narrow mobile viewports where possible.
- Avoid adding accounts, analytics, remote uploads of learner answers or microphone recordings without explicit prior project discussion and privacy review.
- Preserve offline-friendly behavior and the free learning experience.

## Testing a change

Run the checks relevant to your edit. The README documents the project's existing workflows; examples include:

```bash
node daily-journey.test.mjs
```

For changes affecting browser layouts, audio, or accessibility, consult the testing information in the README and the [real-device checklist](docs/real-device-qa.md). Browser emulation does not count as physical iPhone or Android testing. If you cannot run a check, say so in your pull request instead of marking it passed.

## Pull request checklist

- [ ] The change solves a specific learner or maintainer problem.
- [ ] I checked for related issues or existing pull requests.
- [ ] User-facing teaching text is accurate or clearly marked for editorial review.
- [ ] I checked keyboard and mobile behavior if UI is affected.
- [ ] I ran relevant tests and recorded results, including any untested areas.
- [ ] I updated documentation if behavior changed.
- [ ] I did not introduce unrelated formatting or generated-file changes.

Please keep PRs small enough to review and describe both the benefit and the limitations. Contributions are reviewed for quality; opening a PR does not imply it will be merged.
