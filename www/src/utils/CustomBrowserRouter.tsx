import { createContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

export const RouterContext = createContext({})

export default function CustomBrowserRouter({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <BrowserRouter>
      <Route>
        {(routeProps) => (
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        )}
      </Route>
    </BrowserRouter>
  )
}
