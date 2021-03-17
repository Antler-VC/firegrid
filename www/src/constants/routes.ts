import FieldEditorIcon from 'assets/icons/FieldEditor'

import { CustomClaims } from 'contexts/AppContext'

export { FieldEditorIcon }

export enum routes {
  adminAuth = '/adminAuth',
  setLocation = '/setLocation',
  forgotPassword = '/forgotPassword',
  resetPassword = '/resetPassword',
  googleAuth = '/googleAuth',
  authLink = '/authLink',

  signIn = '/signIn',
  signUp = '/signUp',

  home = '/',

  fieldEditor = '/fieldEditor',

  signOut = '/signOut',
}

export type Route = {
  label: string
  showLocationInLabel?: boolean
  route: string
  Icon: typeof FieldEditorIcon
  children?: {
    label: string
    route: string
  }[]
}

export type RouteFunctionProps = {
  userClaims?: CustomClaims
  algoliaKeys?: Record<string, string>
  userDoc?: Record<string, any>
}
export type RouteFunction = (props: RouteFunctionProps) => Route | null

const fieldEditor: RouteFunction = () => ({
  label: 'Field Editor',
  route: routes.fieldEditor,
  Icon: FieldEditorIcon,
})

export const getNavItems = (props: RouteFunctionProps): Route[] => {
  const ordered = [fieldEditor]

  // Call all route functions
  const result: Route[] = []
  ordered.forEach((fn) => {
    const res = fn.call(null, props)
    // Only display if not null
    if (res !== null) result.push(res)
  })

  return result
}
