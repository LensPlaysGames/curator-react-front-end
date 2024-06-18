"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { posts as fetchPosts, ownUserData } from "@/libs/api"

import { UserContext } from "@/context/auth";
import { UserDataContext } from "@/context/userData";
import { trackUser } from "@/libs/firebase/ease";

export default function UserPage({ params }: { params: { userId: string }}) {
  const {user, setUser} = useContext(UserContext);
  const {userData: udata, setUserData} = useContext(UserDataContext);

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

      { user
        ? <>
            <button
              onClick={e => {
                if (!udata || !udata.tracked) {
                  console.error("No user data, cannot track/untrack a user");
                  alert("You must be logged in to track a user");
                }
                const shouldRemove = udata.tracked.includes(uid);
                trackUser(user.uid, uid, shouldRemove);
                setUserData({
                  ...udata,
                  tracked: shouldRemove
                    ? udata.tracked.filter(elem => elem !== uid)
                    : udata.tracked.concat(uid),
                });
              }}
            >
              { udata && udata.tracked && udata.tracked.includes(uid) ? "Untrack" : "Track" }
            </button>
          </>
        : null
      }
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
                    <img
                      className="mx-auto"
                      src={post.thumbnailURI}
                      alt={`Thumbnail for post titled ${post.title}`}
                    />
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
      <Link target="_blank" href={`/api/rss/postsBy/${uid}`}>
        <button>
          RSS
        </button>
      </Link>
    </div>
  );
}
