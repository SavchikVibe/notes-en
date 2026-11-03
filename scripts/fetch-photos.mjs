import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const QUERIES = {
  apple: 'red apple fruit',
  bread: 'loaf of bread',
  cheese: 'cheese slices',
  milk: 'glass of milk',
  egg: 'brown eggs',
  rice: 'bowl of rice',
  coffee: 'cup of coffee',
  tea: 'cup of tea',
  sandwich: 'sandwich on plate',
  salad: 'fresh green salad',
  house: 'suburban house',
  kitchen: 'modern kitchen',
}

const BAD = [
  'sign',
  'logo',
  'drawing',
  'illustration',
  'collage',
  'poster',
  'packaging',
  'label',
  'map',
  'diagram',
  'cartoon',
  'toy',
  'doll',
  'stamp',
  'coin',
  'book',
  'magazine',
  'newspaper',
  'screenshot',
  'meme',
  'chart',
  'graph',
  'text',
  'cover',
  'album',
  'phone',
  'iphone',
  'laptop',
  'computer',
  'archive',
  'advertisement',
  'advertising',
  'bandit',
  'sausage',
  'hot dog',
  'pie',
  'candy',
  'sauce',
  'woman',
  'man',
  'people',
]

function score(item, query) {
  const title = (item.title || '').toLowerCase()
  if (!title) return -1
  if (BAD.some((word) => title.includes(word))) return -1
  let result = 0
  for (const word of query.toLowerCase().split(/\s+/)) {
    if (title.includes(word)) result += 2
  }
  if (item.license === 'cc0' || item.license === 'pdm') result += 2
  if (item.width && item.height && item.width >= item.height) result += 1
  result -= Math.min(title.length / 120, 2)
  return result
}

async function mapLimit(items, limit, worker) {
  const results = []
  let cursor = 0
  async function run() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

await mkdir('public/photos', { recursive: true })
const credits = []
const saved = []

await mapLimit(Object.entries(QUERIES), 3, async ([id, query]) => {
  const output = `public/photos/${id}.webp`
  if (existsSync(output)) {
    console.log(`skip ${id}`)
    saved.push(id)
    return
  }

  const url =
    'https://api.openverse.org/v1/images/?q=' +
    encodeURIComponent(query) +
    '&page_size=10&license_type=commercial&category=photograph&aspect_ratio=wide&size=medium'
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!response.ok) {
      console.error(`fail ${id}: ${response.status}`)
      return
    }
    const data = await response.json()
    const ranked = (data.results || [])
      .map((item) => ({ item, score: score(item, query) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score)

    const best = ranked[0]?.item
    if (!best) {
      console.error(`fail ${id}: no good candidates`)
      return
    }

    const image = await fetch(best.thumbnail || best.url, { signal: AbortSignal.timeout(20000) })
    if (!image.ok) {
      console.error(`fail ${id}: image ${image.status}`)
      return
    }
    const buffer = Buffer.from(await image.arrayBuffer())
    await sharp(buffer).resize(600, 338, { fit: 'cover' }).webp({ quality: 78 }).toFile(output)

    credits.push({
      id,
      query,
      title: best.title,
      creator: best.creator,
      license: best.license,
      page: best.foreign_landing_url,
      image: best.thumbnail || best.url,
    })
    saved.push(id)
    console.log(`saved ${id}: ${best.title}`)
  } catch (error) {
    console.error(`fail ${id}: ${error.message}`)
  }
})

const map = Object.entries(QUERIES)
  .filter(([id]) => existsSync(`public/photos/${id}.webp`))
  .map(([id]) => `  ${JSON.stringify(id)}: '/photos/${id}.webp',`)
  .join('\n')

await writeFile(
  'src/content/photo-map.ts',
  `// Заполняется скриптом scripts/fetch-photos.mjs после скачивания фото.\nexport const photos: Record<string, string> = {\n${map}\n}\n`,
)
await writeFile('public/photos/credits.json', JSON.stringify(credits, null, 2))

console.log(`Готово: ${saved.length} фото.`)
