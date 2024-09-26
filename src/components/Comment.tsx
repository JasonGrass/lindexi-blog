import * as React from "react";

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

  // https://vitaneri.com/posts/how-to-integrate-utterances-with-astro
  function toggleUtterancesTheme() {
    if (document.querySelector(".utterances-frame")) {
      const theme =
        localStorage.getItem("theme") === "light"
          ? "github-light"
          : "github-dark";
      const message = {
        type: "set-theme",
        theme,
      };
      const iframe = document.querySelector(
        ".utterances-frame"
      ) as HTMLIFrameElement; // omit as HTMLIFrameElement if you're wring JS
      iframe?.contentWindow?.postMessage(message, "https://utteranc.es");
    }
  }

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

  React.useEffect(() => {
    const script = document.createElement("script");
    const container = document.querySelector("#utterances-container");

    // Set configurations
    Object.entries({
      src: "https://utteranc.es/client.js",
      repo: "lindexi/lindexi",
      "issue-term": "title",
      label: "💬",
      theme: theme == "light" ? "github-light" : "github-dark",
      crossorigin: "anonymous",
      async: "true",
    }).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    container?.appendChild(script);
  }, [mounted]);

  React.useEffect(() => {
    toggleUtterancesTheme();
  }, [theme]);

  // 屏蔽评论
  return null;

  // return (
  //   <div id={id} className="w-full">
  //     {mounted ? <div id="utterances-container"></div> : null}
  //   </div>
  // );
};

export default Comments;
