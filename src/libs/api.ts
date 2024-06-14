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

export async function posts(userId: string) {
  const response = await fetch(`${HOSTNAME}/api/postsBy/${userId}/`, {
    next: {
      // time-to-live for this cache entry, in seconds
      revalidate: 60 * 5
    }
  })

  const data = await response.json();
  const posts = data.posts.map((post: any): Post => ({
    ...post,
    date: new Date(post.date),
    posterUserId: userId,
  }))

  // Confidence check: sort by date, most recent first (descending)
  posts.sort((a: any, b: any) => (b.date - a.date));

  return { posts };
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
