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

export async function trackedPosts(userIds: Array<string>) {
  const posts: Array<any> = [];
  for (const uid of userIds) {
    // NOTE: adding revalidate option causes nothing to be returned, for some reason.
    const response = await fetch(`${HOSTNAME}/api/postsBy/${uid}/`, {
      next: {
        // in seconds
        revalidate: 15,
      }
    })
    const data = await response.json();
    data.posts.forEach((post: any) => {
      posts.push({
        ...post,
        date: new Date(post.date),
        posterUserId: uid,
      });
    });
  }
  // Sort by date, most recent first (descending)
  posts.sort((a: any, b: any) => (b.date - a.date));
  return posts;
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

// revalidate is in seconds
// NOTE/FIXME: We may want to somehow use `res.revalidate()` instead of a
// time-based revalidation.
async function udata(userId: string, revalidate: number) {
  const response = await fetch(
    `${HOSTNAME}/api/udata/${userId}/`,
    { next: { revalidate } }
  );
  if (!response.ok) {
    console.error(`Could not get udata for user with ID ${userId}`);
    return {
      error: `API Error: Could not get user data for user with ID of ${userId}. If you clicked on a link from the official Curator website, please try again later after notifying an admin. Otherwise, the User ID is likely to be incorrect.`
    };
  }
  const data = response.json();
  return data;
}

export async function userData(userId: string) {
  return udata(userId, 60 * 60 * 72);
}

export async function ownUserData(userId: string) {
  return udata(userId, 15);
}
