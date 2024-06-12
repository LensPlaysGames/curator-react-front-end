"use client";

import { SignInButton } from "./signInButton";
import { signOut, UserContext } from "@/libs/firebase/auth"
import { useContext } from "react";

function VideoPlayer({url, title, info, date}: { url: string, title?: string, info?: string, date?: Date }) {
  if (!url) return "No URL passed to VideoPlayer...";

  return (
    <div>
      <video
        preload="metadata"
        controls
        src={url}
      >
        Your browser does not support this video, sorry
      </video>

      <div className="flex justify-between">

        { title
          ? <h2>{title}</h2>
          : <h2 className="text-slate-500">No Title</h2>
        }

        { date
          ? <p>{date.toLocaleDateString()}</p>
          : null
        }

      </div>

      { info
        ? <p className="text-gray-400">{info}</p>
        : <p className="text-slate-500">No Info</p>
      }

    </div>
  )
}

export default function Home() {
  const {user, setUser} = useContext(UserContext);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      {// Navbar
      }
      <div className="flex justify-between align-center w-full mb-2">
        <div id="navbar-left">
          <h1>Curator</h1>
        </div>
        <div id="navbar-right">
          <h1>Welcome</h1>
        </div>
      </div>

      {// Page Content
      }
      <div>
        { user
          ? (
            <div className="center">
              { // TODO: The idea would be to eventually have this data filled in
                // from a database, state, or something like that.
              }
              <VideoPlayer
                url="https://curator-official.duckdns.org/s/jYpnnLeAakA4CkL/download"
                title="Video from Self-hosted Nextcloud Instance"
                info="A test video to see if this site can fetch video from my self-hosted Nextcloud instance running on my laptop."
                date={new Date()}
              />

              <button className="text-red-600 pt-5 w-full" onClick={signOut}>Sign Out</button>
            </div>
          )
          : (<>
               <SignInButton callback={setUser} />
             </>
          )
        }
      </div>
    </main>
  );
}
