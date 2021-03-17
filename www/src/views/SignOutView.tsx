import React, { useEffect } from 'react'
import { auth } from '../firebase'

import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'

import { EmptyState } from '@antlerengineering/components'
import CheckIcon from '@material-ui/icons/Check'

import { routes } from 'constants/routes'

export default function SignOutView() {
  useEffect(() => {
    document.title = 'Sign Out | Hub Kit'
    auth.signOut()
  }, [])

  return (
    <EmptyState
      fullScreen
      message="Signed Out"
      description={
        <Button
          component={Link}
          to={routes.signIn}
          variant="outlined"
          color="primary"
          style={{ marginTop: 24 }}
        >
          Sign In Again
        </Button>
      }
      Icon={CheckIcon}
    />
  )
}
