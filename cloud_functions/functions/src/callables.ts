import * as functions from "firebase-functions";
import { db, auth } from "./firebase";

//import * as admin from "firebase-admin";
//import { hasAnyRole } from "./utils/auth";
import { Collections } from "./constants/collections";
//const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export const GetAuthLinkJWT = functions.https.onCall(async (data, context) => {
  try {
    const { id, key } = data;
    if (!id || !key) throw Error("Missing data");

    const authLinkDoc = await db
      .collection(Collections.authLinks)
      .doc(id)
      .get();
    const authLinkData = authLinkDoc.data();
    if (!authLinkData || !authLinkData.key || !authLinkData.uid)
      throw Error("Invalid authLink");
    if (authLinkData.key !== key) throw Error("invalid key");

    const jwt = await auth.createCustomToken(authLinkData.uid);
    return {
      success: true,
      jwt,
      redirectPath: authLinkData.redirectPath,
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: error.message,
    };
  }
});
