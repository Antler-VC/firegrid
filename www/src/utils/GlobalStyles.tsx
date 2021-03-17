import { makeStyles, createStyles } from '@material-ui/core'

export const useGlobalStyles = makeStyles((theme) =>
  createStyles({
    '@global': {
      // Overrides <CSSBaseline />
      html: {
        // Use subpixel antialiasing
        WebkitFontSmoothing: 'subpixel-antialiased !important',
        MozOsxFontSmoothing: 'auto !important',
      },

      a: {
        fontWeight: 'bold',
        color: theme.palette.primary.main,
      },
    },
  })
)

export default function GlobalStyles() {
  useGlobalStyles()
  return null
}
