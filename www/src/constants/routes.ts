import HomeIcon from '@material-ui/icons/Home'
import ProfileIcon from '@material-ui/icons/AccountBox'
import EventsIcon from '@material-ui/icons/Event'
import SettingsIcon from '@material-ui/icons/Settings'

import { CustomClaims } from 'contexts/AppContext'

export { HomeIcon, ProfileIcon, EventsIcon, SettingsIcon }

export enum routes {
  tokenAuth = '/tokenAuth',
  setLocation = '/setLocation',
  forgotPassword = '/forgotPassword',
  resetPassword = '/resetPassword',
  googleAuth = '/googleAuth',
  authLink = '/authLink',

  signIn = '/signIn',
  signUp = '/signUp',

  home = '/',

  profile = '/profile',

  events = '/events',
  eventsCalendar = '/events/calendar',
  eventsBookings = '/events/bookings',

  settings = '/settings',
  signOut = '/signOut',
}

export type Route = {
  label: string
  showLocationInLabel?: boolean
  route: string
  Icon: typeof HomeIcon
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

const home: RouteFunction = () => ({
  label: 'Home',
  route: routes.home,
  Icon: HomeIcon,
})

const profile: RouteFunction = ({ userClaims }) =>
  userClaims?.roles?.includes('TEAM')
    ? {
        label: 'Profile',
        route: routes.profile,
        Icon: ProfileIcon,
      }
    : {
        label: 'Profile',
        route: routes.profile,
        Icon: ProfileIcon,
        disabled: true,
      }

const events: RouteFunction = () => ({
  label: 'Events',
  route: routes.events,
  Icon: EventsIcon,

  children: [
    {
      label: 'Program Calendar',
      route: routes.eventsCalendar,
    },
    {
      label: 'My Bookings',
      route: routes.eventsBookings,
    },
  ],
})

const settings: RouteFunction = () => ({
  label: 'Settings',
  route: routes.settings,
  Icon: SettingsIcon,
})

export const getNavItems = (props: RouteFunctionProps): Route[] => {
  const ordered = [home, profile, events, settings]

  // Call all route functions
  const result: Route[] = []
  ordered.forEach((fn) => {
    const res = fn.call(null, props)
    // Only display if not null
    if (res !== null) result.push(res)
  })

  return result
}
