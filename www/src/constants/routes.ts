import FieldEditorIcon from 'assets/icons/FieldEditor';
import ListEditorIcon from 'assets/icons/ListEditor';

import { CustomClaims } from 'contexts/AppContext';

export { FieldEditorIcon };
export { ListEditorIcon };

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
  listEditor = '/listEditor',

  signOut = '/signOut',
}

export type Route = {
  label: string;
  showLocationInLabel?: boolean;
  route: string;
  Icon: typeof FieldEditorIcon;
  children?: {
    label: string;
    route: string;
  }[];
};

export type RouteFunctionProps = {
  userClaims?: CustomClaims;
  algoliaKeys?: Record<string, string>;
  userDoc?: Record<string, any>;
};
export type RouteFunction = (props: RouteFunctionProps) => Route | null;

const fieldEditor: RouteFunction = () => ({
  label: 'Field Editor',
  route: routes.fieldEditor,
  Icon: FieldEditorIcon,
});
const listEditor: RouteFunction = () => ({
  label: 'List Editor',
  route: routes.listEditor,
  Icon: ListEditorIcon,
});

export const getNavItems = (props: RouteFunctionProps): Route[] => {
  const ordered = [fieldEditor, listEditor];

  // Call all route functions
  const result: Route[] = [];
  ordered.forEach((fn) => {
    const res = fn.call(null, props);
    // Only display if not null
    if (res !== null) result.push(res);
  });

  return result;
};
