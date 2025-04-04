import rss from "@astrojs/rss";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";
import getMyBlogCollection from "@utils/getMyBlogCollection";

export async function GET() {
  const posts = await getMyBlogCollection();
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, slug }) => ({
      link: `posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
