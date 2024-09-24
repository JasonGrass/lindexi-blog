import { type CollectionEntry, getCollection } from "astro:content";

export default async function getMyBlogCollection<
  E extends CollectionEntry<"blog">,
>(filter?: (entry: CollectionEntry<"blog">) => entry is E): Promise<E[]> {
  // const posts = await getCollection("blog", ({ data }) => !data.draft);

  const posts = await getCollection("blog", filter);

  const myPosts = posts.map(post => {
    const parts = post.slug.split("/");
    // 返回最后一部分作为 slug，目的是去除 blog 下面的子文件前缀，如 2017/
    const slugWithoutSubPath = parts.pop();

    if (!slugWithoutSubPath) {
      throw Error("slug parse error. no slug?");
    }

    // const regex = /^\d+.*/;
    // if (slugWithoutSubPath.match(regex)) {
    //   throw Error(
    //     `slug cannot start with number, please check. ${slugWithoutSubPath}`
    //   );
    // }

    return { ...post, slug: slugWithoutSubPath };
  });

  return myPosts;
}
