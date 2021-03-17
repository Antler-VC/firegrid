import { useEffect } from 'react'
import queryString from 'query-string'

import {
  makeStyles,
  createStyles,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'

import { auth } from '../firebase'
import useRouter from '../hooks/useRouter'
import { getJWTWithUID } from '../firebase/callables'

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    card: {
      margin: 'auto',
      marginTop: 20,
      width: 300,
    },
    button: {
      width: '100%',
    },
    header: {
      textAlign: 'center',
    },
    logo: {
      padding: 30,
    },
  })
)

// googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");

export default function AuthTokenView() {
  const classes = useStyles()
  const router = useRouter()
  const parsed = queryString.parse(router.location.search)

  useEffect(() => {
    if (parsed.uid) handleAuth()
  }, [parsed.uid])
  const handleAuth = async () => {
    if (typeof parsed.uid === 'string') {
      const response = await getJWTWithUID(parsed.uid)
      await auth.signInWithCustomToken(response.data.token)
      router.history.replace('/')
    }
  }
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.header}>Hub Kit</Typography>
          <Typography variant="caption">secret backdoor</Typography>
        </CardContent>
      </Card>
    </div>
  )
}
