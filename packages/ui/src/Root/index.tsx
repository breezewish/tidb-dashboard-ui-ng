import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import enUS from 'antd/es/locale/en_US'
// import zhCN from 'antd/es/locale/zh_CN'
import {
  Customizations,
  createTheme,
  registerIcons,
} from 'office-ui-fabric-react'
import React from 'react'
// import { useTranslation } from '@tidb-dashboard/core'

registerIcons({
  icons: {
    SortUp: <ArrowUpOutlined />,
    SortDown: <ArrowDownOutlined />,
    chevronrightmed: <RightOutlined />,
    tag: <DownOutlined />,
  },
})

const theme = createTheme({
  defaultFontStyle: { fontFamily: 'inherit', fontSize: '1em' },
})

Customizations.applySettings({ theme })

export default function Root({ children }) {
  // TODO
  // const { i18n } = useTranslation()
  return (
    // <ConfigProvider locale={i18n.language === 'en' ? enUS : zhCN}>
    <ConfigProvider locale={enUS}>{children}</ConfigProvider>
  )
}
