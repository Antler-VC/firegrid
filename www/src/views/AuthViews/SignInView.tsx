import { useState } from 'react'

import { Typography, TextField, Button, Divider, Grid } from '@material-ui/core'
import AuthCard from './AuthCard'

import GoogleLogo from 'assets/google-icon.svg'
import { handleGoogleAuth } from './utils'
import { auth } from '../../firebase'

export default function SignInView({
  googleAuth = false,
  passwordAuth = false,
}: {
  googleAuth?: Boolean
  passwordAuth?: Boolean
}) {
  // const snack = useSnackContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const ForgotPasswordButton = () => (
    <Button
      onClick={() => {
        window.location.href = `/forgotPassword?email=${email}`
      }}
      size={'small'}
    >
      Forgot password?
    </Button>
  )
  const height: number =
    200 * (googleAuth ? 1 : 0) + 320 * (passwordAuth ? 1 : 0)
  return (
    <AuthCard height={height} loading={loading}>
      {passwordAuth && (
        <>
          <Typography variant="overline">sign in with email</Typography>

          <TextField
            label={'Email Address'}
            name={'email'}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <TextField
            label={'Password'}
            name={'password'}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <Grid item>
            <ForgotPasswordButton />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            onClick={async () => {
              try {
                setLoading(true)
                await auth.signInWithEmailAndPassword(email, password)
                window.location.replace('/')
              } catch (error) {
                setLoading(false)
                if (error.code === 'auth/wrong-password') {
                  // snack.open({
                  //   message: `Incorrect password, or you might be using a Google account`,
                  //   action: <ForgotPasswordButton />,
                  // })
                } else {
                  //  snack.open({ message: error.message })
                }
              }
            }}
          >
            SIGN IN WITH email
          </Button>
        </>
      )}
      {googleAuth && passwordAuth && <Divider />}
      {googleAuth && (
        <>
          <Typography variant="overline">sign in with Google</Typography>
          <Button
            onClick={() => {
              setLoading(true)
              handleGoogleAuth(
                () => {
                  setLoading(false)

                  window.location.replace('/')
                },
                (error) => {
                  setLoading(false)

                  //snack.open({ message: error.message })
                }
              )
            }}
            color="primary"
            size="large"
            variant="outlined"
          >
            <img
              src={GoogleLogo}
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              style={{ marginRight: 12 }}
            />
            {` `} SIGN IN WITH GOOGLE
          </Button>
        </>
      )}
    </AuthCard>
  )
}
