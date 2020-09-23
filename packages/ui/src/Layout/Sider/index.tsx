// import { ExperimentOutlined, BugOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
// import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
// import { InfoWhoAmIResponse } from '@tidb-dashboard/api'
// import { useClientRequest, useServices } from '@tidb-dashboard/core'
// import { useScopedTranslation } from '../meta'
import Banner from './Banner'
import styles from './index.module.less'

// function useAppMenuItem(registry, appId, title?: string) {
//   const { t } = useScopedTranslation()
//   const app = registry.apps[appId]
//   if (!app) {
//     return null
//   }
//   return (
//     <Menu.Item key={appId}>
//       <Link to={app.indexRoute} id={appId}>
//         {app.icon ? <app.icon /> : null}
//         <span>{title ? title : t(`${appId}.nav_title`, appId)}</span>
//       </Link>
//     </Menu.Item>
//   )
// }

// function useActiveAppId(registry) {
//   const [appId, set] = useState('')
//   useEventListener('single-spa:routing-event', () => {
//     const activeApp = registry.getActiveApp()
//     if (activeApp) {
//       set(activeApp.id)
//     }
//   })
//   return appId
// }

// function useCurrentLogin() {
//   const [login, setLogin] = useState<InfoWhoAmIResponse | null>(null)
//   const { ApiClient } = useServices()
//   useEffect(() => {
//     async function fetch() {
//       const resp = await ApiClient.default.infoWhoami()
//       if (resp.data) {
//         setLogin(resp.data)
//       }
//     }
//     fetch()
//   }, [ApiClient])
//   return login
// }

function Sider({
  // registry,
  fullWidth,
  defaultCollapsed,
  collapsed,
  collapsedWidth,
  onToggle,
  animationDelay,
}) {
  // const { t } = useScopedTranslation()
  // // const activeAppId = useActiveAppId(registry)
  // const currentLogin = useCurrentLogin()
  // const { ApiClient } = useServices()

  // const { data } = useClientRequest((cancelToken) =>
  //   ApiClient.default.infoGet({ cancelToken })
  // )

  // const debugSubMenuItems = [useAppMenuItem(registry, 'instance_profiling')]
  // const debugSubMenu = (
  //   <Menu.SubMenu
  //     key="debug"
  //     title={
  //       <span>
  //         <BugOutlined />
  //         <span>{t('nav.sider.debug')}</span>
  //       </span>
  //     }
  //   >
  //     {debugSubMenuItems}
  //   </Menu.SubMenu>
  // )

  // const experimentalSubMenuItems = [
  //   useAppMenuItem(registry, 'query_editor'),
  //   useAppMenuItem(registry, 'configuration'),
  // ]
  // const experimentalSubMenu = (
  //   <Menu.SubMenu
  //     key="experimental"
  //     title={
  //       <span>
  //         <ExperimentOutlined />
  //         <span>{t('nav.sider.experimental')}</span>
  //       </span>
  //     }
  //   >
  //     {experimentalSubMenuItems}
  //   </Menu.SubMenu>
  // )

  // const menuItems = [
  //   useAppMenuItem(registry, 'overview'),
  //   useAppMenuItem(registry, 'cluster_info'),
  //   useAppMenuItem(registry, 'keyviz'),
  //   useAppMenuItem(registry, 'statement'),
  //   useAppMenuItem(registry, 'slow_query'),
  //   useAppMenuItem(registry, 'diagnose'),
  //   useAppMenuItem(registry, 'search_logs'),
  //   debugSubMenu,
  // ]

  // if (data?.enable_experimental) {
  //   menuItems.push(experimentalSubMenu)
  // }

  // let displayName = currentLogin?.username ?? '...'
  // if (currentLogin?.is_shared) {
  //   displayName += ' (Shared)'
  // }

  // const extraMenuItems = [
  //   useAppMenuItem(registry, 'dashboard_settings'),
  //   useAppMenuItem(registry, 'user_profile', displayName),
  // ]

  const transSider = useSpring({
    width: collapsed ? collapsedWidth : fullWidth,
  })

  const defaultOpenKeys = useMemo(() => {
    if (defaultCollapsed) {
      return []
    } else {
      return ['debug', 'experimental']
    }
  }, [defaultCollapsed])

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
        <Menu
          subMenuOpenDelay={animationDelay}
          subMenuCloseDelay={animationDelay}
          mode="inline"
          // selectedKeys={[activeAppId]}
          style={{ flexGrow: 1 }}
          defaultOpenKeys={defaultOpenKeys}
        >
          {/* {menuItems} */}
        </Menu>
        <Menu
          subMenuOpenDelay={animationDelay + 200}
          subMenuCloseDelay={animationDelay + 200}
          mode="inline"
          // selectedKeys={[activeAppId]}
        >
          {/* {extraMenuItems} */}
        </Menu>
      </Layout.Sider>
    </animated.div>
  )
}

export default Sider
