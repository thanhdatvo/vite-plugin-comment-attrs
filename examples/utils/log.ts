function getCurrentTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}
export default function logPlugin(message: string) {
  const cyan = "\x1b[36m";
  const bold = "\x1b[1m";
  const reset = "\x1b[0m";

  console.log(
    `${getCurrentTime()} ${bold}${cyan}[vite-plugin-comment-attrs]${reset} ${message}`,
  );
}
