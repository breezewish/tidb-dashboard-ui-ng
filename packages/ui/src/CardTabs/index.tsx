import { Tabs } from 'antd'
import type { TabsProps } from 'antd/es/tabs'
import cx from 'classnames'
import React from 'react'
import styles from './index.module.less'

export interface ICardTabsProps extends TabsProps {
  className?: string
  children?: React.ReactNode
}

function CardTabs({ className, children, ...restProps }: ICardTabsProps) {
  const c = cx(styles.tabs, className)
  return (
    <Tabs className={c} {...restProps}>
      {children}
    </Tabs>
  )
}

CardTabs.TabPane = Tabs.TabPane

export default CardTabs
