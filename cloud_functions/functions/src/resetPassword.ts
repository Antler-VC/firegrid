import * as functions from "firebase-functions";
import { auth, db } from "./firebase";
import { makeId } from "./utils";
import { Collections } from "./constants/collections";
import { serverTimestamp, sendEmail } from "./utils/email";

export const createAuthLink = async (uid: string, redirectPath: string) => {
  const authLinkKey = makeId(60);
  const authLinkId = makeId(30);

  await db
    .collection(Collections.authLinks)
    .doc(authLinkId)
    .set({
      key: authLinkKey,
      isExpired: false,
      createdAt: serverTimestamp(),
      uid,
      redirectPath: redirectPath ? redirectPath : "/"
    });
  return {
    authLinkKey,
    authLinkId
  };
};

const requestPasswordReset = async (
  data: {
    email: string;
  },
  context: functions.https.CallableContext
) => {
  try {
    const { email } = data;
    const user = await auth.getUserByEmail(email);
    if (!user) throw Error("no associated account found");
    if (user.providerData[0].providerId.includes("google")) {
      //email is gmail account with no password
      return {
        success: false,
        code: "GOOGLE_ACCOUNT",
        message: "this account is linked to Google Auth"
      };
    }

    //outcomes
    const authLink = await createAuthLink(user.uid, "/resetPassword");

    await sendEmail("iq1xu3Z76Ev7qc5ndTAq", { ...authLink, email });
    // create and send reset passsword link
    return {
      success: true,
      message: "Email sent!"
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: error.message
    };
  }
};

export const RequestPasswordReset = functions.https.onCall(
  requestPasswordReset
);
