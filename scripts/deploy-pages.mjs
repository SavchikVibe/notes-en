import { execFileSync } from 'node:child_process'
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

async function readEnv(name) {
  if (process.env[name]) return process.env[name].trim()
  try {
    const text = await readFile('.env', 'utf8')
    return text.match(new RegExp(`^${name}=(.+)$`, 'm'))?.[1]?.trim()
  } catch {
    return undefined
  }
}

const repo = process.argv[2]
if (!repo || !/^[^/]+\/[^/]+$/.test(repo)) {
  console.error('Использование: node scripts/deploy-pages.mjs owner/repo')
  process.exit(1)
}

const token = await readEnv('GH_TOKEN')
if (!token) {
  console.error('Нет GH_TOKEN. Добавь в .env: GH_TOKEN=...')
  process.exit(1)
}

const [, name] = repo.split('/')
const base = `/${name}/`

execFileSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VITE_BASE: base },
})

const dir = await mkdtemp(join(tmpdir(), 'gh-pages-'))
await cp('dist', dir, { recursive: true })

const git = (args, options = {}) =>
  execFileSync('git', args, { cwd: dir, stdio: 'inherit', ...options })

git(['init', '-q'])
git(['checkout', '-q', '-b', 'gh-pages'])
git(['add', '-A'])
git([
  '-c',
  'user.name=deploy',
  '-c',
  'user.email=deploy@local',
  'commit',
  '-qm',
  'deploy',
])

const remote = `https://x-access-token:${token}@github.com/${repo}.git`
git(['push', '-q', '-f', remote, 'gh-pages'])

await rm(dir, { recursive: true, force: true })

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'english-app-deploy',
  'Content-Type': 'application/json',
}

const pagesUrl = `https://api.github.com/repos/${repo}/pages`
const body = JSON.stringify({ source: { branch: 'gh-pages', path: '/' } })
const existing = await fetch(pagesUrl, { headers })

if (existing.ok) {
  const data = await existing.json()
  if (data.source?.branch !== 'gh-pages') {
    const updated = await fetch(pagesUrl, { method: 'PUT', headers, body })
    if (!updated.ok) {
      console.error(`GitHub Pages API: ${updated.status}`)
      console.error(await updated.text())
      process.exit(1)
    }
  }
} else {
  const created = await fetch(pagesUrl, { method: 'POST', headers, body })
  if (!created.ok) {
    console.error(`GitHub Pages API: ${created.status}`)
    console.error(await created.text())
    process.exit(1)
  }
}

console.log(`Готово: https://${repo.split('/')[0]}.github.io/${name}/`)
