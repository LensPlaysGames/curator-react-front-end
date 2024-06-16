import ClientHome from "./clientHome";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full max-w-screen-sm">
      <ClientHome />
      <div className="panel">
        <h1>Featured Channels</h1>
        <p>It&apos;s a bit quiet right now...</p>
        <p>Make a few posts, contact the owner, and maybe you could show up here.</p>
      </div>
    </div>
  );
}
