import { Badge } from 'antd'
import React from 'react'
import { CoreUtils } from '@tidb-dashboard/core'
import { useScopedTranslation } from './meta'

export interface IInstanceStatusBadgeProps {
  status?: number
}

function InstanceStatusBadge({ status }: IInstanceStatusBadgeProps) {
  const { t } = useScopedTranslation()
  switch (status) {
    case CoreUtils.InstanceStatus.Down:
      return <Badge status="error" text={t('status.down')} />
    case CoreUtils.InstanceStatus.Unreachable:
      return <Badge status="error" text={t('status.unreachable')} />
    case CoreUtils.InstanceStatus.Up:
      return <Badge status="success" text={t('status.up')} />
    case CoreUtils.InstanceStatus.Tombstone:
      return <Badge status="default" text={t('status.tombstone')} />
    case CoreUtils.InstanceStatus.Offline:
      return <Badge status="processing" text={t('status.offline')} />
    default:
      return <Badge status="error" text={t('status.unknown')} />
  }
}

export default React.memo(InstanceStatusBadge)
