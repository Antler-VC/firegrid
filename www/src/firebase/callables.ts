import { functions } from './index'
//import { FireTableFilter } from "../hooks/useFiretable";

export enum CLOUD_FUNCTIONS {
  getJWTWithUID = 'getJWTWithUID',
  discourseSSO = 'discourseSSO',
  requestPasswordReset = 'RequestPasswordReset',
  getAuthLinkJWT = 'callable-GetAuthLinkJWT',
}

export const cloudFunction = (
  name: string,
  input: any,
  success: Function,
  fail: Function
) => {
  const callable = functions.httpsCallable(name)
  callable(input)
    .then(result => {
      if (success) {
        success(result)
      }
    })
    .catch(error => {
      if (fail) {
        fail(error)
      }
    })
}

export const getJWTWithUID = (uid: string) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.getJWTWithUID)({
    uid,
    secret: process.env.REACT_APP_FIREBASE_JWT_SECRET,
  })
export const discourseSSO = (payload, sig) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.discourseSSO)({
    payload,
    sig,
  })

export const requestPasswordReset = (email: String) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.requestPasswordReset)({ email })

export const getAuthLinkJWT = (id: string, key: string) =>
  functions.httpsCallable(CLOUD_FUNCTIONS.getAuthLinkJWT)({ id, key })
