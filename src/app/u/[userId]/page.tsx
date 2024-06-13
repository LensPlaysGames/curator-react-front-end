"use client";

import { HOSTNAME } from "@/constants";
import { useEffect, useState } from "react";

export default function UserPage({ params }: { params: { userId: string }}) {
  const [posts, setPosts] = useState<Array<any>>([]);
  const uid = params.userId;

  async function fetchPosts() {
    const response = await fetch(`${HOSTNAME}/api/postsBy/${uid}`, {
      next: {
        // time-to-live for this cache entry, in seconds
        revalidate: 60 * 5,
      }
    })

    if (response.ok) {
      const data = await response.json();
      const posts = data.posts.map((post: any) => ({
        ...post,
        date: new Date(post.date),
      }))
      setPosts(posts);
    } else console.error(
      `FETCH: status=${response.status}, statusText=${response.statusText}, url=${response.url}`
    )
  }

  // Run effect just once (empty dependency array).
  useEffect(() => {
    (async () => {
      await fetchPosts();
    })()
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      {
        posts.map(post => (
          <div
            className="flex justify-between bg-black items-center p-2 border border-zinc-700 rounded w-full"
            key={post.id}
          >
            <div className="flex justify-between gap-x-6 w-full overflow-hidden">
              <span className="truncate">{post.title}</span>
              <span className="hidden md:inline">{post.date.toDateString()}</span>
            </div>
            <div className="flex ml-2">
              {// Link to see page
              }
              <a target="_blank" href={`${HOSTNAME}/see?u=${uid}&p=${post.id}`}>
                <button className="py-1 px-3">&#9658;</button>
              </a>
            </div>
          </div>
        ))
      }
    </div>
  );
}
