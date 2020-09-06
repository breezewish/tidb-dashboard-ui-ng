import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'

import dayjs from 'dayjs'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18next.on('languageChanged', (lng) => {
  dayjs.locale(lng.toLowerCase())
})

export function addTranslations(
  requireContext: __WebpackModuleApi.RequireContext
) {
  // if (typeof requireContext === 'object') {
  //   Object.keys(requireContext).forEach((key) => {
  //     const translations = requireContext[key]
  //     addTranslationResource(key, translations)
  //   })
  //   return
  // }

  const keys = requireContext.keys()
  keys.forEach((key) => {
    const m = key.match(/\/(.+)\.yaml/)
    if (!m) {
      return
    }
    const lang = m[1]
    const translations = requireContext(key)
    addTranslationResource(lang, translations)
  })
}

export function addTranslationResource(lang: string, translations: any) {
  i18next.addResourceBundle(lang, 'translation', translations, true, false)
}

export const ALL_LANGUAGES = {
  zh: '简体中文',
  en: 'English',
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {},
    fallbackLng: 'en',
    whitelist: ['zh', 'en'],
    interpolation: {
      escapeValue: false,
    },
  })
