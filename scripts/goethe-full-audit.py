#!/usr/bin/env python3
"""Full-page lexical concordance against Goethe Start Deutsch 1 official PDF.

Only read public official PDF locally; never commit or publish its entire text/list.
This parser is machine-assisted and can confuse derived labels, split lines, articles and senses.
The output is an aggregate with a short review queue, not a validated 650-headword concordance.
"""
from __future__ import annotations
import argparse
from collections import Counter, defaultdict
import hashlib
import json
import pathlib
import re
import subprocess
import sys
import unicodedata

ARTICLES = ("der ", "die ", "das ")
DASHES = {"\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-",
          "\u2014": "-", "\u00ad": ""}
IGNORE = {"inventare", "alphabetische", "wortliste", "seite", "wörter",
          "a1", "a2", "b1", "b2", "c1", "c2", "vs_02_280312",
          "münchen", "goethe", "institut", "sprache"}
OFFICIAL_URL = "https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf"

def norm(s: str) -> str:
    s=unicodedata.normalize("NFC",s).strip().lower()
    for src,dst in DASHES.items():
        s=s.replace(src,dst)
    return re.sub(r"\s+", " ", s)

def canonical(label: str) -> str:
    """Normalize PDF plural annotations conservatively, never silently infer nouns."""
    x=re.sub(r"\s+", " ", label).strip(" \t\n\r\x0c")
    x=x.replace("\u00ad", "")
    if x.lower().startswith(("der, die, das", "die, der, das")):
        return x
    # Common printed flexion: 'die Adresse,-en', 'die Größe, -n', 'der Fuß, -ü, e'
    if "," in x:
        x=x.split(",",1)[0].strip()
    x=x.rstrip("·;:")
    return norm(x)

def lemma_only(s: str) -> str:
    x=norm(s)
    x=re.sub(r"^(der|die|das) ", "", x)
    x=re.sub(r"^\(sich\) |^sich ", "", x)
    return x

def goethe_candidates(pdf_path: pathlib.Path) -> tuple[list[dict],dict]:
    try:
        import fitz
    except ImportError as exc:
        raise SystemExit("Install PyMuPDF first: python -m pip install pymupdf") from exc
    doc=fitz.open(str(pdf_path))
    if len(doc)<27:
        raise RuntimeError(f"Expected >=27 official PDF pages, found {len(doc)}")
    records=[]
    debug=[]
    # Printed pages 9–27, zero-indexed PDF pages 8–26 inclusive.
    for page_number in range(8,27):
        page=doc[page_number]
        pieces=[]
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines",[]):
                spans=[]
                for span in line.get("spans",[]):
                    x0,y0,_,y1=span["bbox"]
                    text=span["text"].strip()
                    if 115 <= x0 < 232 and 53 <= y0 < page.rect.height-33 and text:
                        spans.append((x0,text))
                if spans:
                    first=min(x for x,_ in spans)
                    word=" ".join(text for _,text in sorted(spans))
                    word=re.sub(r"\s+"," ",word).strip()
                    if word:
                        pieces.append((line["bbox"][1], first,word))
        pieces.sort(key=lambda p:p[0])
        if page_number==8:
            debug=pieces[:24]
        combined=[]
        for y,x,text in pieces:
            if combined and combined[-1]["term"].endswith("-") and text[0:1].islower():
                combined[-1]["term"]=combined[-1]["term"][:-1]+text
            else:
                combined.append({"term":text,"pdf_page":page_number+1,
                                 "printed_page":page_number+1,"x":round(x,1),
                                 "y":round(y,1)})
        for item in combined:
            term=canonical(item["term"])
            if not term or len(term)>68 or term in IGNORE:
                continue
            if len(term)==1 and term.isalpha():
                continue
            if re.search(r"[!?]",term) or re.match(r"^(?:\d+|seite\s+\d+)",term):
                continue
            if len(term.split())>7:
                continue
            if not any(c.isalpha() for c in term):
                continue
            records.append({"term":term,"printed_page":item["printed_page"]})
    return records,{"pages_checked":19,"page_9_sample":
                    [{"term":x[2][:44],"x":round(x[1],1)} for x in debug[:18]]}

def main() -> int:
    parser=argparse.ArgumentParser()
    parser.add_argument("--pdf",required=True,type=pathlib.Path)
    parser.add_argument("--report",required=True,type=pathlib.Path)
    parser.add_argument("--review-limit",type=int,default=35)
    parser.add_argument("--debug",action="store_true")
    args=parser.parse_args()
    raw=args.pdf.read_bytes()
    if not raw.startswith(b"%PDF"):
        raise RuntimeError("Official file download did not return a PDF")
    labels=json.loads(subprocess.check_output(
        ["node","scripts/export-local-entries.mjs"],text=True))
    all_local=defaultdict(list)
    for entry in labels:
        de=norm(entry["de"])
        if not de or not entry.get("en") or not entry.get("ne"):
            raise RuntimeError("Broken bilingual local entry: "+str(entry))
        all_local[de].append(entry["bank"])
    official,debug=goethe_candidates(args.pdf)
    # Explicitly track ambiguity: a PDF source row may be a derived/subentry.
    if len(official)<400 or len(official)>1150:
        raise RuntimeError("Parser extracted "+str(len(official))+
                           " candidate labels. Inspect column geometry before trusting report; "
                           +str(debug))
    exact,variant,missing=[],[],[]
    lemma_map=defaultdict(list)
    for word in all_local:
        lemma_map[lemma_only(word)].append(word)
    for row in official:
        source=row["term"]
        if source in all_local:
            exact.append(row);continue
        inferred=lemma_map.get(lemma_only(source),[])
        if inferred:
            variant.append(dict(row,local_candidates=inferred[:4]))
        else:
            missing.append(row)
    # Duplicate entries from page breaks and subentry formatting must stay visible.
    official_dedup={}
    for row in official:
        official_dedup.setdefault(row["term"],row)
    unique_exact={r["term"] for r in exact}
    unique_variant={r["term"] for r in variant}
    unique_missing={r["term"] for r in missing}
    letters=Counter(t[:1].upper() for t in unique_missing)
    summary={
      "source":OFFICIAL_URL,
      "official_pdf_sha256":hashlib.sha256(raw).hexdigest(),
      "method":"Automated first-column extraction of every alphabetic-list PDF page (9–27); machine classification, NOT human-certified",
      "source_lexical_rows_extracted":len(official),
      "source_distinct_candidate_labels":len(official_dedup),
      "notes":"Includes principal and derived labels; this count is not the official ~650 principal entry count.",
      "local_study_entries":len(labels),
      "local_distinct_german_strings":len(all_local),
      "exact_source_labels":len(unique_exact),
      "article_reflexive_or_form_variant_review":len(unique_variant),
      "unmatched_source_labels":len(unique_missing),
      "unmatched_by_letter":dict(sorted(letters.items())),
      "sample_unmatched_for_editor":sorted(unique_missing)[:max(0,min(args.review_limit,55))],
      "sample_variants_for_editor":[r for r in variant[:15]],
      "extraction_debug":debug if args.debug else {"pages_checked":19},
      "limitations":[
        "Source includes principal headwords, derived entries and forms; count is not the official official principal-word count.",
        "Text-layer column geometry can split compounds or misclassify rows; editor must inspect samples against PDF.",
        "An exact label match does not verify the correct translation, plural, register, context or pronunciation.",
        "A related spelling/form is an editorial review cue and is NOT an automatic lexical coverage match.",
        "The full official PDF and its entire headword list are intentionally not redistributed."
      ]
    }
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Official PDF SHA256: {summary['official_pdf_sha256'][:16]}...; pages 9–27")
    print(f"Source lexical rows: {len(official)}; unique candidate labels: {len(official_dedup)}")
    print(f"Local study items: {len(labels)}; distinct strings: {len(all_local)}")
    print(f"Exact labels: {len(unique_exact)}; variants to review: {len(unique_variant)}; unmatched: {len(unique_missing)}")
    print("Sample unmatched terms:",", ".join(summary["sample_unmatched_for_editor"][:22]))
    if args.debug:
        print("Page 9 extraction preview:",json.dumps(debug,ensure_ascii=False))
    return 0

if __name__=="__main__":
    sys.exit(main())
