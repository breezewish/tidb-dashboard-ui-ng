import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import React from 'react'
import { IDateTimeProps } from '.'

dayjs.extend(localizedFormat)

function Long({ unixTimestampMs, ...rest }: IDateTimeProps) {
  return (
    <Tooltip title={<Format unixTimestampMs={unixTimestampMs} />} {...rest}>
      <span>
        <Format unixTimestampMs={unixTimestampMs} />
      </span>
    </Tooltip>
  )
}

export function Format({ unixTimestampMs }: { unixTimestampMs: number }) {
  // TODO: dayjs locale according to translation language
  return <>{dayjs(unixTimestampMs).format('ll LTS')}</>
}

export default React.memo(Long)
