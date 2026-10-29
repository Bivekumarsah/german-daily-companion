# DeutschDaily A1 — German / Nepali editorial review

**Status: review preparation and a limited dictionary-verified correction pass. Not a qualified German/Nepali human review.**

## Content inventory and export

Run from the repository root:

```sh
node scripts/export-editorial-review.mjs --out audit-results/a1-editorial-review.tsv
node scripts/editorial-review.test.mjs
node scripts/a1-content-qa.mjs
```

The review spreadsheet contains **762 unique content review rows**: 260 original unit vocabulary entries, 36 grammar examples, 36 writing models, 36 speaking models, 100 thematic noun entries, 216 essential expression cards, 36 supplementary grammar questions, 18 guided dialogue turns, and 24 phonetic teaching examples. It contains only original site teaching content, not Goethe's copyrighted example sentences.

Every row starts with **German review = pending** and **Nepali review = pending**. An empty reviewer name/date means no review has happened. GitHub Actions **DeutschDaily checks** includes an artifact named `deutschdaily-a1-human-review-worksheet` with the TSV. This is a queue, **not** evidence of acceptance.

The worksheet columns include stable key, category, German text, English meaning, Nepali meaning, noun plural, original German/English examples, limited source URLs, editor notes, separate German/Nepali review statuses, reviewer identity/date and corrections required. Use a spreadsheet editor to make suggested changes, retain the stable keys, and never label an entry as fully reviewed without an actual competent independent reviewer.

## First dictionary-supported corrections (29 October 2026)

| Local card | Editorial adjustment | Evidence |
|---|---|---|
| `die Eltern` | Explicit **plural-only** label instead of the ambiguous shared mass-noun dash. The everyday way to name one parent is `ein Elternteil`. | [Duden: Eltern](https://www.duden.de/rechtschreibung/Eltern) |
| `das Wort` | Keep `die Wörter` for individual vocabulary units; explain `die Worte` for connected remarks or sayings. | [Duden: Worte oder Wörter?](https://www.duden.de/sprachwissen/sprachratgeber/worte-oder-woerter) |
| `das Gleis` | Correct narrow English/Nepali gloss to "railway track (at a station)" / "रेलको लिक / पटरी". Note that `Gleis 5` on a station sign refers to track/platform number 5. | [Duden: Gleis](https://www.duden.de/rechtschreibung/Gleis) |

The corresponding cards show their original bilingual editorial notes and source references. These three checked entries do **not** represent a full German or Nepali review.

## Required independent editorial signoff

1. **German reviewer:** check inflection, parts of speech, noun articles, plurals, verb valency, separable/reflexive patterns, sentence semantics, spelling, capitalization, appropriate A1 phrasing and whether translations preserve the actual sense. Cite a reliable dictionary or grammar source for substantive decisions.
2. **Nepali reviewer:** review Devanagari spelling, register, person/honorific distinctions, ambiguity, real-world translation equivalence and pronunciation cues. Review language context rather than word-by-word literal matching.
3. **Learning/Goethe task review:** check all exercise correct answers and distractors, speech prompts, authentic exam format and listening scripts. Do not claim original drills are official Goethe questions or that 683 machine-extracted labels equal the ~650 principal headwords.
4. **Two-stage acceptance:** one person proposes corrections with evidence, another verifies changes in source data and resulting website; both indicate completed status and their reviewer identity/date. Do not approve missing or unchecked material.
5. **Release gate:** rerun GitHub Actions `DeutschDaily checks`, WebKit browser smoke, Chromium/axe accessibility and PWA cache/update checks. Confirm the vocabulary count/progress identifiers have not been silently changed.

## Limits of automation

The existing code checks that fields are populated, counts and answer shapes are consistent, Nepali Devanagari exists and a few known forms remain correct. They **do not** prove translation quality, pronunciation, reading and listening realism, language correctness or exam readiness. The exporter is a review aide; only a real qualified reviewer can provide language approval.
