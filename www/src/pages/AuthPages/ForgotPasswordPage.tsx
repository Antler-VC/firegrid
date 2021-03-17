import { useState } from 'react'
import queryString from 'query-string'

import { Typography, TextField, Button } from '@material-ui/core'
import AuthCard from './AuthCard'

import { requestPasswordReset } from 'firebase/callables'

export default function ForgotPasswordPage() {
  const parsedQuery = queryString.parse(window.location.search)

  //const snack = useSnackContext()
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

      <Button
        fullWidth
        variant="contained"
        onClick={async () => {
          setLoading(true)
          const resp = await requestPasswordReset(email)
          setLoading(false)

          console.log(resp)
          // snack.open({
          //   message: resp.data.message,
          // })

          if (resp.data.code && resp.data.code === 'GOOGLE_ACCOUNT') {
            window.location.href = `/googleAuth?email=${email}`
          }
        }}
      >
        RESET password
      </Button>
    </AuthCard>
  )
}
