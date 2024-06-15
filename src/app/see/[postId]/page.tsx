import Link from "next/link";
import { HOSTNAME } from "@/constants"
import { firebaseDb, doc, getDoc } from "@/libs/firebase/db"
import VideoPlayer from "@/components/VideoPlayer";
import { whoPosted } from "@/libs/api";

async function FetchPost(postId: string | null, posterUserId?: string | string[] | null) {
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

function PostDisplay({ post }: { post: any }) {
  if (post.error) return post.error;
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

export async function generateMetadata({ params, searchParams }: { params: { postId: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const postId = params.postId;
  const post = await FetchPost(params.postId, searchParams.u);
  // TODO: if (post.error) "do something"
  const posterUserId = post.posterUserId;

  const metadata = {
    title: post.title,
    description: post.info,
    keywords: [ post.title ],
    authors: [{ url: `${HOSTNAME}/u/${posterUserId}` }],
    openGraph: {
      title: post.title,
      description: post.info,
      url: `${HOSTNAME}/see/${postId}/?u=${posterUserId}`,
      siteName: "Curator, vsp",
      images: (post.thumbnailURI && post.thumbnailURI.length !== 0)
        ? [
          {
            url: post.thumbnailURI,
            alt: `Thumbnail for post titled ${post.title}`,
          }
        ]
        : [],
      locale: "en_US",
      type: "website",
    },
  };

  return metadata;
}

export default async function See({ params, searchParams }: { params: { postId: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const post = await FetchPost(params.postId, searchParams.u);
  return <PostDisplay post={post} />;
}
