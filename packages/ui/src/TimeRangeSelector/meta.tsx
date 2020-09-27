import { Services } from '@tidb-dashboard/core'

export const ID = 'built_in.ui.time_range_selector'

export const useScopedTranslation = Services.buildUseScopedTranslation(ID)

Services.I18N.addScopedTranslationsBundle(
  ID,
  require.context('./translations/', false, /\.yaml$/)
)
