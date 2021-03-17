import {
  makeStyles,
  createStyles,
  Typography,
  Card,
  Button,
  Grid,
  LinearProgress,
} from '@material-ui/core'

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      maxWidth: 419,
      minWidth: 300,
      width: '100%',
      height: 360,
      margin: 'auto',
      marginTop: 50,
    },
    logo: { width: 89, height: 35, margin: '20px auto' },
    grid: {
      height: '100%',
      padding: theme.spacing(4),
    },
    support: { margin: 'auto', maxWidth: 400 },
  })
)

export default function AuthCard({ children, height = 300, loading = false }) {
  const classes = useStyles()
  return (
    <>
      <Card className={classes.card} style={{ height }}>
        {loading && <LinearProgress />}
        <Grid
          container
          direction="column"
          className={classes.grid}
          //spacing={1}
          justify="space-evenly"
        >
          {children}
        </Grid>
      </Card>
      <Grid
        className={classes.support}
        container
        direction="row"
        alignItems="center"
        justify="center"
      >
        <Typography variant="overline">Not a user?</Typography>
        <Button
          color="primary"
          onClick={() => {
            window.location.href = `/signUp`
          }}
        >
          SIGN UP ›
        </Button>
      </Grid>
    </>
  )
}
