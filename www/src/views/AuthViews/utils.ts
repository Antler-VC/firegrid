import { auth, googleProvider } from '../../firebase'

export const handleGoogleAuth = async (
  success: Function,
  fail: Function,
  email?: string
) => {
  try {
    const authUser = await auth.signInWithPopup(googleProvider)
    if (!authUser.user) throw Error('Failed to authenticate')
    if (email && email !== authUser.user.email)
      throw Error(`Used account is not ${email}`)
    const result = await authUser.user.getIdTokenResult()
    if (result.claims.roles && result.claims.roles.length !== 0) {
      success()
    } else {
      throw Error('This account does not exist')
    }
  } catch (error) {
    if (auth.currentUser) {
      auth.signOut()
    }
    fail(error)
  }
}
