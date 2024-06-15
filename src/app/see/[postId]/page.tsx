"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { HOSTNAME } from "@/constants"
import { firebaseDb, doc, getDoc } from "@/libs/firebase/db"
import VideoPlayer from "@/components/VideoPlayer";
import { whoPosted } from "@/libs/api";

async function FetchPost(postId: string | null, posterUserId?: string | null) {
  if (!postId || postId.length === 0) {
    return { error: (
      <p>Please provide a post ID (<code>?p=&lt;POST_ID&gt;</code> at end of URL).</p>
    )};
  }

  // If a user id was not provided, fetch it from the WhoPosts collection.
  if (!posterUserId) {
    const data = await whoPosted(postId);
    if (data.error) return {
      error: (
        <p>{data.error}</p>
      )
    }
    posterUserId = data.uid;
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
  // Record posterUserId for convenience (i.e. front-end links).
  post.posterUserId = posterUserId;

  return post;
}

function PostDisplay({ postId }: { postId: string }) {
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
      setPost(await FetchPost(postId, params.get("u")));
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
    <>
      <VideoPlayer
        url={post.contentURI}
        title={post.title}
        info={post.info}
        date={post.date}
      />
      <Link href={`${HOSTNAME}/u/${post.posterUserId}`}>
        <button>Channel</button>
      </Link>
    </>
  )
}

export default function See({ params }: { params: { postId: string }}) {
  // I wouldn't touch Suspense with a ten foot pole, but, for some ungodly
  // reason, it is *required* when using `useSearchParams`...
  return (
    <Suspense>
      <PostDisplay postId={params.postId} />
    </Suspense>
  );
}
