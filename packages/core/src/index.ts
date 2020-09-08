export { default as i18next } from 'i18next'
export { useTranslation } from 'react-i18next'

// TODO: Simplify it after https://github.com/egoist/esbuild-loader/issues/40 is resolved
import * as _I18N from './i18n'
export const I18N = _I18N
import * as _Registry from './registry'
export const Registry = _Registry

export { DefaultAppRegistry } from './registry'
export { default as SelectionWithFilter } from './selectionWithFilter'
