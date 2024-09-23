import * as React from "react";
import Giscus from "@giscus/react";

const id = "inject-comments";

// 获取 localStorage 中 theme 的值
function getSavedTheme(): string {
  const theme = window.localStorage.getItem("theme");
  if (!theme) {
    return "light";
  }
  return theme;
}

// 获取系统主题
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const Comments = () => {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    const theme = getSavedTheme() || getSystemTheme();
    setTheme(theme);
    // 监听主题变化
    const observer = new MutationObserver(() => {
      setTheme(getSavedTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 取消监听
    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div id={id} className="w-full">
      {mounted ? (
        <Giscus
          id={id}
          repo="JasonGrass/blog-discussions"
          repoId="R_kgDOMh8Hmg"
          category="Announcements"
          categoryId="DIC_kwDOMh8Hms4ChiRX"
          mapping="title"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          lang="zh-CN"
          loading="lazy"
          theme={theme}
        />
      ) : null}
    </div>
  );
};

export default Comments;
