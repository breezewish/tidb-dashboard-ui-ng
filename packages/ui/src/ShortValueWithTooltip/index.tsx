import { getValueFormat } from '@baurine/grafana-value-formats'
import { Tooltip } from 'antd'
import React from 'react'

export interface IShortValueWithTooltipProps {
  value?: number
  scaledDecimal?: number
}

export default function ShortValueWithTooltip({
  value = 0,
  scaledDecimal = 1,
}: IShortValueWithTooltipProps) {
  return (
    <Tooltip title={value}>
      <span>{getValueFormat('short')(value || 0, 0, scaledDecimal)}</span>
    </Tooltip>
  )
}
