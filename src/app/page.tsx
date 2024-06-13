"use client";

import { SignInButton } from "./signInButton";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";
import { firebaseDb } from "@/libs/firebase/config";
import {
  firebaseAuth,
  onAuthStateChanged,
  signOut,
  UserContext
} from "@/libs/firebase/auth";
import {
  HOSTNAME
} from "@/constants";

export default function Home() {
  const {user, setUser} = useContext(UserContext);
  const [inputDisplayName, setInputDisplayName] = useState<string>("");
  const [inputPostTitle, setInputPostTitle] = useState<string>("");
  const [inputPostInfo, setInputPostInfo] = useState<string>("");
  const [inputPostContentURI, setInputPostContentURI] = useState<string>("");
  const [inputPostThumbnailURI, setInputPostThumbnailURI] = useState<string>("");
  const [posts, setPosts] = useState<Array<any>>([]);

  async function postPost(posterUserId: string, title: string, info: string, contentURI: string, thumbnailURI: string) {
    // Generate a universally unique post ID; we don't check for collisions
    // because the chances of that are less than multiple bit flips happening
    // randomly and causing an error in the program.
    const postId = uuidv4();

    const post = {
      title,
      info,
      contentURI,
      thumbnailURI,
      date: new Date(),
      type: "video",
    };

    setPosts(oldPosts => {
      const newPosts = oldPosts.concat({ id: postId, ...post });
      // Sort by date, most recent first (descending)
      newPosts.sort((a, b) => (b.date - a.date));
      return newPosts;
    })

    const promises = [];

    promises.push(
      setDoc(
        doc(firebaseDb, "Users", posterUserId, "Posts", postId),
        post,
        { merge: true }
      )
    );
    promises.push(
      setDoc(doc(firebaseDb, "WhoPosts", postId), {
        uid: posterUserId,
      })
    );

    return Promise.all(promises);
  }

  // Run once (fetch data)
  useEffect(() => {
    // Async IIFE
    (async () => {
      onAuthStateChanged(firebaseAuth, async (newUser) => {
        if (newUser) {
          const postsRef = collection(firebaseDb, "Users", `${newUser.uid}`, "Posts");
          const postsData = await getDocs(query(
            postsRef,
            orderBy("date"),
            limit(10)
          ));
          const posts = postsData.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate() // convert Firebase Timestamp to JavaScript Date
          }))

          // Sort by date, most recent first (descending)
          posts.sort((a, b) => (b.date - a.date));

          setPosts(posts);
        }
      })
    })();
  }, []);

  return (
    <div className="flex flex-col items-center">
      { user
        ? (
          <div>
            <h1>Account Settings</h1>
            <div>
              <label htmlFor="display_name">Display Name</label>
              <div className="flex justify-between">
                <input
                  type="text"
                  id="display_name"
                  value={inputDisplayName}
                  onChange={ e => setInputDisplayName(e.target.value) }
                />
                <button
                  className="ml-2"
                  onClick={async () => {
                    await setDoc(doc(firebaseDb, "Users", `${user.uid}`), {
                      displayName: inputDisplayName
                    }, { merge: true })
                  }}
                >
                  Set
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-y-1 mt-4">
              <h1>Create New Post</h1>

              <div>
                <label className="text-nowrap" htmlFor="post_title">Title</label>
                <input
                  type="text"
                  id="post_title"
                  value={inputPostTitle}
                  onChange={ e => setInputPostTitle(e.target.value) }
                />
              </div>

              <div>
                <label className="text-nowrap" htmlFor="post_info">Info</label>
                <input
                  type="text"
                  id="post_info"
                  value={inputPostInfo}
                  onChange={ e => setInputPostInfo(e.target.value) }
                />
              </div>

              <div>
                <label className="text-nowrap" htmlFor="post_content_uri">Content URI</label>
                <input
                  type="URL"
                  id="post_content_uri"
                  value={inputPostContentURI}
                  onChange={ e => setInputPostContentURI(e.target.value) }
                />
              </div>

              <div>
                <label className="text-nowrap" htmlFor="post_thumbnail_uri">Thumbnail URI</label>
                <input
                  type="URL"
                  id="post_thumbnail_uri"
                  value={inputPostThumbnailURI}
                  onChange={ e => setInputPostThumbnailURI(e.target.value) }
                />
              </div>

              <button
                className="mt-1"
                onClick={
                  e => postPost(
                    user.uid,
                    inputPostTitle,
                    inputPostInfo,
                    inputPostContentURI,
                    inputPostThumbnailURI
                  )
                }
              >
                Post
              </button>
            </div>

            <div>
              <h1>Your Posts</h1>

              <div className="flex flex-col mt-2">
                {
                  posts.map(post => (
                    <div
                      className="flex justify-between items-center p-2 border border-slate-700 rounded"
                      key={post.id}
                    >
                      <div className="flex justify-between gap-x-6 w-full overflow-hidden">
                        <span className="truncate">{post.title}</span>
                        <span className="overflow-clip">{post.date.toDateString()}</span>
                      </div>
                      <div className="flex ml-2">
                        <button
                          className="py-1 px-3"
                          onClick={async () => {
                            if (!confirm(`Really delete post titled "${post.title}?"`)) return;

                            setPosts(oldPosts => {
                              // Remove deleted post
                              const newPosts = oldPosts.filter(candidate => candidate.id !== post.id);
                              return newPosts;
                            });

                            let promises = [];
                            promises.push(
                              deleteDoc(doc(firebaseDb, "Users", `${user.uid}`, "Posts", post.id))
                            );
                            promises.push(
                              deleteDoc(doc(firebaseDb, "WhoPosts", post.id))
                            );
                            await Promise.all(promises);
                          }}
                        >
                          &#x1F5D1;
                        </button>

                        <a target="_blank" href={`${HOSTNAME}/see?p=${post.id}`}>
                          <button className="py-1 px-3">&#9658;</button>
                        </a>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <button className="text-red-600 my-4 w-full" onClick={signOut}>Sign Out</button>
          </div>
        )
        : (<>
             <SignInButton callback={setUser} />
           </>
        )
      }
    </div>
  );
}
