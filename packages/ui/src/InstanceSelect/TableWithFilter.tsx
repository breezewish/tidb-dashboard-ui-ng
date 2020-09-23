import { useSize } from 'ahooks'
import { Input } from 'antd'
import cx from 'classnames'
import {
  ScrollablePane,
  DetailsListLayoutMode,
  ISelection,
  IDetailsListProps,
  MarqueeSelection,
  SelectionMode,
} from 'office-ui-fabric-react'
import React, { useMemo, useCallback, useRef } from 'react'
import { MemoDetailsList } from '../'
import styles from './TableWithFilter.module.less'

export interface ITableWithFilterProps extends IDetailsListProps {
  selection: ISelection
  filterPlaceholder?: string
  filter?: string
  onFilterChange?: (value: string) => void
  tableMaxHeight?: number
  tableWidth?: number
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

export interface ITableWithFilterRefProps {
  focusFilterInput: () => void
}

function TableWithFilter(
  {
    selection,
    filterPlaceholder,
    filter,
    onFilterChange,
    tableMaxHeight,
    tableWidth,
    containerClassName,
    containerStyle,
    ...restProps
  }: ITableWithFilterProps,
  ref: React.Ref<ITableWithFilterRefProps>
) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange?.(e.target.value)
    },
    [onFilterChange]
  )

  const inputRef = useRef<Input>(null)

  React.useImperativeHandle(ref, () => ({
    focusFilterInput() {
      inputRef.current?.focus()
    },
  }))

  // FIXME: We should put Input inside ScrollablePane after https://github.com/microsoft/fluentui/issues/13557 is resolved

  const containerRef = useRef<HTMLDivElement>(null)
  const containerState = useSize(containerRef)

  const paneStyle = useMemo(
    () =>
      ({
        position: 'relative',
        height: containerState.height,
        maxHeight: tableMaxHeight ?? 400,
        width: tableWidth ?? 400,
      } as React.CSSProperties),
    [containerState.height, tableMaxHeight, tableWidth]
  )

  return (
    <div
      className={cx(styles.tableWithFilterContainer, containerClassName)}
      style={containerStyle}
      data-e2e="table-with-filter"
    >
      <Input
        placeholder={filterPlaceholder}
        allowClear
        onChange={handleInputChange}
        value={filter}
        ref={inputRef}
      />
      <ScrollablePane style={paneStyle}>
        <div ref={containerRef}>
          <MarqueeSelection selection={selection} isDraggingConstrainedToRoot>
            <MemoDetailsList
              selectionMode={SelectionMode.multiple}
              selection={selection}
              selectionPreservedOnEmptyClick
              layoutMode={DetailsListLayoutMode.justified}
              setKey="set"
              compact
              {...restProps}
            />
          </MarqueeSelection>
        </div>
      </ScrollablePane>
    </div>
  )
}

export default React.memo(React.forwardRef(TableWithFilter))
