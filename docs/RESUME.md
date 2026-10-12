# Updating the résumé

1. Edit verified facts in `src/data/resume.json`. The HTML route imports this data directly.
2. Review any new timeline, employment, degree or deployment claim against its evidence.
   Keep independent/client work separate from company contributions. Preserve the distinction
   between an affiliated institute and direct campus attendance. A functional role description
   and project-work period must not imply an unverified formal title or employment start.
3. Run `npm run resume:pdf` (also run automatically by `npm run build`). It generates
   `public/Hamza_Ali_Resume.pdf` with the same data and public contact selection as the site.
4. Run `pdfinfo`, `pdftotext` or a PDF reader; require one readable A4 page, selectable text,
   valid links and no clipping. The generator fails if content exceeds its page bounds.
5. Render the final PDF and visually inspect it. Do not reduce type until it becomes difficult
   to read just to fit one page; revise copy or intentionally design a two-page version instead.
6. Commit the JSON, generator changes (if any) and generated PDF together. Build regeneration
   makes environment-driven public email changes consistent in both formats.
7. Run `npm run check:site` after building and `npm run test:browser` for actual downloads.
   Configure `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` only when using an alternate trusted local
   Chromium binary; otherwise install Playwright's Chromium normally.

The generator uses embedded DejaVu Sans regular/bold fonts, Latin/extended-Latin subsets,
with their license retained in `scripts/fonts/LICENSE.txt`. This ensures portable print and
rendering instead of depending on a viewer's substitute fonts. If future verified content
needs scripts outside that range, update the bundled fonts and render again.

The public PDF response is configured as `application/pdf` with inline disposition so direct
viewing works; the HTML `download` control requests the named file. Verify deployment headers
on the final Preview and production separately from the local static-server test.
