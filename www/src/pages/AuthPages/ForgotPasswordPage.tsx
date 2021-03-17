import React, { useState } from 'react'
import queryString from 'query-string'

import { Typography, TextField } from '@material-ui/core'
import { CtaButton } from '@antlerengineering/components'

import { requestPasswordReset } from 'firebase/callables'
import AuthCard from './AuthCard'
import { useSnackContext } from 'samosas'

export default function ForgotPasswordPage() {
  const parsedQuery = queryString.parse(window.location.search)

  const snack = useSnackContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(parsedQuery.email as string)
  return (
    <AuthCard height={360} loading={loading}>
      <Typography variant="overline">RESET PASSWORD</Typography>
      <Typography variant="body1">
        Type your email address to reset your password and check your inbox.
      </Typography>

      <TextField
        label={'Email Address'}
        name={'email'}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />

      <CtaButton
        onClick={async () => {
          setLoading(true)
          const resp = await requestPasswordReset(email)
          setLoading(false)

          snack.open({
            message:
              'Please check your email. We’ve sent a link to the email address if the account exists',
          })

          if (resp.data.code && resp.data.code === 'GOOGLE_ACCOUNT') {
            window.location.href = `/googleAuth?email=${email}`
          }
        }}
      >
        Reset Password
      </CtaButton>
    </AuthCard>
  )
}
