import ClientHome from "./clientHome";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      <ClientHome />
      <div className="panel">
        <h1>Featured Channels</h1>
        <Link
          className="border border-gray-500 rounded hover:text-cyan-500"
          target="_blank"
          href="/u/wc7tTL1uiAUOjl76zjH44uvAyTW2/"
        >
          <div className="flex items-center py-1 px-5 gap-x-5 text-lg">
            <span className="text-3xl">&#x25b6;</span>
            <span>lens_r</span>
          </div>
        </Link>
        <p>It&apos;s a bit quiet right now...</p>
        <p className="font-bold">Make a few posts, contact the owner, and maybe you could show up here.</p>
      </div>
    </div>
  );
}
