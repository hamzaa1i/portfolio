# Runtime repair and release checkpoint — 13 October 2026

This supersedes the earlier checkpoint where facts differ. Production remains unchanged.

## Runtime fix

The isolated deployable function reproduced the native-binding crash under adapter
11.0.13. Its runtime entry imported adapter build code, which loaded Rolldown even though
its dynamic native binding was not traced. The official **11.0.14** patch separates
zero-import runtime constants from build code and lazy-loads build middleware tooling.
The adapter is pinned to that patch; no framework downgrade or WASM workaround is added.

`npm run build` now runs an isolated packaged-function smoke check as `postbuild`.
It copies the emitted function away from repository dependencies, asserts server chunks
have no build-only imports, clears delivery/security credentials in its child process,
and exercises real request handling: **405, 403, 415, 400, 422, 503**. No real mail is sent.
Existing contact protection and the owner-confirmed published rule are preserved.

## Content and visuals

- Confirmed BSCS/FIST affiliation and 2026 start are in shared résumé data and PDF.
  Functional company responsibilities remain distinct from formal employment chronology.
- Redundant résumé-page view action removed; actual PDF download retained.
- Shared article CSS is loaded by Privacy, fixing missing section/paragraph spacing.
- Unsupported Brand Identity sales impact removed; completed design and printing distinguished.
- Unconfirmed article publication dates omitted. Visible metadata and JSON-LD now consistently
  identify the current modification date; repository presence is not asserted as publication.
- Duplicate theme-color tag removed. Existing About, music and animation systems retained.
- New REVE ONE and legacy ERP SVGs are explicitly **illustrations**, not screenshots.
  See `VISUAL-EVIDENCE.md`. Private captures and sessions have not been published.

## Validation and gates

Fresh unit/SDK tests: **61 passed**. Framework check: **0 errors, 0 warnings, 8 hints**.
Build and isolated function startup passed; site scan: **16 pages, 402 references, no failures**.
Production audit: **zero vulnerabilities**. Full audit: **7 build-tool findings (5 high,
2 moderate)**. These concern controlled build inputs; risk review/remediation remains needed.
PDF: one valid A4 page, selectable text and embedded fonts; final render inspected.
Focused interaction checks: **40 passed**. Changed-page desktop/mobile checks: **77 passed**,
exercising downloads,
spacing, illustrations/lightbox, honest dates and heading completion. The prior 364-assertion
full suite is retained as earlier evidence and is not presented as a fresh run.

Deployed acceptance remains gated by authorized Preview access, actual challenge/rate-limit
behavior, complete delivery and inbound routing. A READY build alone does not establish any
of those. The requested genuine REVE ONE capture set remains unavailable for privacy review.
**Production readiness: NOT READY.** Obtain explicit owner release approval only after the
remaining acceptance gates. Follow `DEPLOYMENT.md`; preserve the current healthy deployment
and Git history for rollback. Private operational evidence stays outside public documentation.
