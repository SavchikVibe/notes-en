import { copyFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

if (!existsSync('dist/index.html')) {
  process.exit(0)
}

await copyFile('dist/index.html', 'dist/404.html')
await writeFile('dist/.nojekyll', '')
