import { Services } from '@tidb-dashboard/core'

export const ID = 'built_in.ui.date_time'

export const useScopedTranslation = Services.buildUseScopedTranslation(ID)

Services.I18N.addScopedTranslationsBundle(
  ID,
  require.context('./translations/', false, /\.yaml$/)
)
