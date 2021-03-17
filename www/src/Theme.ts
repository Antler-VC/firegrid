import _merge from 'lodash/merge'
import { createMuiTheme, ThemeOptions } from '@material-ui/core/styles'

export const HEADING_FONT = 'Bitter, sans-serif'
export const BODY_FONT = 'Inter, sans-serif'
export const MONO_FONT =
  'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace'

export const ROOT_FONT_SIZE = 16
export const toRem = (px: number) => `${px / ROOT_FONT_SIZE}rem`
export const toEm = (px: number, root: number) => `${px / root}em`

declare module '@material-ui/core/styles/createTypography' {
  interface FontStyle {
    fontFamilyMono: string
  }
}

export const themeBase = createMuiTheme({
  typography: {
    fontFamily: BODY_FONT,
    fontFamilyMono: MONO_FONT,
    h1: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(48),
      fontWeight: 'normal',
      letterSpacing: toEm(-0.67, 48),
      lineHeight: 64 / 48,
    },
    h2: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(40),
      fontWeight: 'normal',
      letterSpacing: toEm(-0.34, 40),
      lineHeight: 56 / 40,
    },
    h3: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(36),
      fontWeight: 'normal',
      letterSpacing: toEm(0, 36),
      lineHeight: 48 / 36,
    },
    h4: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(32),
      fontWeight: 'normal',
      letterSpacing: toEm(0.21, 32),
      lineHeight: 40 / 32,
    },
    h5: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(24),
      fontWeight: 'normal',
      letterSpacing: toEm(0, 24),
      lineHeight: 32 / 24,
    },
    h6: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(18),
      fontWeight: 'normal',
      letterSpacing: toEm(0.2, 18),
      lineHeight: 24 / 16,
    },
    subtitle1: {
      fontSize: toRem(16),
      letterSpacing: toEm(0.15, 16),
      lineHeight: 24 / 16,
    },
    subtitle2: {
      fontFamily: HEADING_FONT,
      fontSize: toRem(16),
      fontWeight: 'bold',
      letterSpacing: toEm(0.1, 16),
      lineHeight: 24 / 16,
    },
    body1: {
      fontSize: toRem(16),
      letterSpacing: toEm(0.5, 16),
      lineHeight: 24 / 16,
    },
    body2: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.25, 14),
      lineHeight: 24 / 14,
    },
    button: {
      fontSize: toRem(14),
      fontWeight: 600,
      letterSpacing: toEm(0.67, 14),
      lineHeight: 16 / 14,
    },
    overline: {
      fontSize: toRem(14),
      letterSpacing: toEm(2.5, 14),
      lineHeight: 16 / 14,
    },
    caption: {
      fontSize: toRem(14),
      letterSpacing: toEm(0.5, 14),
      lineHeight: 16 / 14,
    },
  },
})

export const defaultOverrides: ThemeOptions = {
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 500,
        minHeight: 36,
      },

      containedSizeLarge: {
        fontSize: themeBase.typography.button.fontSize,
        minHeight: 48,
        paddingLeft: 32,
        paddingRight: 32,
      },
      outlinedSizeLarge: {
        fontSize: themeBase.typography.button.fontSize,
        minHeight: 48,
        paddingLeft: 31,
        paddingRight: 31,
      },
      textSizeLarge: {
        fontSize: themeBase.typography.button.fontSize,
        minHeight: 48,
        paddingLeft: 16,
        paddingRight: 16,
      },

      containedSizeSmall: { minHeight: 30 },
      outlinedSizeSmall: { minHeight: 30 },
      textSizeSmall: { minHeight: 30 },

      containedPrimary: {
        '&:hover': { backgroundColor: themeBase.palette.primary.light },
      },

      outlinedPrimary: {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        '&:hover, &$focusVisible': {
          borderColor: themeBase.palette.primary.main,
        },
      },
      outlinedSecondary: {
        borderColor: 'rgba(0, 0, 0, 0.23)',
        '&:hover, &$focusVisible': {
          borderColor: themeBase.palette.secondary.main,
        },
      },
    },

    MuiIconButton: {
      edgeEnd: {
        '& + &': { marginLeft: 12 },
      },
      edgeStart: {
        '& + &': { marginRight: 12 },
      },
    },

    MuiSvgIcon: {
      fontSizeLarge: { fontSize: toRem(36) },
    },
  },

  props: {
    MuiContainer: { maxWidth: 'xl' },
    MuiTypography: {
      variantMapping: {
        subtitle1: 'div',
        subtitle2: 'div',
      },
    },
    MuiRadio: { color: 'default' },
    MuiSwitch: { color: 'default' },
    MuiButton: {
      color: 'primary',
      disableElevation: true,
    },
    MuiTabs: {
      indicatorColor: 'primary',
      textColor: 'primary',
    },

    MuiCircularProgress: {
      size: 48,
      thickness: 1.6,
    },

    // Select: show dropdown below text field to follow new Material spec
    MuiSelect: {
      MenuProps: {
        getContentAnchorEl: null,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        transformOrigin: { vertical: 'top', horizontal: 'center' },
        PaperProps: { variant: 'outlined' },
      },
    },
    MuiLink: {
      color: 'primary',
      underline: 'hover',
    },
    MuiTextField: { variant: 'filled' },
    MuiTooltip: { enterTouchDelay: 0 },
    MuiFilledInput: { disableUnderline: true },
    MuiPaper: { square: true },
    MuiSlider: { valueLabelDisplay: 'on' },
  },
}

export const defaultTheme = createMuiTheme(
  _merge({}, themeBase, defaultOverrides)
)

export default defaultTheme
