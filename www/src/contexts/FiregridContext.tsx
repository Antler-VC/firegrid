import React, { useContext } from 'react'
import useDoc from '../hooks/useDoc'
import useCollection from '../hooks/useCollection'

export interface IFiregridContextInterface {}

export const FiregridContext = React.createContext<IFiregridContextInterface>(
  {}
)
export default FiregridContext

export const useFiregridContext = () => useContext(FiregridContext)

export function FiregridProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <FiregridContext.Provider value={{}}>{children}</FiregridContext.Provider>
  )
}
