# Portfolio release and rollback runbook

This repository contains the release candidate. Production changes require the owner's
explicit authorization. Keep the existing feature branch and PR; do not reset history,
force-push, merge the superseded PR, or promote an unreviewed deployment.

## Local validation

Use the runtime specified by `package.json`. Run `npm ci`, `npm test`, `npm run check`,
`npm run build`, `npm run check:site` and `npm run test:browser` with a supported browser.
The build regenerates the résumé PDF from shared data. Inspect its extracted text and
rendered page whenever résumé facts change. Review the full dependency audit separately
from the production-only audit. There is no separate lint script.

## Preview acceptance gates

1. Verify that the deployment corresponds to the reviewed PR head and is healthy. Inspect
   build/runtime logs through an authorized account. Preserve deployment protection.
2. Review environment configuration separately for Preview and Production without exposing
   credentials or notification addresses in issues, logs or public documentation.
3. Prove server-side challenge verification, hostname/action validation, request bounds,
   rate limiting, retries and accessible failure states on the actual Preview endpoint.
4. Submit a uniquely named test inquiry and independently confirm receipt at every intended
   destination, including the reply address. Provider acceptance alone is insufficient.
5. Verify inbound routing before changing the public email address; retain the working
   direct-email fallback until that evidence exists.
6. Recheck desktop/mobile navigation, project pages, résumé HTML/PDF headers and downloads,
   music filters/search/playback, keyboard tools, themes, reduced motion and missing routes.
7. Verify Preview noindex behavior, canonical metadata, domain HTTPS and redirects.
8. Resolve factual résumé questions and document outstanding dependency risks. Record the
   current healthy Production deployment and approved configuration for rollback privately.

Account access, provider configuration or inbox evidence that cannot be verified remains
a release gate. Local mocks and static browser tests do not replace deployed acceptance.

## Authorized launch

1. Obtain explicit owner approval after the acceptance gates are satisfied.
2. Apply only reviewed release configuration through authorized provider interfaces.
3. Merge the reviewed PR into `main`; let the existing Git integration deploy that commit.
4. Verify the deployment commit and target before testing the public domain.
5. Check HTTPS/redirects, indexing/canonical metadata, assets, all primary routes and résumé
   download headers. Exercise desktop/mobile interactions on cold and warm loads.
6. Submit a production inquiry and confirm every intended inbox and reply address.
7. Monitor runtime errors and provider delivery; keep the previous healthy deployment available.

## Rollback

1. Use the provider's supported rollback operation to restore the privately recorded healthy
   Production deployment. Verify the domain, navigation, assets and contact behavior.
2. Rollback does not automatically undo DNS, environment or firewall edits. Restore only
   specific approved settings from the private pre-release record when necessary.
3. Check whether rollback paused automatic production domain assignment; review a corrected
   deployment before restoring automatic releases.
4. Revert the release merge through a new GitHub revert PR so `main` reflects served code.
   Preserve history; do not reset or force-push.
5. Diagnose the problem and complete a new Preview acceptance cycle before re-release.
