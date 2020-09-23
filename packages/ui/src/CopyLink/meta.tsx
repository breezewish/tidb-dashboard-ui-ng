import { Services } from '@tidb-dashboard/core'

export const ID = 'built_in.ui.copy_link'

export const useScopedTranslation = Services.buildUseScopedTranslation(ID)

Services.I18NService.addScopedTranslationsBundle(
  ID,
  require.context('./translations/', false, /\.yaml$/)
)
