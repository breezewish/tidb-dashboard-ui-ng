import { useEventListener, useMount } from 'ahooks'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServices } from '@tidb-dashboard/core'

export default function ConfigPortalPage() {
  const { Settings } = useServices()
  const navigate = useNavigate()

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const payload = event.data
      if (typeof payload !== 'object' || payload.name !== 'dashboardRedirect') {
        console.debug('Ignored postMessage event, payload = ', payload)
        return
      }
      console.log('Received postMessage instruction, payload = ', payload)
      if (typeof payload.redirectTarget !== 'string') {
        console.error(
          'Invalid instruction, expect `redirectTarget` to be string'
        )
      }
      if (typeof payload.updateConfigContent !== 'object') {
        console.error(
          'Invalid instruction, expect `updateConfigContent` to be object'
        )
      }
      Settings.updateSettings(payload.updateConfigContent)
      navigate(payload.redirectTarget, { replace: true })
    },
    [Settings, navigate]
  )

  useEventListener('message', handleMessage)

  useMount(() => {
    if (window === window.top) {
      console.warn(
        'ConfigPortal page is not called inside an iframe. It will not work properly.'
      )
    }
    console.debug('Send dashboardLoaded message to parent')
    window.parent.postMessage({ name: 'dashboardLoaded' }, '*')
  })

  return <></>
}
