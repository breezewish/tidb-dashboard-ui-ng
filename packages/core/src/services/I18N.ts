import i18next, { i18n } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useTranslation, UseTranslationOptions } from 'react-i18next'
import type { IApp } from '@core/services/AppRegistry'
import { BaseService } from '@core/services/Base'
import type { ServicesContainer } from '@core/services/Container'

export class I18NService extends BaseService {
  private _i18nextInstance: i18n

  public static SUPPORTED_LANGUAGES = { 'zh-CN': '简体中文', en: 'English' }

  public constructor(container: ServicesContainer) {
    super(container)
    this._i18nextInstance = i18next.createInstance()
    this._i18nextInstance.use(LanguageDetector).init({
      resources: {},
      fallbackLng: 'en',
      supportedLngs: Object.keys(I18NService.SUPPORTED_LANGUAGES),
      interpolation: {
        escapeValue: false,
      },
    })
  }

  public get i18nextInstance(): i18n {
    return this._i18nextInstance
  }

  private static buildScopedNamespace(appId: string): string {
    return `app:${appId}`
  }

  private static buildGlobalNamespace(): string {
    return `global`
  }

  public static useGlobalTranslation(options?: UseTranslationOptions) {
    // eslint-disable-next-line
    return useTranslation(I18NService.buildGlobalNamespace(), options)
  }

  public static useScopedTranslationFactory(sourceAppId: string) {
    function useScopedTranslation(options?: UseTranslationOptions) {
      return useTranslation(
        I18NService.buildScopedNamespace(sourceAppId),
        options
      )
    }
    return useScopedTranslation
  }

  public addScopedTranslations(
    sourceApp: IApp,
    lang: string,
    translations: any
  ) {
    this._i18nextInstance.addResourceBundle(
      lang,
      I18NService.buildScopedNamespace(sourceApp.getId()),
      translations,
      true,
      false
    )
  }

  public addGlobalTranslations(lang: string, translations: any) {
    this._i18nextInstance.addResourceBundle(
      lang,
      I18NService.buildGlobalNamespace(),
      translations,
      true,
      false
    )
  }

  private iterateBundle(
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

  public addScopedTranslationsBundle(
    sourceApp: IApp,
    bundleContext: __WebpackModuleApi.RequireContext
  ) {
    this.iterateBundle(bundleContext, (lang, translations) => {
      this.addScopedTranslations(sourceApp, lang, translations)
    })
  }

  public addGlobalTranslationsBundle(
    bundleContext: __WebpackModuleApi.RequireContext
  ) {
    this.iterateBundle(bundleContext, (lang, translations) => {
      this.addGlobalTranslations(lang, translations)
    })
  }
}
