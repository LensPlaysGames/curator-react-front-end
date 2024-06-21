"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";
import { UserContext } from "@/libs/firebase/auth";
import { UserDataContext } from "@/context/userData";
import { trackedPosts as fetchTrackedPosts } from "@/libs/api";

export default function ClientHome() {
  const {user, setUser} = useContext(UserContext);
  const {userData: udata} = useContext(UserDataContext);

  const [trackedPosts, setTrackedPosts] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      const posts = await fetchTrackedPosts(udata.tracked);
      setTrackedPosts(posts);
    })();
  }, [udata]);

  return (
    user
      ? <>
          <div className="panel">
            <span className="mx-auto">
              Welcome, {udata.displayName}
            </span>
            <Link href="/you">
              <button className="w-full">Make Posts</button>
            </Link>
          </div>
          <div className="panel">
            <h1>From Users You&apos;ve Tracked</h1>
            { trackedPosts.length !== 0
              ? trackedPosts.map(
                post => (
                  <Link
                    className="w-full"
                    target="_blank"
                    title={post.title}
                    href={`/see/${post.id}/?u=${post.posterUserId}`}
                    key={post.id}
                  >
                    <div className="flex flex-col p-2">
                      { post.thumbnailURI && post.thumbnailURI.startsWith("https://")
                        ? <div className="pt-4 pb-1">
                            <img
                              className="mx-auto"
                              src={post.thumbnailURI}
                              alt={`Thumbnail for post titled ${post.title}`}
                            />
                          </div>
                        : null
                      }
                      <div className="flex flex-col justify-between gap-x-6 w-full overflow-hidden text-nowrap">
                        <span className="truncate">{post.title}</span>
                        <span className="hidden md:inline">{post.date.toDateString()}</span>
                      </div>
                    </div>
                  </Link>
                )
              )
              : <p className="font-bold">
                  Go to a channel and click &quot;Track&quot; to see their posts show up here.
                </p>
            }
          </div>
        </>
      : <SignInButton callback={setUser}/>
  )
}
