# ArceoConsult

Static bilingual website for ArceoConsult OÜ: business development, market and export development, research and operational support. No financial or investment advisory offering.

## Files

- `index.html`: services, approach, founder and contact form.
- `1on1-consulting.html`: individual business advisory; existing URL preserved.
- `privacy-policy.html`: bilingual privacy information.
- `style.css`: responsive design; no external fonts or UI dependencies.
- `translations.js`: Swedish/English content dictionary.
- `site.js`: language selection, accessible mobile navigation and form handling.

Language order: valid `?lang=sv|en`, consented saved `arceo_lang`, browser language (Swedish → SV; all others → EN). Language selection is carried through internal URLs even without optional storage. Without JavaScript, Swedish content and a native form POST remain available.

## Cookie choices

The bilingual banner offers equal choices: necessary storage only, or optional language memory. No analytics or advertising services are installed. Before an active acceptance, no language preference is stored. `arceo_consent_v1` remembers acceptance/refusal for 180 days; `arceo_lang` is used only with active permission and shares that expiry. Expired records and legacy unconsented language values are removed on the next visit. The visible Cookie settings button and footer link reopen the choices on every page; refusal removes the language value immediately. Browser-blocked storage is handled without claiming the choice was saved.

## Preview

Run `python -m http.server 8800 --bind 127.0.0.1` from this directory and open http://127.0.0.1:8800. There is no build step.

## Contact form

The existing Formspree endpoint is preserved. Success means the form service accepted the POST; it does not verify delivery to an email inbox. No automatic retry is made. Ambiguous network failures are reported as unconfirmed, and completed submissions are locked against accidental duplicates. Test with mocked requests before sending a real enquiry.

The privacy notice describes this site's current data flow. The owner should keep contact details, retention practices and processor arrangements accurate as the business changes.

## Hosting and rollback

GitHub Pages publishes from `main`; `CNAME` retains `www.arceoconsult.com`. Pushes to the publishing branch can immediately change the live site. Preview changes first, then verify the Pages deployment and the live site.

Pre-redesign revision: `641173adcf0f5b1e1d8f3773e04bf425e25916a4`. To roll back, revert the redesign commit on `main` and allow Pages to redeploy. A complete pre-redesign Git bundle was saved outside this repository during the redesign. Avoid force-pushing history.
