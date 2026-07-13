import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES } from "@/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentBase = (i18n.language || "en").split("-")[0];
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentBase) ??
    SUPPORTED_LANGUAGES[0];

  const triggerLabel = t("language.current", {
    value: currentLang.name,
    defaultValue: `${t("language.label")}: ${currentLang.name}`,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          aria-haspopup="menu"
          aria-label={triggerLabel}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[10rem]"
        aria-label={t("language.label")}
      >
        <DropdownMenuRadioGroup
          value={currentBase}
          onValueChange={(value) => i18n.changeLanguage(value)}
        >
          {SUPPORTED_LANGUAGES.map((lng) => (
            <DropdownMenuRadioItem key={lng.code} value={lng.code} lang={lng.code}>
              <span>{lng.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
