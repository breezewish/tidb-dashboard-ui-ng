import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTimeoutFn } from 'react-use'
import styles from './index.module.less'
import { useScopedTranslation } from './meta'

export interface ICopyLinkProps {
  data?: string
}

function CopyLink({ data }: ICopyLinkProps) {
  const { t } = useScopedTranslation()
  const [showCopied, setShowCopied] = useState(false)

  const reset = useTimeoutFn(() => {
    setShowCopied(false)
  }, 1500)[2]

  const handleCopy = () => {
    setShowCopied(true)
    reset()
  }

  return (
    <span>
      {!showCopied && (
        <CopyToClipboard text={data} onCopy={handleCopy}>
          <a>
            {t('text')} <CopyOutlined />
          </a>
        </CopyToClipboard>
      )}
      {showCopied && (
        <span className={styles.copiedText}>
          <CheckOutlined /> {t('success')}
        </span>
      )}
    </span>
  )
}

export default React.memo(CopyLink)
