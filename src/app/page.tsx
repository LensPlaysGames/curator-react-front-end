"use client";

import { SignInButton } from "./signInButton";
import { firebaseDb } from "@/libs/firebase/config"
import { signOut, UserContext } from "@/libs/firebase/auth"
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";

export default function Home() {
  const {user, setUser} = useContext(UserContext);
  const [inputDisplayName, setInputDisplayName] = useState<string>("");
  const [inputPostTitle, setInputPostTitle] = useState<string>("");
  const [inputPostInfo, setInputPostInfo] = useState<string>("");
  const [inputPostContentURI, setInputPostContentURI] = useState<string>("");
  const [inputPostThumbnailURI, setInputPostThumbnailURI] = useState<string>("");

  return (
    <div>
      { user
        ? (
          <div>
            <div>
              <h1>Account Settings</h1>

              <input
                type="text"
                name="display_name"
                value={inputDisplayName}
                onChange={ e => setInputDisplayName(e.target.value) }
              />
              <button
                onClick={async () => {
                  await setDoc(doc(firebaseDb, "Users", `${user.uid}`), {
                    displayName: inputDisplayName
                  }, { merge: true })
                }}
              >
                Set Username
              </button>
            </div>

            <div className="flex flex-col">
              <label htmlFor="post_title">Title</label>
              <input
                type="text"
                name="post_title"
                value={inputPostTitle}
                onChange={ e => setInputPostTitle(e.target.value) }
              />

              <label htmlFor="post_info">Info</label>
              <input
                type="text"
                name="post_info"
                value={inputPostInfo}
                onChange={ e => setInputPostInfo(e.target.value) }
              />

              <label htmlFor="post_content_uri">Content URI</label>
              <input
                type="URL"
                name="post_content_uri"
                value={inputPostContentURI}
                onChange={ e => setInputPostContentURI(e.target.value) }
              />

              <label htmlFor="post_thumbnail_uri">Thumbnail URI</label>
              <input
                type="URL"
                name="post_thumbnail_uri"
                value={inputPostThumbnailURI}
                onChange={ e => setInputPostThumbnailURI(e.target.value) }
              />

              <button
                onClick={async () => {
                  // TODO: Get unique post id
                  const postId = "0";
                  // many-to-one relationship between post ids and user ids
                  // I want to be able to have a post ID and lookup the user id that posted
                  // the post, that way I can actually get to where I need to go in the
                  // database just form a post ID.
                  // WhoPosts (collection):
                  // `-- POST_ID (document)
                  //     `-- USER_ID (field)
                  // The above is BAD because it requires an entire new document for every
                  // new post.
                  // So, let's try inverting the data into keys and using a boolean value
                  // (recommended by IBM for many-to-one relationships)
                  // WhoPosts (collection):
                  // `-- USER_ID (document)
                  //     |-- POST_ID (field)
                  //     `-- ...
                  // Er, that doesn't work either. This would work if we wanted to be able
                  // to efficiently query whether any given user did post a given post, but
                  // this doesn't allow us to read back which user did post a given post.
                  // From what I can tell, we kind of just have to use the first one.
                  await setDoc(doc(firebaseDb, "Users", `${user.uid}`, "Posts", postId), {
                    title: inputPostTitle,
                    info: inputPostInfo,
                    date: new Date(),
                    type: "video",
                    contentURI: inputPostContentURI,
                    thumbnailURI: inputPostThumbnailURI,
                  }, { merge: true });
                  await setDoc(doc(firebaseDb, "WhoPosts", postId), {
                    uid: user.uid,
                  })
                }}
              >
                Post
              </button>

              <button
                onClick={async () => {
                  // TODO: Get unique post id (from post we are editing)
                  const postId = "0";
                  await deleteDoc(doc(firebaseDb, "Users", `${user.uid}`, "Posts", postId));
                  await deleteDoc(doc(firebaseDb, "WhoPosts", postId));
                }}
              >
                Delete Post
              </button>

            </div>

            <button className="text-red-600 pt-5 w-full" onClick={signOut}>Sign Out</button>
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
