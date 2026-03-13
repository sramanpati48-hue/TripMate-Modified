"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { DEFAULT_LOCALE, getTranslation, rtlLocales, supportedLocales, type Locale } from "@/lib/i18n"

const LOCALE_STORAGE_KEY = "tripmate-locale"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE
  }

  const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (saved && supportedLocales.includes(saved as Locale)) {
    return saved as Locale
  }

  const browserLocale = navigator.language?.split("-")[0] as Locale | undefined
  if (browserLocale && supportedLocales.includes(browserLocale)) {
    return browserLocale
  }

  return DEFAULT_LOCALE
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setLocale(resolveInitialLocale())
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)

    document.documentElement.lang = locale
    document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr"
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string, vars?: Record<string, string | number>) => getTranslation(locale, key, vars),
    }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider")
  }

  return context
}
