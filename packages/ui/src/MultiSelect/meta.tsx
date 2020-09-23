import { Services } from '@tidb-dashboard/core'

export const ID = 'built_in.ui.multi_select'

export const useScopedTranslation = Services.buildUseScopedTranslation(ID)

Services.I18NService.addScopedTranslationsBundle(
  ID,
  require.context('./translations/', false, /\.yaml$/)
)
