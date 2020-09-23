import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useMemo } from 'react'
import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'
import { useServices } from '@core/services/ContainerContext'

import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'

const SUPPORTED_LANGUAGES = { 'zh-CN': '简体中文', en: 'English' }
const DEFAULT_LANGUAGE = 'en'

i18next.use(LanguageDetector).init({
  resources: {},
  fallbackLng: DEFAULT_LANGUAGE,
  whitelist: Object.keys(SUPPORTED_LANGUAGES),
  interpolation: {
    escapeValue: false,
  },
})

export class I18NService extends BaseService {
  public static SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES
  public static DEFAULT_LANGUAGE = DEFAULT_LANGUAGE

  private _language: string

  public set language(lang: string) {
    this.language = lang
  }

  public get language(): string {
    return this._language
  }

  public constructor(container: ServicesContainer) {
    super(container)
    this._language = i18next.languages[0]
  }

  public static buildScopedNamespace(scope: string): string {
    return `scope.${scope}`
  }

  public static buildGlobalNamespace(): string {
    return `global`
  }

  public static addScopedTranslations(
    scope: string,
    lang: string,
    translations: any
  ) {
    i18next.addResourceBundle(
      lang,
      I18NService.buildScopedNamespace(scope),
      translations,
      true,
      false
    )
  }

  public static addGlobalTranslations(lang: string, translations: any) {
    i18next.addResourceBundle(
      lang,
      I18NService.buildGlobalNamespace(),
      translations,
      true,
      false
    )
  }

  private static iterateBundle(
    bundleContext: __WebpackModuleApi.RequireContext,
    iteratee: (lang: string, translations: any) => void
  ) {
    const keys = bundleContext.keys()
    keys.forEach((key) => {
      const m = key.match(/\/(.+)\.ya?ml/)
      if (!m) {
        return
      }
      const lang = m[1]
      const translations = bundleContext(key)
      iteratee(lang, translations)
    })
  }

  public static addScopedTranslationsBundle(
    scope: string,
    bundleContext: __WebpackModuleApi.RequireContext
  ) {
    I18NService.iterateBundle(bundleContext, (lang, translations) => {
      I18NService.addScopedTranslations(scope, lang, translations)
    })
  }

  public static addGlobalTranslationsBundle(
    bundleContext: __WebpackModuleApi.RequireContext
  ) {
    I18NService.iterateBundle(bundleContext, (lang, translations) => {
      I18NService.addGlobalTranslations(lang, translations)
    })
  }
}

function useTranslation(namespace: string) {
  const { I18N } = useServices()
  const retObj = useMemo(() => {
    return {
      t: i18next.getFixedT(I18N.language, namespace),
    }
  }, [namespace, I18N.language])

  return retObj
}

export function useGlobalTranslation() {
  return useTranslation(I18NService.buildGlobalNamespace())
}

export function buildUseScopedTranslation(scope: string) {
  return () => useTranslation(I18NService.buildScopedNamespace(scope))
}
