import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/analytics';
import config from './config';

firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const bucket = firebase.storage();
export const analytics = firebase.analytics();
export const functions = firebase.functions();
export const googleProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters(
  {
    prompt: 'select_account',
  }
);
