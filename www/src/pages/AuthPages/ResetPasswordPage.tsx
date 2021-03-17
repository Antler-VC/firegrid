import React, { useState } from 'react'

import { Typography, TextField, Button } from '@material-ui/core'

import AuthCard from './AuthCard'
import { auth } from '../../firebase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <AuthCard height={420}>
      <Typography variant="overline">RESET PASSWORD</Typography>
      <Typography variant="body1">
        Welcome back! Please type a new password for your account and confirm.
      </Typography>
      <TextField
        label={'Type Password'}
        name={'password'}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <TextField
        label={'Confirm Password'}
        name={'confirmPassword'}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
        }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={async () => {
          if (auth.currentUser) {
            await auth.currentUser.updatePassword(password)
          } else {
          }
        }}
        disabled={password !== confirmPassword}
      >
        RESET password
      </Button>
    </AuthCard>
  )
}
