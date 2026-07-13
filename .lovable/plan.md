## Goal
Improve keyboard + screen-reader semantics on `ThemeToggle` and `LanguageSwitcher` without changing layout, tokens, or behavior.

## Current gaps
- Triggers are icon-only shadcn Buttons. They have `aria-label` but no `aria-haspopup`/dynamic value announcement of the current selection.
- Menu items convey selection with a `●` glyph only — screen readers get no "selected" state and no color-independent cue beyond a bullet character.
- Tap targets are `size="icon"` (36×36), below the 44×44 mobile guideline.
- Dropdown content has no accessible label tying it to the trigger.
- The trigger `aria-label` doesn't announce the current theme/language, so a screen-reader user hears only "Theme" / "Language".

## Changes

### `src/components/ThemeToggle.tsx`
- Trigger: add `min-h-11 min-w-11`, `aria-haspopup="menu"`, and a dynamic `aria-label` like `Theme: Dark. Change theme.` using `t("theme.label")` + resolved theme name. Remove redundant `sr-only` duplicate.
- Wrap items in an `aria-label`ed group via `DropdownMenuContent aria-label={t("theme.label")}`.
- Replace each `DropdownMenuItem` with `DropdownMenuRadioGroup` + `DropdownMenuRadioItem` (shadcn/Radix already ships this and it emits `role="menuitemradio"` + `aria-checked`). Fall back to `aria-checked` on `DropdownMenuItem` with `role="menuitemradio"` if radio primitives aren't exported. Keep icons + labels; drop the `●` glyph.
- Ensure `focus-visible` ring is present (inherits from shadcn Button — verify no override).

### `src/components/LanguageSwitcher.tsx`
- Trigger: same tap-target + `aria-haspopup="menu"`; dynamic `aria-label` announcing current language (e.g. `Language: English. Change language.`).
- `DropdownMenuContent`: add `aria-label={t("language.label")}`.
- Convert items to `DropdownMenuRadioGroup` / `DropdownMenuRadioItem` bound to `currentBase`, with `onValueChange={i18n.changeLanguage}`. Each item gets `lang={lng.code}` so assistive tech pronounces native names correctly, and `aria-label` combining English + native name when they differ.
- Drop the `●` glyph in favor of the radio-item check indicator.

### `src/i18n/locales/*.json`
- Add two new keys under `theme` and `language`:
  - `theme.current` → `"Theme: {{value}}. Change theme."`
  - `language.current` → `"Language: {{value}}. Change language."`
- Translate both across all 10 locales (en, es, ja, de, vi, ko, fr, ar, hi, ru).

### Verification
- `tsgo` for typecheck.
- Playwright: open `/`, tab to each trigger, assert `aria-label` announces current value, open menu with Enter, arrow through items, assert `aria-checked="true"` on the active item, press Enter to switch, re-open and confirm the checked item moved. Screenshot both open menus in light + dark.

## Out of scope
- Visual redesign, new icons, or moving the controls in the nav.
- Changing dropdown-menu primitives beyond swapping `Item` → `RadioItem`.
