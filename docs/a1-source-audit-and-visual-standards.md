# DeutschDaily A1 — source audit and visual-first learning standard
Date: 2026-10-29. Status: initial curriculum review and first implementation slice; **not** a completed Goethe vocabulary or linguistic audit.

## What was assessed
- **Complete A1 Course Notes**: user-supplied, 1,756 pages, 14 chapters. Reviewed chapter outlines and multiple passages throughout the document in the prior project review. Major coverage: alphabet/phonetics, articles and pronouns, numbers and dates, present and past tense, negation and questions, adjectives, modal and separable verbs, accusative/dative, directions, shopping, health and everyday dialogues. Many pages are incremental/repeated slides.
- **A1 Vocabulary and Phrases Only Notes**: user-supplied, 609 pages, also organized by the same 14 chapter numbers. Topics include greetings, introductions, time, days/months, daily activities, directions, shopping, transport, accommodation and body parts. Treat as an overlapping vocabulary and dialogue source, not 609 new independent lessons.
- **Common German Adjektiv with Examples**: 2 pages, 30 adjective/opposite pairs with sentences. Use A1-relevant examples; check adjective-ending complexity against beginner progression.
- **Commonly Used Irregular Verbs in German**: 1 page, 24 verbs with Partizip II and auxiliaries; prioritize frequent A1 verbs, defer less common verbs.
- **Commonly Used Singular & Plural in German**: 2 pages, 50 singular/plural noun pairs. Teach article and plural alongside each noun.
- **Commonly Used Trennbare Verben**: 2 pages, 20 examples. Prioritize common daily activity verbs such as aufstehen, einkaufen, anrufen, abholen.
- **List of Verbs with Akkusativ**: 4 pages, example sentences across common and advanced contexts. Teach common objects/verbs in beginner situations, not by rote memorizing the full list.
- **List of Verbs with Dativ**: 3 pages, explicitly mixes the author's A1, A2, B1 and B2 labels. Split by the actual A1 learning goal after verification; don't equate the author's levels with Goethe's specification.

Source PDFs are held in the chat/project materials; their copyrighted slide content has **not** been copied into this repository.

## Accuracy findings — to address before bulk content import
1. The full 1,756-page notes approximate **ich** as English 'ish'. The standard **ich-Laut** is /ç/, not English /ʃ/. Curated English and Nepali pronunciation guides must be labeled approximate and German audio must remain primary.
2. The full notes repeatedly spell **Honig** as **Hönig**. Standard German spelling is **der Honig**.
3. The separable-verbs sheet has a heading **abreisen** paired with a sentence demonstrating **abfahren** ('Der Zug fährt ... ab'). Verify the headword and sentence agree before reuse.
4. The sheet's **mitbringen** example uses *zum Party*; standard German is **zur Party**.
5. The irregular-verb list pairs **schaffen — hat geschaffen** with English 'to complete/do'. This mixes two senses: *hat geschafft* commonly means managed/completed, while *hat geschaffen* means created. Verify meanings and conjugations by sense.
6. Some accusative/dative examples are useful real-life expressions but are not proof that all listed verbs belong to the A1 core; verify and separate optional A2+ expansion.
7. The supporting materials have many explanations and example sentences but are not a substitute for graded listening, reading, writing and speaking practice with realistic Goethe A1 task formats.

## Current application baseline (GitHub main at audit)
- **36 units**, **260 vocabulary entries** including repetition, **244 unique case-folded German entry strings**.
- One example pronunciation guide in English-sound and Nepali script for each lesson, but no word-level phonetics attached to the 260 vocabulary entries.
- Browser German TTS; audio voice quality depends on device. Audio is not professionally recorded native German.
- Self-reported activity progress, brief original practice sample, PWA offline support, English-to-German-to-Nepali translator, dark/light mode.
- Preserve existing route IDs, localStorage keys, translations, flashcards, offline shell and 36 unit identifiers during future migration.
- CEFR/Goethe readiness requires evidence in **Hören, Lesen, Schreiben and Sprechen**, not just completed activity counts.

## Visual-first accessibility and engagement standards
Every beginner module should follow **see → hear → say → choose → use → review**, using small steps rather than a long scrolling wall of text:
1. **1 small outcome per screen** with English + Nepali help and natural German examples.
2. **Picture/emoji learning cues** (original illustrations and licensed/author-created visuals later); show German, English, Nepali and approximate English/Nepali pronunciation.
3. **Tap to hear** German with a slow replay option; provide readable transcripts and a fallback if no German device voice is installed.
4. **One micro-challenge after a small word set**; immediate, gentle feedback; don't require a login.
5. **Mini dialogues and practical scenarios**, e.g. greeting, grocery, transport and doctor; progressively increase independence.
6. **Daily goal of 10–15 focused minutes**, spaced repetition and a small 'continue' action; no punitive streak or distracting animations.
7. **Real four-skill assessment** at module ends, accessible keyboard controls, mobile-first layouts, support prefers-reduced-motion and dark/light contrast.
8. **Truthful progress**: activities completed ≠ exam mastery. Clear separation of practice scores and actual exam readiness.
9. **Sources credited**, original explanations and examples, no unauthorized copying from PDFs or Goethe test content.

## Incremental implementation
- **Stage 1 (this branch)**: self-contained, dependency-free `visual-lab.js` and `visual-lab.css` integrated with the existing A1 vocabulary tab for eight selected beginner contexts. Each contains three illustrated emoji word cards with audio and a three-round picture-to-German challenge. The current 36 lessons, progress rules and translator remain in place.
- **Stage 2**: after terminology/proficiency review, extend to remaining core topics, add word-level vetted phonetics and original licensed picture assets, plus guided dialogues.
- **Stage 3**: draft the proposed 12-module / 48-lesson curriculum by mapping existing unit IDs and creating new incremental lesson modules. Add spaced review and stronger four-skill practice.
- **Stage 4**: original full-length exam-style tests and skill diagnostics. Continue linking to officially provided Goethe exam materials rather than copying them.

## Official references
- Goethe adult A1 exam: https://www.goethe.de/ins/de/en/prf/gzsd1.cfm
- Goethe A1 exam-training materials: https://www.goethe.de/en/spr/prf/ueb/pa1.html
- Goethe A1 word list: https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf
- CEFR descriptors: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search

**Independence:** DeutschDaily is not affiliated with or certified by Goethe-Institut, nor does completing the website guarantee exam success.
