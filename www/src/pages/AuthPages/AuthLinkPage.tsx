import { useState, useEffect } from 'react'
import queryString from 'query-string'

import { Loading, EmptyState } from '@antlerengineering/components'

import { getAuthLinkJWT } from 'firebase/callables'
import { auth } from '../../firebase'

enum ViewStates {
  fetching = 'FETCHING',
  authenticating = 'AUTHENTICATING',
  expired = 'expired',
  invalid = 'INVALID',
}

export default function AuthLinkPage() {
  const [state, setState] = useState(ViewStates.fetching)

  const handleAuth = async (id, key) => {
    const resp = await getAuthLinkJWT(id, key)
    console.log(resp)
    if (resp.data.success) {
      setState(ViewStates.authenticating)
      console.log(resp.data.jwt)
      await auth.signInWithCustomToken(resp.data.jwt)

      window.location.replace(resp.data.redirectPath)
    } else {
      setState(ViewStates.invalid)
    }
  }
  useEffect(() => {
    const { id, key } = queryString.parse(window.location.search)

    if (typeof id === 'string' && typeof key === 'string') {
      handleAuth(id, key)
    } else {
      setState(ViewStates.invalid)
    }
  }, [])

  switch (state) {
    case ViewStates.fetching:
      return <Loading fullScreen message="Getting your key" />
    case ViewStates.authenticating:
      return <Loading fullScreen message="Authenticating you" />
    default:
      return <EmptyState message="fail" />
  }
}
