import 'systemjs'
import { I18NService } from './services/I18N'

export * as API from '@tidb-dashboard/api'
export * as Services from '@core/services'
export { ServicesContainer, useServices } from '@core/services'
export type { IApp } from '@core/services'
export { default as SelectionWithFilter } from '@core/selectionWithFilter'

export const useGlobalTranslation = I18NService.useGlobalTranslation
export const useScopedTranslationFactory =
  I18NService.useScopedTranslationFactory

export const SystemJs = System
