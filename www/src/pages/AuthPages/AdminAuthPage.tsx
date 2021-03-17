import React, { useEffect, useState } from 'react'

import { Typography, Button, Divider, TextField } from '@material-ui/core'

import AuthCard from './AuthCard'
import { handleGoogleAuth, signOut } from './utils'
import GoogleLogo from 'assets/google-icon.svg'
import { useSnackContext } from 'samosas'
import useCollection from 'hooks/useCollection'
import MultiSelect from '@antlerengineering/multiselect'
import { getJWTWithUID, ImpersonatorAuth } from 'firebase/callables'
import { auth } from '../../firebase'

export default function AdminAuthPage() {
  useEffect(() => {
    //sign out user on initial load
    signOut()
  }, [])
  const [loading, setLoading] = useState(false)
  const snack = useSnackContext()
  const [adminUser, setAdminUser] = useState()

  const [employeesCollection, employeesDispatch] = useCollection({})
  const [coachesCollection, coachesDispatch] = useCollection({})
  useEffect(() => {
    if (adminUser) {
      employeesDispatch({ path: 'employees' })
      coachesDispatch({ path: 'coaches' })
    }
  }, [adminUser])

  const [email, setEmail] = useState('')
  const handleEmailAuth = async (email: string) => {
    setLoading(true)
    const resp = await ImpersonatorAuth(email)
    setLoading(false)
    if (resp.data.success) {
      snack.open({ message: resp.data.message })

      await auth.signInWithCustomToken(resp.data.jwt)
      window.location.href = '/'
    }
  }

  const handleAuth = async (uid: string) => {
    setLoading(true)
    const resp = await getJWTWithUID(uid)
    setLoading(false)
    if (resp.data.success) {
      snack.open({ message: resp.data.message })

      await auth.signInWithCustomToken(resp.data.jwt)
      window.location.href = '/profile'
    }
  }

  return (
    <AuthCard height={400} loading={loading}>
      <Typography variant="overline">Admin Authentication</Typography>
      {adminUser === undefined ? (
        <>
          <Typography variant="body1">
            Please select an admin account to authenticate
          </Typography>
          <Button
            onClick={() => {
              handleGoogleAuth(
                (authUser, roles) => {
                  if (roles.includes('ADMIN') || roles.includes('OPS')) {
                    setAdminUser(authUser.user)
                  } else {
                    snack.open({ message: 'this account is not an admin' })
                    signOut()
                  }
                },
                (error: Error) => {
                  snack.open({ message: error.message })
                }
              )
            }}
            color="primary"
            size="large"
            variant="outlined"
            startIcon={
              <img
                src={GoogleLogo}
                width={16}
                style={{ marginRight: 8, display: 'block' }}
              />
            }
          >
            SIGN IN WITH GOOGLE
          </Button>
        </>
      ) : (
        <>
          {employeesCollection.documents.length !== 0 && (
            <MultiSelect
              multiple={false}
              value={''}
              onChange={(v) => {
                handleAuth(v as string)
                //setAlgoliaKey(v as string)
              }}
              options={employeesCollection.documents
                .map((doc) => ({
                  value: doc.id,
                  label: `${doc.firstName} ${doc.lastName} (${doc.id})`,
                }))
                .filter((option) => option.value && option.label)}
              label={'Select an employee'}
              labelPlural={'employees'}
            />
          )}
          {coachesCollection.documents.length !== 0 && (
            <MultiSelect
              multiple={false}
              value={''}
              onChange={(v) => {
                handleAuth(v as string)
                //setAlgoliaKey(v as string)
              }}
              options={coachesCollection.documents
                .map((doc) => ({
                  value: doc.id,
                  label: `${doc.firstName} ${doc.lastName} (${doc.id})`,
                }))
                .filter((option) => option.value && option.label)}
              label={'Select a coach'}
              labelPlural={'coaches'}
            />
          )}

          <Divider />
          <TextField
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button
            disabled={email === ''}
            onClick={() => handleEmailAuth(email)}
            fullWidth
          >
            Sign in
          </Button>
        </>
      )}
    </AuthCard>
  )
}
