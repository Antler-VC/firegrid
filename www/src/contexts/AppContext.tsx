import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../firebase';
import useDoc from '../hooks/useDoc';

import { getNavItems, Route } from 'constants/routes';
import { CLOUD_FUNCTIONS, cloudFunction } from '../firebase/callables';

export type CustomClaims = {
  roles: string[];
  regions: string[];
};
export interface IAppContextInterface {
  algoliaKeys: Record<string, string>;
  currentUser: firebase.default.User | null | undefined;
  profileDocState: any | null | undefined;
  updateProfileDoc: (data: any) => void;
  userClaims: CustomClaims | undefined;
  navItems: Route[];
}

export const AppContext = React.createContext<IAppContextInterface>({
  algoliaKeys: {},
  currentUser: undefined,
  profileDocState: undefined,
  userClaims: undefined,
  updateProfileDoc: () => {},
  navItems: [],
});
export default AppContext;

export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }: React.PropsWithChildren<{}>) {
  const [currentUser, setCurrentUser] = useState<
    null | undefined | firebase.default.User
  >();
  const [userClaims, setUserClaims] = useState<CustomClaims>();
  const [profileDocState, profileDocDispatch, updateProfileDoc] = useDoc({});
  const [algoliaKeys, setAlgoliaKeys] = useState<Record<string, string>>({});

  const [navItems, setNavItems] = useState<Route[]>([]);
  useEffect(() => {
    const result = getNavItems({ userClaims, algoliaKeys });
    if (JSON.stringify(result) !== JSON.stringify(navItems)) {
      setNavItems(result);
    }
  }, [userClaims, algoliaKeys, navItems]);

  useEffect(() => {
    auth.onAuthStateChanged(async (auth) => {
      setCurrentUser(auth);

      if (auth) {
        window.analytics?.identify(auth.uid, {
          name: auth.displayName,
          email: auth.email,
        });

        const token = await auth.getIdTokenResult();
        setUserClaims(token?.claims as CustomClaims);
        if (token?.claims.roles.includes('TEAM')) {
          profileDocDispatch({ path: `employees/${auth.uid}` });
        } else if (
          token?.claims.roles.includes('COACH') ||
          token.claims.roles.includes('ADVISOR')
        ) {
          profileDocDispatch({ path: `advisors/${auth.uid}` });
        }
      }
    });
  }, []);

  const handleAlgoliaKeys = (data) => {
    setAlgoliaKeys(
      data.reduce((acc, curr) => {
        return {
          ...acc,
          ...curr.indices.reduce(
            (accIndices, currIndex) => ({
              ...accIndices,
              [currIndex]: curr.key,
            }),
            {}
          ),
        };
      }, {})
    );
  };

  useEffect(() => {
    if (profileDocState.doc) {
      if (profileDocState.doc && profileDocState.doc.algoliaKeys) {
        handleAlgoliaKeys(profileDocState.doc.algoliaKeys.keys);
      } else {
        console.log(`calling ${CLOUD_FUNCTIONS.getAlgoliaKeys}`);
        cloudFunction(
          CLOUD_FUNCTIONS.getAlgoliaKeys,
          {
            userGroup: profileDocState.path.split('/')[0],
          },
          (resp) => {
            handleAlgoliaKeys(resp.data.data);
          },
          (error) => console.log(error)
        );
      }
    }
  }, [profileDocState.doc]);

  return (
    <AppContext.Provider
      value={{
        algoliaKeys,
        userClaims,
        navItems,
        currentUser,
        profileDocState,
        updateProfileDoc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const tokenHasValue = async (key: string, value: unknown) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdTokenResult();
    if (token.claims[key] && !token.claims[key].includes(value)) {
      user.getIdTokenResult(true);
    }
  }
};

export const refreshToken = () => {
  const user = auth.currentUser;
  if (user) user.getIdTokenResult(true);
};
