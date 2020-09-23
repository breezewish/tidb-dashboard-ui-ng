import React from 'react'
import { useScopedTranslation } from './meta'

export interface IExpandProps {
  expanded?: boolean
  collapsedContent?: React.ReactNode
  children: React.ReactNode
}

function Expand({ collapsedContent, children, expanded }: IExpandProps) {
  // TODO: Add animations
  return <div>{expanded ? children : collapsedContent ?? children}</div>
}

export interface IExpandLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  expanded?: boolean
}

function Link({ expanded, ...restProps }: IExpandLinkProps) {
  const { t } = useScopedTranslation()
  return <a {...restProps}>{expanded ? t('collapseText') : t('expandText')}</a>
}

Expand.Link = Link

export default Expand
