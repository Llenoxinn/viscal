export function forbiddenPaths(paths) {
  return paths.filter(
    (path) =>
      /(^|\/)(node_modules|dist|build|coverage|output|\.vite|\.worktrees|\.playwright-cli)(\/|$)/.test(
        path
      ) ||
      (/(^|\/)\.env(?:\.[^/]*)?$/.test(path) &&
        !/(^|\/)\.env\.example$/.test(path)) ||
      /\.(log|local)$/.test(path)
  )
}
