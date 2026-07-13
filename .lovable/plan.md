## Goal
Confirm that the `legal.englishNotice` banner and the H1 titles on Privacy Policy, Terms of Service, Trading Rules, and About render in the selected language on every language switch — then fix anything that doesn't.

## Current state (from exploration)
- All four pages already call `useTranslation()` and render titles via `t("pages.<page>.title")` and the banner via `t("legal.englishNotice")`.
- All 10 locale files (`en, es, ja, de, vi, ko, fr, ar, hi, ru`) contain non-empty values for `legal.englishNotice`, `pages.privacy.title`, `pages.terms.title`, `pages.tradingRules.title`, `pages.tradingRules.subtitle`, `pages.about.title`, `pages.about.subtitle`.
- `src/i18n/index.ts` re-renders on `languageChanged` and applies `<html lang>` / `dir` (RTL for `ar`).

So the wiring looks correct. The remaining risk is (a) a stale cache after language switch, (b) a subtitle/body still hardcoded in English, or (c) a locale value that is silently identical to English.

## Steps

1. **Automated parity check (script, no runtime cost).** Add a tiny node script (or run inline) that loads every `src/i18n/locales/*.json`, asserts every required legal key exists, is a string, and is not identical to the English version for non-English locales. Fix any gap it reports.

2. **Runtime verification via Playwright.** For each locale in `[en, es, ja, ar, ru]` (covers Latin, CJK, RTL, Cyrillic):
   - Set `localStorage.streamwalkers.language` before navigation.
   - Visit `/privacy-policy`, `/terms-of-service`, `/trading-rules`, `/about`.
   - Screenshot the header region and assert the H1 text and banner text match the expected locale string from the JSON.
   - Confirm `<html lang>` and `dir` update (rtl for `ar`).

3. **Patch any regressions found.** Likely candidates if verification fails:
   - Add `Suspense` fallback around routed pages if the JSON load races the first paint (currently synchronous imports, so unlikely).
   - Force re-render on language change by keying `MarketingLayout` on `i18n.language` if screenshots show stale text.
   - Replace any remaining hardcoded English strings in the four page bodies (subtitle, section headings) with `t()` keys and add missing entries to every locale file.

4. **Report** the verification screenshots inline so you can confirm the switch visibly works before we consider this closed.

## Out of scope
- Translating the long-form legal body copy (spec keeps body in English; only titles + banner must translate).
- Any change to the theme toggle or non-legal marketing pages.
