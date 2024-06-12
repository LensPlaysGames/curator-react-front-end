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
            <>
              <p>You are signed in!</p>
              <p>uid: {user.uid}</p>
              <button onClick={signOut}>Sign Out</button>
            </>
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
