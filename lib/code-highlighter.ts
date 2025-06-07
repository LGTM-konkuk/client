import * as shiki from "shiki";

let highlighter: shiki.Highlighter;

/**
 * 파일 경로로부터 Shiki에서 사용할 언어 이름을 추론합니다.
 * @param path 파일 경로
 * @returns Shiki 언어 이름 (기본값: "text")
 */
export const getLanguageFromPath = (path: string): string => {
  const ext = path.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    java: "java",
    cpp: "cpp",
    cxx: "cpp",
    cc: "cpp",
    c: "c",
    h: "cpp",
    css: "css",
    scss: "scss",
    less: "less",
    html: "html",
    htm: "html",
    xml: "xml",
    json: "json",
    md: "markdown",
    markdown: "markdown",
    yaml: "yaml",
    yml: "yaml",
    sql: "sql",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    fish: "bash",
    ps1: "powershell",
    rb: "ruby",
    php: "php",
    go: "go",
    rs: "rust",
    kt: "kotlin",
    swift: "swift",
    dart: "dart",
    scala: "scala",
    clj: "clojure",
    r: "r",
    vim: "vimscript",
    dockerfile: "docker",
    tf: "terraform",
  };
  return languageMap[ext || ""] || "text";
};

/**
 * Shiki를 사용하여 코드를 하이라이팅하고 HTML 문자열로 반환합니다.
 * @param code 하이라이팅할 코드 문자열
 * @param lang 언어 식별자
 * @returns 하이라이팅된 HTML의 <code> 태그 내부 내용
 */
export async function highlightCode(code: string, lang: string) {
  const theme = "github-dark";
  if (!highlighter) {
    highlighter = await shiki.createHighlighter({
      themes: [theme],
      langs: [],
    });
  }

  try {
    const loadedLangs = highlighter.getLoadedLanguages() as string[];
    if (!loadedLangs.includes(lang)) {
      await highlighter.loadLanguage(lang as shiki.BundledLanguage);
    }
    const html = highlighter.codeToHtml(code, {
      lang: lang as shiki.BundledLanguage,
      theme,
    });
    const innerHtml = html.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1] || "";
    return innerHtml;
  } catch (e) {
    console.warn(
      `Shiki highlighting failed for lang "${lang}". Falling back to plain text.`,
      e,
    );
    const fallbackHtml = highlighter.codeToHtml(code, {
      lang: "text",
      theme,
    });
    return fallbackHtml.match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1] || "";
  }
}
