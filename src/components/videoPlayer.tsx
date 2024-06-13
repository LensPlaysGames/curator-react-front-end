export default function VideoPlayer({ url, title, info, date }: { url: string, title?: string, info?: string, date?: Date }) {
  if (!url) return (<p>No URL passed to VideoPlayer...</p>);

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
          ? <p>{date.toDateString()}</p>
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
