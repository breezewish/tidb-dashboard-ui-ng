import {
  DownOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import Flexbox from '@g07cha/flexbox-react'
import { usePersistFn } from 'ahooks'
import { Form, Input, Button, message, Typography } from 'antd'
import cx from 'classnames'
import CSSMotion from 'rc-animate/es/CSSMotion'
import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useMount } from 'react-use'
import { API, useGlobalTranslation, useServices } from '@tidb-dashboard/core'
import { Root, AppearAnimate, LanguageDropdown } from '@tidb-dashboard/ui'
import { useScopedTranslation } from '../app'
import * as auth from '../utils/auth'
import styles from './SignIn.module.less'
import Logo from './logo.svg'

enum DisplayFormType {
  tidbCredential,
  shareCode,
}

function AlternativeAuthLink({ onClick }) {
  const { t } = useScopedTranslation()
  return (
    <div className={cx(styles.extraLink, styles.clickable)}>
      <a onClick={onClick}>
        <LockOutlined /> {t('signin.form.use_alternative')}
      </a>
    </div>
  )
}

function LanguageDrop() {
  return (
    <div className={styles.extraLink}>
      <LanguageDropdown>
        <a>
          <GlobalOutlined /> Switch Language <DownOutlined />
        </a>
      </LanguageDropdown>
    </div>
  )
}

interface IAlternativeFormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  description: string
  className?: string
}

function AlternativeFormButton({
  title,
  description,
  className,
  ...restProps
}: IAlternativeFormButtonProps) {
  return (
    <button className={cx(className, styles.alternativeButton)} {...restProps}>
      <div className={styles.title}>{title}</div>
      <div>
        <Typography.Text type="secondary">
          <small>{description}</small>
        </Typography.Text>
      </div>
      <div className={styles.icon}>
        <ArrowRightOutlined />
      </div>
    </button>
  )
}

function AlternativeAuthForm({
  className,
  onClose,
  onSwitchForm,
  ...restProps
}) {
  const { t } = useScopedTranslation()

  return (
    <div className={cx(className, styles.alternativeFormLayer)} {...restProps}>
      <div className={styles.dialogContainer}>
        <div className={styles.dialog}>
          <Form>
            <Form.Item>
              <h2>
                <Flexbox
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>{t('signin.form.alternative.title')}</div>
                  <button
                    className={styles.alternativeCloseButton}
                    onClick={onClose}
                  >
                    <CloseOutlined />
                  </button>
                </Flexbox>
              </h2>
            </Form.Item>
            <Form.Item>
              <AlternativeFormButton
                title={t('signin.form.tidb_auth.switch.title')}
                description={t('signin.form.tidb_auth.switch.description')}
                onClick={() => onSwitchForm(DisplayFormType.tidbCredential)}
              />
            </Form.Item>
            <Form.Item>
              <AlternativeFormButton
                title={t('signin.form.code_auth.switch.title')}
                description={t('signin.form.code_auth.switch.description')}
                onClick={() => onSwitchForm(DisplayFormType.shareCode)}
              />
            </Form.Item>
            <LanguageDrop />
          </Form>
        </div>
      </div>
    </div>
  )
}

function useSignInSubmit(
  successRoute,
  fnLoginForm: (form) => API.UserAuthenticateForm,
  onFailure: () => void
) {
  const { ApiClient } = useServices()
  const navigate = useNavigate()
  const { t } = useScopedTranslation()
  const { t: tg } = useGlobalTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearErrorMsg = useCallback(() => {
    setError(null)
  }, [])

  const handleSubmit = usePersistFn(async (form) => {
    setLoading(true)
    clearErrorMsg()

    try {
      const r = await ApiClient.default.userLogin(fnLoginForm(form))
      auth.setAuthToken(r.data.token)
      message.success(t('signin.message.success'))
      navigate(successRoute)
    } catch (e) {
      console.log(e)
      if (!e.handled) {
        let msg
        if (e.response?.data?.code) {
          msg = tg(e.response.data.code)
        } else {
          msg = e.message
        }
        setError(t('signin.message.error', { msg }))
        onFailure()
      }
    }
    setLoading(false)
  })

  return { handleSubmit, loading, errorMsg: error, clearErrorMsg }
}

function TiDBSignInForm({ successRoute, onClickAlternative }) {
  const { t } = useScopedTranslation()

  const [refForm] = Form.useForm()
  const refPassword = useRef<Input>(null)

  const { handleSubmit, loading, errorMsg, clearErrorMsg } = useSignInSubmit(
    successRoute,
    (form) => ({
      username: form.username,
      password: form.password,
      type: 0,
    }),
    () => {
      refForm.setFieldsValue({ password: '' })
      setTimeout(() => {
        refPassword.current?.focus()
      }, 0)
    }
  )

  useMount(() => {
    refPassword?.current?.focus()
  })

  return (
    <div className={styles.dialogContainer}>
      <div className={styles.dialog}>
        <Form
          name="tidb_signin"
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ username: 'root' }}
          form={refForm}
        >
          <Logo className={styles.logo} />
          <Form.Item>
            <h2>{t('signin.form.tidb_auth.title')}</h2>
          </Form.Item>
          <Form.Item
            name="username"
            label={t('signin.form.username')}
            rules={[{ required: true }]}
          >
            <Input onInput={clearErrorMsg} prefix={<UserOutlined />} disabled />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('signin.form.password')}
            {...(errorMsg && {
              help: errorMsg,
              validateStatus: 'error',
            })}
          >
            <Input
              prefix={<KeyOutlined />}
              type="password"
              disabled={loading}
              onInput={clearErrorMsg}
              ref={refPassword}
            />
          </Form.Item>
          <Form.Item>
            <Button
              id="signin_btn"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.signInButton}
              block
            >
              {t('signin.form.button')}
            </Button>
          </Form.Item>
          <AlternativeAuthLink onClick={onClickAlternative} />
          <LanguageDrop />
        </Form>
      </div>
    </div>
  )
}

function CodeSignInForm({ successRoute, onClickAlternative }) {
  const { t } = useScopedTranslation()

  const [refForm] = Form.useForm()
  const refPassword = useRef<Input>(null)

  const { handleSubmit, loading, errorMsg, clearErrorMsg } = useSignInSubmit(
    successRoute,
    (form) => ({
      password: form.code,
      type: 1,
    }),
    () => {
      refForm.setFieldsValue({ code: '' })
      setTimeout(() => {
        refPassword.current?.focus()
      }, 0)
    }
  )

  useMount(() => {
    refPassword?.current?.focus()
  })

  return (
    <div className={styles.dialogContainer}>
      <div className={styles.dialog}>
        <Form onFinish={handleSubmit} layout="vertical" form={refForm}>
          <Logo className={styles.logo} />
          <Form.Item>
            <h2>{t('signin.form.code_auth.title')}</h2>
          </Form.Item>
          <Form.Item
            name="code"
            label={t('signin.form.code_auth.code')}
            {...(errorMsg && {
              help: errorMsg,
              validateStatus: 'error',
            })}
          >
            <Input
              prefix={<KeyOutlined />}
              type="password"
              onInput={clearErrorMsg}
              disabled={loading}
              ref={refPassword}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.signInButton}
              block
            >
              {t('signin.form.button')}
            </Button>
          </Form.Item>
          <AlternativeAuthLink onClick={onClickAlternative} />
          <LanguageDrop />
        </Form>
      </div>
    </div>
  )
}

function App() {
  const [alternativeVisible, setAlternativeVisible] = useState(false)
  const [formType, setFormType] = useState(DisplayFormType.tidbCredential)

  const handleClickAlternative = useCallback(() => {
    setAlternativeVisible(true)
  }, [])

  const handleAlternativeClose = useCallback(() => {
    setAlternativeVisible(false)
  }, [])

  const handleSwitchForm = useCallback((k: DisplayFormType) => {
    setFormType(k)
    setAlternativeVisible(false)
  }, [])

  const successRoute = '/'

  return (
    <Root>
      <div className={styles.container}>
        <AppearAnimate
          className={styles.contantContainer}
          motionName="formAnimation"
        >
          <CSSMotion visible={alternativeVisible} motionName="fade">
            {({ style, className }) => (
              <AlternativeAuthForm
                style={style}
                className={className}
                onClose={handleAlternativeClose}
                onSwitchForm={handleSwitchForm}
              />
            )}
          </CSSMotion>
          {formType === DisplayFormType.tidbCredential && (
            <TiDBSignInForm
              successRoute={successRoute}
              onClickAlternative={handleClickAlternative}
            />
          )}
          {formType === DisplayFormType.shareCode && (
            <CodeSignInForm
              successRoute={successRoute}
              onClickAlternative={handleClickAlternative}
            />
          )}
        </AppearAnimate>
        <AppearAnimate
          className={styles.landing}
          motionName="landingAnimation"
        />
      </div>
    </Root>
  )
}

export default App
