import { Dropdown, Menu } from 'antd'
import _ from 'lodash'
import React, { ReactNode } from 'react'
import { Services, useGlobalTranslation } from '@tidb-dashboard/core'

function LanguageDropdown({ children }: { children: ReactNode }) {
  // const { i18n } = useGlobalTranslation()

  function handleClick(e) {
    console.log(e.key)
    // i18n.changeLanguage(e.key)
  }

  const menu = (
    <Menu onClick={handleClick} /*selectedKeys={[i18n.language]}*/>
      {_.map(Services.I18NService.SUPPORTED_LANGUAGES, (name, key) => {
        return <Menu.Item key={key}>{name}</Menu.Item>
      })}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      {children}
    </Dropdown>
  )
}

export default LanguageDropdown
