import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { forbiddenPaths } from './repo-paths.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const tracked = execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8'
})
  .split('\0')
  .filter(Boolean)
const forbidden = forbiddenPaths(tracked)
if (forbidden.length) {
  console.error(
    `Remove generated files or secrets from Git's index:\n${forbidden.join('\n')}\nUse git rm --cached for files, or git rm -r --cached for folders. Keep package-lock.json tracked.`
  )
  process.exitCode = 1
} else
  console.log(
    'Repository hygiene passed: no tracked dependencies, build output, logs, or local environment files.'
  )
