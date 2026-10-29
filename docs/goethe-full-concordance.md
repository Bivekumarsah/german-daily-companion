# Goethe A1 full-source lexical concordance — first machine-assisted pass

**Date:** 29 October 2026. **Source:** Goethe-Institut, [official Goethe-Zertifikat A1: Start Deutsch 1 Wortliste (PDF)](https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf).

This report **supersedes the earlier 176-word spot-check as the current breadth-of-source audit**. It is still **not** native-speaker certification, a guarantee of exam readiness, or proof that the current course teaches every official A1 principal entry. Exact string matching cannot determine whether a learner can understand or use the word.

## Repeatable source and method

1. During GitHub Actions, download the **official Goethe PDF to a temporary runner folder** and verify that its first bytes identify a PDF.
2. PyMuPDF extracts the *left-column vocabulary labels* from all **19 printed alphabetical-list pages (9–27)**. It does not copy the author's original illustrative example sentences into this repository.
3. Compare extracted candidates to DeutschDaily's **existing German, English and Nepali study banks** using Unicode normalization and case folding, with plural annotations removed conservatively. Separate exact labels, lemma/article/reflexive-form variants and unmatched candidates.
4. Publish a **small aggregate JSON report** in GitHub Actions artifacts. The complete copyrighted official PDF and its complete extracted list are not included in repository commits or shared artifacts.
5. Use `node audit-a1.mjs` for the earlier selected reference checkpoints; run `python scripts/goethe-full-audit.py --pdf /path/to/official.pdf --report /path/to/report.json` for the full document after obtaining the official source.

See `scripts/goethe-full-audit.py`, `scripts/export-local-entries.mjs`, and `.github/workflows/goethe-concordance.yml`.

## Verified automated results, source scan of printed pages 9–27

| Item | Count |
|---|---:|
| Extracted PDF lexical rows (including repeated labels) | 686 |
| **Distinct candidate source labels** | **683** |
| Local study entries in the three banks | **576** |
| Distinct local German strings | **517** |
| Exact source-label matches | **373** |
| Same-lemma or article/reflexive variants requiring review | **5** |
| Unmatched candidate source labels | **305** |

The source contains approximately **650 principal entries** according to Goethe. The parser's **683 labels** include minor derived words, some plural or compound forms, and formatting-specific entries. This is **not 683 required principal lemmas**, and **373/683 is not a valid overall mastery score**.

## What was improved in this release

**48 independent German/English/Nepali study cards across six topic groups**, addressing frequently encountered official-source labels. The first 40 teach practical verbs, signs, travel and family/home words, including *bekommen, benutzen, besetzt, das Bein, der Bahnsteig,* and *gültig*. The additional eight cards distinguish lexically important forms such as *die Bitte* (noun) versus *bitte* (particle), *das Leben* (noun) versus *leben* (verb), and reflexive *sich treffen* versus basic *treffen*. All learner sentences were newly written for DeutschDaily, not reproduced from the Goethe booklet.

### Manual sense and article review queue

The source extraction still flags five variants:
- `(sich) anmelden` versus local `sich anmelden` — likely an equivalent reflexive lemma, but compare grammatical usage.
- `(sich) duschen` versus local `duschen` / `sich duschen` — both appear in normal German usage; confirm lesson examples.
- `Satz` versus local `der Satz` — the local article is useful, but the PDF extracted the bare noun heading.
- `(sich) treffen` versus local `treffen` / `sich treffen` — the object pattern matters; do not conflate them as one learned pattern.
- `(sich) vorstellen` versus local `vorstellen` / `sich vorstellen` — introducing oneself versus presenting something requires separate contextual teaching.

**These five were not automatically converted into exact matches.** This is intentionally conservative and avoids overstating completeness.

### Why 305 candidates still need review

Some are genuine missing A1 words, and others are source-format artifacts or derivable forms: printed prefix stems such as `all-`, entry variants like `(sich) anziehen`, and compound entries. The next editorial pass must distinguish *principal required words* from *derived or alternate forms* before adding items to lessons. The website cannot honestly be described as fully Goethe A1 complete merely because its earlier 176 selected checkpoints were addressed.

## Language and usability quality gates remaining

1. Human-reviewed **complete principal headword inventory**, including parts of speech, source pages, actual synonyms and morphological forms.
2. Qualified German-language proofreading of all 576 study entries' senses and grammatical examples, followed by Nepali-language proofreading.
3. Article, noun plural, verb valency and reflexive-pattern correction for actual mistakes; do not remove existing flashcards or progress IDs without a migration.
4. A structured course-based review plan for unmatched **priority** words; adding a giant passive list would undermine the learner's progression.
5. Testing German device voice availability, audio and accessible layout on real Android/iOS browsers; programmatic CI is not physical-device QA.
6. Real graded writing/speaking support and independent use of [Goethe's authentic A1 model examination materials](https://www.goethe.de/en/spr/prf/ueb/pa1.html).

## Copyright and transparency

All new teaching cards and example sentences in this repository are original. The official vocabulary booklet remains Goethe-Institut's publication. The CI workflow downloads the source only for a temporary read-only analysis and does not redistribute the original PDF or full extracted headword inventory.
