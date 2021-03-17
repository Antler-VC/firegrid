import queryString from 'query-string'

import { Typography, Button } from '@material-ui/core'

import AuthCard from './AuthCard'

import { handleGoogleAuth } from './utils'
import GoogleLogo from 'assets/google-icon.svg'
//import { useSnackContext } from 'contexts/snackContext'
export default function GoogleAuthView() {
  //const snack = useSnackContext()
  const parsedQuery = queryString.parse(window.location.search)

  return (
    <AuthCard height={400}>
      <Typography variant="overline">Google Account</Typography>
      <Typography variant="body1">
        It looks like the following account was previously used to sign in with
        Google. <b>{parsedQuery.email}</b>
      </Typography>

      <Button
        onClick={() => {
          handleGoogleAuth(
            () => {},
            (error: Error) => {
              //  snack.open({ message: error.message })
            },
            parsedQuery.email as string
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
    </AuthCard>
  )
}
