function VideoPlayer({ url, title, info, date }) {
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
        {// TODO: The idea would be to eventually have this data filled in from a database by this page.
        }
        <VideoPlayer
          url="https://github.com/ciaranbench/ciaranbench.github.io/raw/main/assets/dance_ex.mp4"
          title="GitHub Dance Example"
          info="A random dance video I found on GitHub and am using as an example of an externally hosted video streamed from this site."
          date={new Date()}
        />
      </div>
    </main>
  );
}
