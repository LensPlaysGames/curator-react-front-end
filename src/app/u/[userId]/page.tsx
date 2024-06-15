"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HOSTNAME } from "@/constants";
import { posts as fetchPosts } from "@/libs/api"

export default function UserPage({ params }: { params: { userId: string }}) {
  const [posts, setPosts] = useState<Array<any>>([]);
  const uid = params.userId;

  // Run effect just once (empty dependency array).
  useEffect(() => {
    (async () => {
      const data = await fetchPosts(uid);
      setPosts(data.posts);
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
              {// Link to See page
              }
              <Link target="_blank" href={`${HOSTNAME}/see/${post.id}/?u=${uid}`}>
                <button className="py-1 px-3">&#9658;</button>
              </Link>
            </div>
          </div>
        ))
      }
    </div>
  );
}
