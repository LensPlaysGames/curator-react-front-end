"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="flex flex-col items-center gap-y-2 w-full max-w-screen-sm md:max-w-screen-md">
      {
        posts.map(post => (
          <Link
            className="w-full"
            title={post.title}
            target="_blank"
            href={`/see/${post.id}/?u=${post.posterUserId}`}
            key={post.id}
          >
            <div className="flex flex-col bg-black p-2 rounded">
              { post.thumbnailURI && post.thumbnailURI.startsWith("https://")
                ? <div className="pt-4 pb-1">
                    <img className="mx-auto" src={post.thumbnailURI} />
                  </div>
                : null
              }
              <div className="flex justify-between items-center">
                <div className="flex flex-col md:flex-row justify-between gap-x-6 w-full text-nowrap">
                  <span className="truncate">{post.title}</span>
                  <span>{post.date.toDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  );
}
