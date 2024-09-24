import { LOCALE } from "@config";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
}

interface Props extends DatetimesProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className = "",
}: Props) {
  // 使用 vercel 似乎是 OK 的
  // // astro 默认是按照 UTC 时间进行处理，界面展示会有 8 小时误差。这里进行修正。
  // // 遗留问题，如果博客文章中的时间明确指定了时区，则这里的处理会造成显示偏差。不过不会怎么做。
  // if (pubDatetime instanceof Date) {
  //   pubDatetime = new Date(pubDatetime);
  //   pubDatetime.setHours(pubDatetime.getHours() - 8);
  // }
  // if (modDatetime && modDatetime instanceof Date) {
  //   modDatetime = new Date(modDatetime);
  //   modDatetime.setHours(modDatetime.getHours() - 8);
  // }

  return (
    <div
      className={`flex items-center space-x-2 opacity-80 ${className}`.trim()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>

      <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
        Updated:
      </span>
      <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
        />
      </span>
      <span>,</span>
      <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
        Created:
      </span>
      <FormattedDatetime pubDatetime={pubDatetime} modDatetime={pubDatetime} />
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
  const myDatetime = new Date(
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime
  );

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
      <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      <span className="text-nowrap">{time}</span>
    </>
  );
};
