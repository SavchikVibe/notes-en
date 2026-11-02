import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const svg = await readFile(new URL('../public/icon.svg', import.meta.url))

const targets = [
  ['pwa-192.png', 192],
  ['pwa-512.png', 512],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of targets) {
  const out = fileURLToPath(new URL(`../public/${name}`, import.meta.url))
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(out)
  console.log(`public/${name}`)
}
