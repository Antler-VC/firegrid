import * as admin from "firebase-admin";
import * as _ from "lodash";
import { db } from "../firebase";
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
/** fills template with doc values or default value if key doesn't exist */
export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _.get(data, objKey, defaultValue);
};

const emailGenerator = (
  emailTemplate: { subject: string; body: string; html?: string },
  data: any
) => {
  const subject = emailTemplate.subject.replace(
    /\{\{(.*?)\}\}/g,
    replacer(data)
  );

  const body =
    emailTemplate.html && emailTemplate.html.length > 20
      ? emailTemplate.html
      : emailTemplate.body;
  const html = body.replace(/\{\{(.*?)\}\}/g, replacer(data));
  return { subject, html };
};

export const sendEmail = async (templateId: string, row: any) => {
  const emailTemplate = await db.doc(`emailTemplates/${templateId}`).get();
  const templateData = emailTemplate.data();
  if (!templateData || !templateData.subject || !templateData.body)
    return false;

  const message = emailGenerator(
    templateData as { subject: string; body: string; html?: string },
    row
  );

  return db.collection("firemail").add({
    to: row.email,
    message,
    createdAt: serverTimestamp()
  });
};
