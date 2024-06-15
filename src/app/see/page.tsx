"use client";

// NOTE: This page isn't being updated anymore and will go away in a few
// weeks; it has been succeeded by the dynamic routing method for the
// postId and only using search params for the optional user ID to lessen
// load on database reads. But, we could also just make that an API route
// and cache those indefinitely since WhoPosts can never change.

import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, Suspense } from "react";
import { firebaseDb } from "@/libs/firebase/config"
import VideoPlayer from "@/components/VideoPlayer";

async function FetchPost(postId: string | null, posterUserId?: string | null) {
  if (!postId || postId.length === 0) {
    return { error: (
      <p>Please provide a post ID (<code>?p=&lt;POST_ID&gt;</code> at end of URL).</p>
    )};
  }

  // If a user id was not provided, fetch it from the WhoPosts collection.
  if (!posterUserId) {
    const snapshot = await getDoc(doc(firebaseDb, "WhoPosts", postId));
    if (!snapshot.exists()) {
      console.error(`Could not determine who posted ${postId}`);
      return { error: (
        <p>Internal error: could not determine who posted post {postId}. Please try again later after notifying an admin.</p>
      )};
    }
    posterUserId = snapshot.data()?.uid;
  }

  // Fetch post data
  const postSnapshot = await getDoc(doc(firebaseDb, "Users", `${posterUserId}`, "Posts", `${postId}`));
  if (!postSnapshot.exists()) {
    console.error(`Post data for post ${postId} by user ${posterUserId} doesn't exist`);
    return { error: (
      <p>Post {postId} does not exist.</p>
    )};
  }
  const post = postSnapshot.data();
  // Convert Firebase Timestamp to JavaScript Date.
  post.date = post.date.toDate();

  return post;
}

function PostDisplay() {
  const [post, setPost] = useState<any>(null);
  const params = useSearchParams();

  // This is a hook that takes a callback (the lambda, first argument)
  // referred to as an "effect".
  // The empty array as the second argument causes this to run once when the
  // component is first rendered then never again. If we were to add
  // dependencies into the array, then anytime those dependencies changed
  // the effect would run.
  useEffect(() => {
    // Async IIFE
    (async () => {
      setPost(await FetchPost(params.get("p"), params.get("u")));
    })();
  }, []);

  // While we are waiting for the data to be fetched, display a basic
  // loading screen.
  if (!post) return (<p>Loading...</p>);

  // If the data was unable to be fetched for some reason, this displays to
  // the user that something went wrong.
  if (post.error) return post.error;

  // Success! Post acquired, we may now display it.
  return (
    <VideoPlayer
      url={post.contentURI}
      title={post.title}
      info={post.info}
      date={post.date}
    />
  )
}

export default function See() {
  // I wouldn't touch Suspense with a ten foot pole, but, for some ungodly
  // reason, it is *required* when using `useSearchParams`...
  return (
    <Suspense>
      <PostDisplay />
    </Suspense>
  );
}
