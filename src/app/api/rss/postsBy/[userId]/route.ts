import RSS from "rss";
import { HOSTNAME } from "@/constants";
import { userData as fetchUserData, posts as fetchPosts } from "@/libs/api";

export async function GET(request: Request, { params }: { params: { userId: string }}) {
  const userId = params.userId;

  const userData = await fetchUserData(userId);
  const postsData = await fetchPosts(userId);

  const rss = await generateRssFeed(postsData.posts, userData, userId);

  return new Response(
    rss,
    {
      headers: {
        "Content-Type": "text/xml",
      }
    });
}

async function generateRssFeed(posts: Array<any>, userData, userId: string) {
  const config = {
    title: `${userData.displayName.length === 0 ? "Unnamed User" : userData.displayName} | Curator, vsp.`,
    description: `${userData.displayName}'s channel on Curator, a Video Sharing Platform.`,
    site_url: `${HOSTNAME}/u/${userId}/`,
    feed_url: `${HOSTNAME}/api/rss/postsBy/${userId}/`,
    pubDate: new Date(),
  };
  const rss = new RSS(config);

  posts.map(post => {
    rss.item({
      title: post.title,
      description: post.info,
      url: `${HOSTNAME}/see/${post.id}/?u=${userId}`,
      date: post.date,
    });
  });

  return rss.xml({ indent: true });
}
