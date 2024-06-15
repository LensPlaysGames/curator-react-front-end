"use client";

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
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { firebaseDb, firebaseFunctions } from "@/libs/firebase/config";
import {
  type User,
  firebaseAuth,
  onAuthStateChanged,
  signOut,
  UserContext
} from "@/libs/firebase/auth";
import { posts as fetchPosts } from "@/libs/api";
import { HOSTNAME } from "@/constants";

function AccountSettings({ user }: { user: any }) {
  const [inputDisplayName, setInputDisplayName] = useState<string>("");

  return (
    <div className="panel">
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

      <button className="bg-zinc-700 hover:bg-zinc-900 text-red-600 hover:text-red-600 my-4 w-full" onClick={signOut}>Sign Out</button>
    </div>
  );
};

function CreatePostForm({ user, newPostCallback }: { user: User, newPostCallback: Function }) {
  const [inputPostTitle, setInputPostTitle] = useState<string>("");
  const [inputPostInfo, setInputPostInfo] = useState<string>("");
  const [inputPostContentURI, setInputPostContentURI] = useState<string>("");
  const [inputPostThumbnailURI, setInputPostThumbnailURI] = useState<string>("");

  return (
    <div className="panel">
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

      {
        //<div className="flex justify-between">
        //  <label className="text-nowrap" htmlFor="post_type">Type</label>
        //  <select id="post_type">
        //    <option value="V" selected>Video</option>
        //    <option value="A">Audio</option>
        //    <option value="T">Text</option>
        //    <option value="S">Something Else</option>
        //  </select>
        //</div>
      }

      <button
        className="my-2"
        onClick={
          async () => {
            httpsCallable(firebaseFunctions, "postPost")({
              title: inputPostTitle,
              info: inputPostInfo,
              type: "Video",
              contentURI: inputPostContentURI,
              thumbnailURI: inputPostThumbnailURI,
            })
              .then((post: any) => {
                post.data.date = new Date(post.data.date);

                newPostCallback(post.data);

                setInputPostTitle("");
                setInputPostInfo("");
                setInputPostContentURI("");
                setInputPostThumbnailURI("");
              })
              .catch((error: any) => {
                const msg = `Error ${error.code}: ${error.message}`;
                alert(msg);
                console.error(msg);
                console.error(error.details);
              })
          }
        }
      >
        Post
      </button>
    </div>
  );
}

function YourPosts({ user, posts, deletePostCallback }: { user: User, posts: Array<any>, deletePostCallback: Function }) {
  async function deletePost(post: any) {
    if (!confirm(`Really delete post titled "${post.title}?"`)) return;

    deletePostCallback(post);

    let promises = [];
    promises.push(
      deleteDoc(doc(firebaseDb, "Users", `${user?.uid}`, "Posts", post.id))
    );
    promises.push(
      deleteDoc(doc(firebaseDb, "WhoPosts", post.id))
    );
    // FIXME: Do we need to await here? Not really. Could batch these so if
    // anything goes wrong it's atomic, as well.
    await Promise.all(promises);
  }

  return (
    <div className="panel">
      <h1>Your Posts</h1>
      <div className="flex flex-col mt-2">
        {
          posts.map(post => (
            <div
              className="flex justify-between bg-black items-center p-2 border border-zinc-700 rounded"
              key={post.id}
            >
              <div className="flex flex-col justify-between gap-x-6 w-full overflow-hidden">
                <span className="truncate">{post.title}</span>
                <span className="hidden md:inline">{post.date.toDateString()}</span>
              </div>
              <div className="flex ml-2">
                <button
                  className="py-1 px-3"
                  onClick={() => deletePost(post)}
                >
                  &#x1F5D1;
                </button>

                <Link target="_blank" href={`${HOSTNAME}/see/${post.id}/?u=${user.uid}`}>
                  <button className="py-1 px-3">&#9658;</button>
                </Link>
              </div>
            </div>
          ))
        }
      </div>

      <Link
        className="flex justify-center w-full"
        target="_blank"
        href={`${HOSTNAME}/u/${user.uid}`}
      >
        <button className="m-2 py-1 px-3">Your Channel &#x2B5C;</button>
      </Link>
    </div>

  );
}

export default function You() {
  const {user, setUser} = useContext(UserContext);
  const [posts, setPosts] = useState<Array<any>>([]);

  // Run once (fetch data)
  useEffect(() => {
    // Async IIFE
    (async () => {
      onAuthStateChanged(firebaseAuth, async (newUser) => {
        if (newUser) {
          const data = await fetchPosts(newUser.uid);
          setPosts(data.posts);
        }
      })
    })();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      { user
        ? <>
            <YourPosts
              user={user}
              posts={posts}
              deletePostCallback={(deletedPost: any) => {
                setPosts(oldPosts => oldPosts.filter(candidate => candidate.id !== deletedPost.id));
              }}
            />

            <CreatePostForm
              user={user}
              newPostCallback={(post: any, postId: any) => {
                setPosts((oldPosts: any) => {
                  // We do this weird syntax to avoid having to re-sort.
                  return [post].concat(oldPosts);
                });
              }}
            />

            <AccountSettings user={user} />
          </>
        : <p>Please <Link href="/">Sign In</Link></p>
      }
    </div>
  );
}
