import { HOSTNAME } from "@/constants";

export interface Post {
  title: string,
  info: string,
  date: Date,
  contentURI: string,
  thumbnailURI: string,
  type: string,
  posterUserId: string
}

/// postsBy/[userId]
export function postsByEndpoint(userId: string) {
  return `${HOSTNAME}/api/postsBy/${userId}/`;
};

export function prepareFetchedPosts(data: JSON, userId: string) {
  const posts = data.posts.map((post: any): Post => ({
    ...post,
    date: new Date(post.date),
    posterUserId: userId,
  }))

  // Confidence check: sort by date, most recent first (descending)
  posts.sort((a: any, b: any) => (b.date - a.date));

  return { posts };
}

export async function posts(userId: string) {
  const response = await fetch(postsByEndpoint(userId), {
    next: {
      // time-to-live for this cache entry, in seconds
      revalidate: 60 * 5,
      // call revalidateTag() with one of these tags to make the next fetch from
      // this revalidate the cache (refresh from database).
      tags: ["posts"]
    }
  })

  const data = await response.json();
  return prepareFetchedPosts(data, userId);
}

// Different purely for more efficient caching
export async function ownPosts(userId: string) {
  const response = await fetch(postsByEndpoint(userId), {
    next: {
      // Call revalidateTag("ownPosts")to make the next fetch from this
      // revalidate the cache (refresh from database). Do this when a user
      // creates, updates, or deletes a post.
      tags: ["posts", "ownPosts"]
    }
  })

  const data = await response.json();
  return prepareFetchedPosts(data, userId);
}

export async function whoPosted(postId: string) {
  // NOTE: Next.js upgraded fetch with Data Cache means this will be cached
  // indefinitely, or at least as long as possible, afaik.
  const response = await fetch(`${HOSTNAME}/api/whoPosted/${postId}`);
  if (!response.ok) {
    console.error(`Could not determine who posted ${postId}`);
    return {
      error: `API Error: Could not determine who posted post with ID of ${postId}. If you clicked on a link from the official Curator website, please try again later after notifying an admin. Otherwise, the Post ID is likely incorrect.`
    }
  }
  const data = await response.json();
  return { uid: data.uid };
}
