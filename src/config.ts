import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://blog.lindexi.com/", // replace this with your deployed domain
  author: "林德熙",
  profile: "https://blog.lindexi.com/",
  desc: "个人博客",
  title: "林德熙",
  ogImage: "paper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 3,
  postPerPage: 20,
  scheduledPostMargin: 8 * 60 * 60 * 1000, // 8 hour
};

export const LOCALE = {
  lang: "zh", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/lindexi",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Rss",
    href: "./rss.xml",
    linkTitle: `RSS feed`,
    active: true,
  },
];
