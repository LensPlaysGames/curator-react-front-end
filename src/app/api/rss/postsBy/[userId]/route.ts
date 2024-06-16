import RSS from "rss";
import { HOSTNAME } from "@/constants";
import { posts as fetchPosts } from "@/libs/api";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const posterUserId = params.userId;

  const data = await fetchPosts(posterUserId);

  const rss = await generateRssFeed(data.posts, posterUserId);

  return new Response(
    rss,
    {
      headers: {
        "Content-Type": "text/xml",
      }
    });
}

async function generateRssFeed(posts: Array<any>, posterUserId: string) {
  const config = {
    title: "", // TODO: Add display name of poster, among other things
    description: "",
    site_url: `${HOSTNAME}/u/${posterUserId}/`,
    feed_url: `${HOSTNAME}/api/rss/postsBy/${posterUserId}/`,
    pubDate: new Date(),
  };
  const rss = new RSS(config);

  posts.map(post => {
    rss.item({
      title: post.title,
      description: post.info,
      url: `${HOSTNAME}/see/${post.id}/?u=${posterUserId}`,
      date: post.date,
    });
  });

  return rss.xml({ indent: true });
}
