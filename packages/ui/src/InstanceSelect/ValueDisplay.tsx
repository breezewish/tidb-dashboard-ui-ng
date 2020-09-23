import React, { useMemo } from 'react'
import { CoreUtils } from '@tidb-dashboard/core'
import { useScopedTranslation } from './meta'

interface InstanceStat {
  all: number
  selected: number
}

function newInstanceStat(): InstanceStat {
  return {
    all: 0,
    selected: 0,
  }
}

export interface IValueDisplayProps {
  items: CoreUtils.IInstanceTableItem[]
  selectedKeys: string[]
}

export default function ValueDisplay({
  items,
  selectedKeys,
}: IValueDisplayProps) {
  const { t } = useScopedTranslation()

  const text = useMemo(() => {
    const selectedKeysMap = {}
    selectedKeys.forEach((key) => (selectedKeysMap[key] = true))
    const instanceStats: { [key in CoreUtils.InstanceKind]: InstanceStat } = {
      pd: newInstanceStat(),
      tidb: newInstanceStat(),
      tikv: newInstanceStat(),
      tiflash: newInstanceStat(),
    }
    items.forEach((item) => {
      instanceStats[item.instanceKind].all++
      if (selectedKeysMap[item.key]) {
        instanceStats[item.instanceKind].selected++
      }
    })

    let hasUnselected = false
    const p: string[] = []
    for (const ik in instanceStats) {
      const stats = instanceStats[ik] as InstanceStat
      if (stats.selected !== stats.all) {
        hasUnselected = true
      }
      if (stats.selected > 0) {
        if (stats.all === stats.selected) {
          p.push(
            t('selected.partial.all', {
              component: CoreUtils.InstanceKindName[ik],
            })
          )
        } else {
          p.push(
            t('selected.partial.n', {
              n: stats.selected,
              component: CoreUtils.InstanceKindName[ik],
            })
          )
        }
      }
    }

    if (!hasUnselected) {
      return t('selected.all')
    }

    return p.join(', ')
  }, [t, items, selectedKeys])

  return <>{text}</>
}
