import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Typography, TextField, Button, Divider, Grid } from '@material-ui/core'
import { requestPasswordReset } from 'firebase/callables'
import AuthCard from './AuthCard'
import GoogleButton from './GoogleButton'

import { useSnackContext } from 'samosas'
import { handleGoogleAuth } from './utils'
import { auth, analytics } from '../../firebase'
import { CtaButton } from '@antlerengineering/components'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

export default function SignInPage({
  googleAuth = false,
  passwordAuth = false,
}: {
  googleAuth?: Boolean
  passwordAuth?: Boolean
}) {
  const snack = useSnackContext()
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState<'main' | 'email'>('main')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const ForgotPasswordButton = (
    <Button component={Link} to={`/forgotPassword?email=${email}`} size="small">
      Forgot password?
    </Button>
  )

  if (page === 'email')
    return (
      <>
        <div
          style={{ width: '100%', maxWidth: 420, margin: '50px auto -34px' }}
        >
          <Button
            startIcon={<ArrowBackIosIcon />}
            color="secondary"
            onClick={() => setPage('main')}
          >
            Sign In Options
          </Button>
        </div>

        <AuthCard height={400} loading={loading}>
          <Grid container spacing={3} wrap="nowrap" direction="column">
            <Grid item>
              <TextField
                fullWidth
                autoFocus
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </Grid>

            <Grid item>{ForgotPasswordButton}</Grid>
          </Grid>

          <CtaButton
            fullWidth
            onClick={async () => {
              try {
                setLoading(true)
                const authUser = await auth.signInWithEmailAndPassword(
                  email,
                  password
                )
                analytics.logEvent('login', {
                  method: authUser.credential?.signInMethod,
                })
                window.location.replace('/')
                setLoading(false)
              } catch (error) {
                setLoading(false)
                if (error.code === 'auth/wrong-password') {
                  snack.open({
                    message: `Incorrect password, or you might be using a Google account`,
                    action: ForgotPasswordButton,
                  })
                } else {
                  snack.open({ message: error.message })
                }
              }
            }}
          >
            Sign in with Email
          </CtaButton>
        </AuthCard>
      </>
    )

  return (
    <AuthCard height={520} loading={loading}>
      <div>
        <Typography gutterBottom>
          If you have received an invitation through a Google account, please
          continue with <b>Sign in with Google</b>.
        </Typography>

        <Typography>
          Otherwise, you may start using Firegrid by clicking{' '}
          <b>Sign in with Email</b>.
        </Typography>
      </div>

      <div>
        <Typography variant="overline" paragraph>
          Google Authentication
        </Typography>
        <GoogleButton
          onClick={() => {
            setLoading(true)
            handleGoogleAuth(
              () => {
                setLoading(false)
                window.location.replace('/')
              },
              (error) => {
                setLoading(false)

                snack.open({ message: error.message })
              }
            )
          }}
        />
      </div>

      <div>
        <Typography variant="overline" paragraph>
          Don’t have a Google account?
        </Typography>
        <CtaButton
          onClick={() => setPage('email')}
          variant="outlined"
          fullWidth
        >
          Sign in with Email
        </CtaButton>
      </div>
    </AuthCard>
  )
}
