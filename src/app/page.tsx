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

    newPostCallback(post, postId);

    setInputPostTitle("");
    setInputPostInfo("");
    setInputPostContentURI("");
    setInputPostThumbnailURI("");

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

      {/*
        <div className="flex justify-between">
          <label className="text-nowrap" htmlFor="post_type">Type</label>
          <select id="post_type">
            <option value="V" selected>Video</option>
            <option value="A">Audio</option>
            <option value="T">Text</option>
            <option value="S">Something Else</option>
          </select>
        </div>
        */}

      <button
        className="my-2"
        onClick={
          () => postPost(
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
  );
}

function YourPosts({ user, posts }: { user: User, posts: Array<any> }) {
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

                <a target="_blank" href={`${HOSTNAME}/see/${post.id}/?u=${user.uid}`}>
                  <button className="py-1 px-3">&#9658;</button>
                </a>
              </div>
            </div>
          ))
        }
      </div>

      <a className="flex justify-center w-full" target="_blank" href={`${HOSTNAME}/u/${user.uid}`}>
        <button className="m-2 py-1 px-3">Your Channel &#x2B5C;</button>
      </a>
    </div>

  );
}

export default function Home() {
  const {user, setUser} = useContext(UserContext);
  const [posts, setPosts] = useState<Array<any>>([]);

  async function deletePost(post: any) {
    if (!confirm(`Really delete post titled "${post.title}?"`)) return;

    setPosts(oldPosts => {
      // Remove deleted post
      const newPosts = oldPosts.filter(candidate => candidate.id !== post.id);
      return newPosts;
    });

    let promises = [];
    promises.push(
      deleteDoc(doc(firebaseDb, "Users", `${user?.uid}`, "Posts", post.id))
    );
    promises.push(
      deleteDoc(doc(firebaseDb, "WhoPosts", post.id))
    );
    await Promise.all(promises);
  }

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
        ? (
          <>
            <YourPosts user={user} posts={posts} />

            <CreatePostForm
              user={user}
              newPostCallback={(post, postId) => {
                setPosts((oldPosts: any) => {
                  // We do this weird syntax to avoid having to re-sort.
                  return [{ id: postId, ...post }].concat(oldPosts);
                })
              }}
            />

            <AccountSettings user={user} />
          </>
        )
        : (<>
             <SignInButton callback={setUser} />
           </>
        )
      }
    </div>
  );
}
