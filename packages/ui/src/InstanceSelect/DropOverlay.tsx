import { IColumn, ISelection } from 'office-ui-fabric-react'
import React, { useState, useMemo } from 'react'
import { CoreUtils } from '@tidb-dashboard/core'
import { AntCheckboxGroupHeader } from '../'
import TableWithFilter, { ITableWithFilterRefProps } from './TableWithFilter'
import { useScopedTranslation } from './meta'

const groupProps = {
  onRenderHeader: (props) => <AntCheckboxGroupHeader {...props} />,
}

const containerStyle = { fontSize: '0.8rem' }

export interface IDropOverlayProps {
  selection: ISelection
  columns: IColumn[]
  items: CoreUtils.IInstanceTableItem[]
  filterTableRef?: React.Ref<ITableWithFilterRefProps>
}

function DropOverlay({
  selection,
  columns,
  items,
  filterTableRef,
}: IDropOverlayProps) {
  const { t } = useScopedTranslation()
  const [keyword, setKeyword] = useState('')

  const [finalItems, finalGroups] = useMemo(() => {
    return CoreUtils.filterInstanceTable(items, keyword)
  }, [items, keyword])

  return (
    <TableWithFilter
      selection={selection}
      filterPlaceholder={t('filterPlaceholder')}
      filter={keyword}
      onFilterChange={setKeyword}
      tableMaxHeight={300}
      tableWidth={400}
      columns={columns}
      items={finalItems}
      groups={finalGroups}
      groupProps={groupProps}
      containerStyle={containerStyle}
      ref={filterTableRef}
    />
  )
}

export default React.memo(DropOverlay)
