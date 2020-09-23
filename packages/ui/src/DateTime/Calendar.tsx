import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import React from 'react'
import { Format as LongFormat } from './Long'
import { useScopedTranslation } from './meta'
import { IDateTimeProps } from '.'

dayjs.extend(calendar)
dayjs.extend(localizedFormat)

function Calendar({ unixTimestampMs, ...rest }: IDateTimeProps) {
  return (
    <Tooltip title={<LongFormat unixTimestampMs={unixTimestampMs} />} {...rest}>
      <span>
        <Format unixTimestampMs={unixTimestampMs} />
      </span>
    </Tooltip>
  )
}

export function Format({ unixTimestampMs }: { unixTimestampMs: number }) {
  // TODO: dayjs locale according to translation language
  const { t } = useScopedTranslation()
  return (
    <>
      {dayjs(unixTimestampMs).calendar(undefined, {
        sameDay: t('sameDay'),
        nextDay: t('nextDay'),
        nextWeek: t('nextWeek'),
        lastDay: t('lastDay'),
        lastWeek: t('lastWeek'),
        sameElse: t('sameElse'),
      })}
    </>
  )
}

export default React.memo(Calendar)
