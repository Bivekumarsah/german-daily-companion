# DeutschDaily A1 vocabulary accuracy and official-source checkpoint audit

**Audit date:** 29 October 2026. **Status: first source-grounded lexical pass, not a full Goethe A1 certification.**

## Basis and attribution

- **Primary exam reference:** [Goethe-Institut, Goethe-Zertifikat A1: Start Deutsch 1 – Wortliste](https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf), preface (printed p. 3), group lists (pp. 5–8), alphabetic headwords (pp. 9–27).
- Goethe says the word list has **approximately 650 entries**. Learners should understand them passively, with about half available for active use. The book also notes that derived subentries and female counterparts are not necessarily separately listed.
- **Local material:** Original DeutschDaily 36-unit vocabulary; independent noun packs; independently written essential expressions. The site has not copied Goethe's illustrative sample sentences. Seven contributed PDF sheets are reference documents and **are not** the official examiner's normative list.
- **Repeatable test:** `node audit-a1.mjs` (zero external dependencies) checks every local entry's German/English/Nepali presence, audits the selected source-page checkpoints and reports verbatim form matches and gaps. `node audit-a1.mjs --json` also prints machine-readable output. `--strict` deliberately fails when sample gaps remain.

## Actual corpus counts

| Local source | Entries |
|---|---:|
| Original 36 A1 lessons | 260 entries, 244 distinct strings |
| 10 thematic noun packs | 100 entries, of which 60 added previously absent strings |
| Previous essential verb/phrase packs | 80 entries, of which 77 added previously absent strings |
| This review's *Goethe-reference-checked* expansion | **48 new entries** over 6 topics |
| **Combined current site** | **488 study entries; 429 distinct case-folded German entry strings** |

Counting is on the **German entry string**, not on roots, meanings, inflections or exact Goethe headwords. Some local phrases and derived forms do not correspond to a single listed Goethe dictionary headword.

## Verified sample comparison, not a percentage of full syllabus

The code contains **176 hand-selected checkpoints** from the official alphabetic list (printed pages 9–26), with an accompanying printed page number. The corpus search returns **139 exact case-insensitive string matches**, and **37 checkpoints not represented as an exact entry in any of the three banks**. Results come from checking local bank entries only; some forms appear elsewhere inside sentences or mock dialogue.

This is an **intentionally selected sample** to make future audits measurable, *not a random sample*. Accordingly, **139/176 is NOT a Goethe pass score or a claim about the 650-entry list's coverage**.

Examples of outstanding checklist gaps include: *ab, ausmachen, danken, dich, dir, das Dorf, das Foto, hier, in, möchten, mögen, der Schuh, wissen* and *zwischen*. We intentionally retain the gap report rather than mark these words as learned merely because they occur inside example sentences.

### Editorial issues and distinctions

1. **Inflection and article normalization:** The core lessons have *die Schuhe* (plural), while the official headword is *der Schuh* (singular). Both are valid German, but the plural form must not be counted as an exact dictionary-entry match. The audit therefore reports the missing singular headword. Future data updates should add the singular **without deleting existing learner progress for the plural**.
2. **Reflexive variants:** *sich anmelden* and the official *(sich) anmelden* need human sense-level equivalence review; exact string matching is deliberately conservative.
3. **Meaning and plural accuracy:** Each new word has been provided with a German example plus English and Nepali meanings, and selected forms checked against source pages. **The entire 488-entry site has not been independently reviewed by a German-speaking teacher**, so we must not call its translations or morphology certified.
4. **Pronunciation:** German TTS voices differ by device. English/Nepali approximations, especially for /ç/, ö and ü, remain didactic hints rather than native-speaker transcriptions.
5. **Source scope:** The official list is intended as a level reference, not necessarily a lesson sequence. Its 650 entries cannot be compared naïvely with a website's 429 strings.

## Reproducible next editorial steps

1. Run the complete official Goethe headword list through a human-reviewed concordance, including noun gender, plural patterns, reflexive forms, idiomatic expressions, secondary meanings and capitalization. This audit was **not** performed exhaustively because the official PDF was readable online but not available as a local file to process here.
2. Resolve the 37 documented sample gaps with graded lessons; do not optimize a selected coverage score by inventing new high-frequency counts.
3. Have a qualified German editor proofread the bilingual meaning and sentence examples, then a Nepali-fluent reviewer check script and register.
4. Validate 36-unit navigation, microphone permissions, German speech synthesis and accessibility on Android and iPhone; automated DOM tests are not substitutes for actual devices.
5. Test writing/speaking with a tutor, and use the official Goethe A1 model exam's **authentic audio** before claiming complete exam readiness.

**Conclusion:** More A1-relevant content and a traceable local consistency/official-sample check are implemented. **DeutschDaily is still not independently validated as 100% complete for the Goethe A1 examination.**
