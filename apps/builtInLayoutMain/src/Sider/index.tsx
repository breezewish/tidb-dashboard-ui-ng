import { useMount } from 'ahooks'
import { Layout, Menu } from 'antd'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { Services, useServices } from '@tidb-dashboard/core'
import Banner from './Banner'
import styles from './index.module.less'

const { SYSTEM_MENUS } = Services.MenuRegistry

function buildMenuItems(
  items: Readonly<Services.IStructuralMenuItem[]>
): JSX.Element[] {
  const finalItems: JSX.Element[] = []
  items.forEach((item) => {
    const path = Services.Menu.stringifyPath(item.item.path)
    switch (item.item.type) {
      case 'item':
        finalItems.push(
          <Menu.Item key={path} icon={item.item.icon}>
            <Link to={item.item.to} replace={item.item.replace}>
              {path}
            </Link>
          </Menu.Item>
        )
        break
      case 'text_group':
        if (!item.children || item.children.length === 0) {
          return
        }
        finalItems.push(
          <Menu.ItemGroup key={path} title={path}>
            {buildMenuItems(item.children)}
          </Menu.ItemGroup>
        )
        break
      case 'expandable_group':
        if (!item.children || item.children.length === 0) {
          return
        }
        finalItems.push(
          <Menu.SubMenu key={path} title={path} icon={item.item.icon}>
            {buildMenuItems(item.children)}
          </Menu.SubMenu>
        )
    }
  })
  return finalItems
}

function Sider({
  fullWidth,
  defaultCollapsed,
  collapsed,
  collapsedWidth,
  onToggle,
}) {
  useMount(() => {
    console.log('Sider mount')
  })

  const { MenuRegistry } = useServices()

  const mainMenu = MenuRegistry.menus[SYSTEM_MENUS.ID_MAIN].getItems()
  const extraMenu = MenuRegistry.menus[SYSTEM_MENUS.ID_EXTRA].getItems()

  const mainMenuItems = useMemo(() => buildMenuItems(mainMenu), [mainMenu])
  const extraMenuItems = useMemo(() => buildMenuItems(extraMenu), [extraMenu])

  const transSider = useSpring({
    width: collapsed ? collapsedWidth : fullWidth,
  })

  return (
    <animated.div style={transSider}>
      <Layout.Sider
        className={styles.sider}
        width={fullWidth}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={fullWidth}
        defaultCollapsed={defaultCollapsed}
        theme="light"
      >
        <Banner
          collapsed={collapsed}
          onToggle={onToggle}
          fullWidth={fullWidth}
          collapsedWidth={collapsedWidth}
        />
        <Menu mode="inline" style={{ flexGrow: 1 }}>
          {mainMenuItems}
        </Menu>
        <Menu mode="inline">{extraMenuItems}</Menu>
      </Layout.Sider>
    </animated.div>
  )
}

export default Sider
