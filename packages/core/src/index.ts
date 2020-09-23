import 'systemjs'

import './initFabricTheme'

export * as API from '@tidb-dashboard/api'
export * as Services from '@core/services'
export {
  ServicesContainer,
  useServices,
  useGlobalTranslation,
} from '@core/services'
export type { IApp } from '@core/services'
export { default as SelectionWithFilter } from '@core/selectionWithFilter'
export { useBatchClientRequest, useClientRequest } from '@core/useClientRequest'
export * as CoreUtils from './utils'

export const SystemJs = System
