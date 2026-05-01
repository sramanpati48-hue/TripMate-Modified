"use client"

import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { localeLabels, supportedLocales, type Locale } from "@/lib/i18n"
import { useI18n } from "@/components/language-provider"

interface LanguageSwitcherProps {
  compact?: boolean
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className={compact ? "w-full" : "w-[170px]"}>
      <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
        <SelectTrigger aria-label={t("common.selectLanguage")} className={compact ? "w-full" : "h-9"}>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder={t("common.language")} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {supportedLocales.map((code) => (
            <SelectItem key={code} value={code}>
              {localeLabels[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
