# DeutschDaily A1 — official vocabulary checkpoint audit

**Updated 29 October 2026.** This report tracks a **selected 176-entry reference sample** from the official Goethe-Institut *Start Deutsch 1* word list, not the whole ~650-entry syllabus. This distinction matters: **zero gaps in this sample does not mean the site covers all A1 vocabulary**.

## Primary source and reproducibility

- [Goethe-Institut, Goethe-Zertifikat A1: Start Deutsch 1 — official Wortliste (PDF)](https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf), alphabetic section (printed pp. 9–27).
- The Goethe introduction states approximately **650** principal listed words, with receptive recognition expected for all and active use of about half. Inflected, derived and feminine forms are not always separate official entries.
- The local checker `node audit-a1.mjs` reads the three existing DeutschDaily vocabulary files, checks that local entries have German, English and Nepali content, reports local duplicates and compares **176 specifically selected source headword strings**. `node audit-a1.mjs --json` emits structured results.
- The original Goethe example sentences have **not** been copied into the course. All added study examples and Nepali/English explanations were drafted for DeutschDaily.

## Current course inventory

| Bank | Number of study entries |
|---|---:|
| Existing 36-unit course vocabulary | 260 (244 distinct strings) |
| Independent noun themes | 100 |
| Earlier essential expression cards | 80 |
| First Goethe-based gap expansion | 48 |
| This release: closes 37 remaining checkpoints, adds 3 verified everyday nouns | 40 |
| **Total study entries** | **528** |
| **Distinct case-insensitive German entry strings** | **469** |

The combined bank is **not** 469 distinct Goethe principal lemmas. Phrases, inflected forms and gender variants are mixed with headwords. Learner progress keys and original course entries remain unchanged.

## Checkpoint results — fixed 176-item reference sample

| State | Before this release | After |
|---|---:|---:|
| Exact case-insensitive entries matched | 139 | **176** |
| Absent exact-entry checkpoints | 37 | **0** |
| Variant-equivalence cases in this sample | 0 | 0 |

The 37 prior exact-label gaps now have individually drafted cards: *ab, allein, anmachen, ausmachen, danken, dann, dich, dir, das Dorf, draußen, das Foto, die Frau, hier, in, leben, das Licht, man, mehr, möchten, mögen, rauchen, das Restaurant, richtig, der Schuh, der Sohn, tun, über, verkaufen, verheiratet, vor, weiblich, werden, willkommen, wir, wissen, die Zeit, zwischen*. Three more source-confirmed, standalone A1 nouns were added: *der Ausweis, das Auto, der Urlaub*.

The official dictionary headword **der Schuh** and previously taught plural **die Schuhe** are now both available without replacing the original item. Reflexive verb canonical forms like *sich anmelden* may still need editorial equivalence checks.

## Critical boundaries: what this audit cannot establish

1. **This is a selected, nonrandom comparison, not a full 650-headword concordance.** A 176/176 sample result is not a valid whole-list percentage, Goethe grade, or completion certificate.
2. **Complete semantic matching has not been performed.** Exact labels do not prove correct sense, noun gender, plural, verb valency, or ability to use a word productively.
3. **No qualified bilingual human proofreading has been certified.** The new sentences were reviewed for obvious word order, spelling and A1 suitability, but the 528 total entries and all their translations have not been independently proofread by native-fluent German and Nepali language specialists.
4. **German audio uses browser/device text-to-speech**; it does not assess learner pronunciation, speaking or listening under official test conditions.
5. **Official full-list PDF parsing is still a research/development task.** The published PDF was available to read, but direct programmatic download to the development environment was blocked. We deliberately did not invent or bulk-reproduce the full official list.

## Follow-up work required before calling DeutschDaily fully A1-complete

A verified, **complete** official-word-list concordance; qualified review of German meanings, noun genders/plurals and Nepali translations; coverage-appropriate practice in context; writing/speaking review; and physical-device/browser testing. Reference authentic Goethe model exam materials at [Goethe official A1 training](https://www.goethe.de/en/spr/prf/ueb/pa1.html).

**Conclusion:** The website now resolves **all 37 previously identified exact-entry gaps in the fixed 176-checkpoint sample**, but **100% Goethe A1 coverage is not yet verified**.
