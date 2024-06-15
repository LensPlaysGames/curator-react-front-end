/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import {v4 as uuidv4} from "uuid";

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

initializeApp({credential: applicationDefault()});
const db = getFirestore();

export const postPost = onCall(async (request: any) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("failed-precondition", "Please sign in");
  }

  const title: any = request.data.title;
  const info: any = request.data.info;
  const type: any = request.data.type;
  const contentURI: any = request.data.contentURI;
  const thumbnailURI: any = request.data.thumbnailURI;

  if (
    !(typeof title === "string") ||
      title.length === 0 ||
      title.length > 256
  ) {
    throw new HttpsError("invalid-argument", "title invalid");
  }
  if (!(typeof info === "string") || info.length > 4096) {
    throw new HttpsError("invalid-argument", "info invalid");
  }
  if (!(typeof type === "string") || type !== "Video") {
    throw new HttpsError("invalid-argument", "type invalid");
  }
  if (
    !(typeof contentURI === "string") ||
      contentURI.length === 0 ||
      contentURI.length > 512 ||
      !contentURI.startsWith("https://")
  ) {
    throw new HttpsError("invalid-argument", "contentURI invalid");
  }
  if (
    !(typeof thumbnailURI === "string") ||
      thumbnailURI.length > 512 ||
      (thumbnailURI.length !== 0 && !thumbnailURI.startsWith("https://"))
  ) {
    throw new HttpsError("invalid-argument", "thumbnailURI invalid");
  }

  // Generate a universally unique post ID; we don't check for collisions
  // because the chances of that are less than multiple bit flips happening
  // randomly and causing an error in the program.
  const postId = uuidv4();

  const post = {
    title,
    info,
    type,
    contentURI,
    thumbnailURI,
    date: new Date(),
  };

  const batch = db.batch();
  batch.set(
    db.collection("Users").doc(request.auth.uid)
      .collection("Posts").doc(postId),
    post
  );
  batch.set(
    db.collection("WhoPosts").doc(postId),
    {uid: request.auth.uid}
  );
  await batch.commit();

  return {
    id: postId,
    ...post,
    date: post.date.toJSON(),
  };
});
