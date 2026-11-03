import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

async function readKey(name) {
  if (process.env[name]) return process.env[name].trim()
  try {
    const text = await readFile('.env', 'utf8')
    const match = text.match(new RegExp(`^${name}=(.+)$`, 'm'))
    return match?.[1].trim()
  } catch {
    return undefined
  }
}

const key = await readKey('UNSPLASH_ACCESS_KEY')
if (!key) {
  console.error('Нет UNSPLASH_ACCESS_KEY. Добавь Access Key в .env: UNSPLASH_ACCESS_KEY=...')
  process.exit(1)
}

const BAD = ['candle', 'soap', 'perfume', 'lotion', 'cosmetic']

function score(photo, query) {
  const text = `${photo.alt_description ?? ''} ${photo.description ?? ''}`.toLowerCase()
  if (BAD.some((word) => text.includes(word))) return -1
  let result = 0
  for (const word of query.toLowerCase().split(/\s+/)) {
    if (text.includes(word)) result += 1
  }
  return result
}

// Первая партия для проверки качества. Потом расширим на все конкретные слова.
const QUERIES = {
  apple: 'red apple fruit',
  bread: 'loaf of bread',
  cheese: 'cheese slices',
  milk: 'glass of milk',
  egg: 'brown eggs',
  rice: 'bowl of rice',
  coffee: 'cup of coffee',
  tea: 'cup of tea',
  sandwich: 'sandwich',
  salad: 'fresh green salad',
  house: 'suburban house',
  kitchen: 'modern kitchen',
}

await mkdir('public/photos', { recursive: true })
let existingCredits = []
try {
  existingCredits = JSON.parse(await readFile('public/photos/credits.json', 'utf8'))
} catch {
  existingCredits = []
}
const credits = []
const saved = []

for (const [id, query] of Object.entries(QUERIES)) {
  const output = `public/photos/${id}.webp`
  if (existsSync(output)) {
    console.log(`skip ${id}`)
    saved.push(id)
    continue
  }

  const url =
    'https://api.unsplash.com/search/photos?query=' +
    encodeURIComponent(query) +
    '&per_page=5&orientation=landscape&content_filter=high&client_id=' +
    encodeURIComponent(key)

  const response = await fetch(url)
  if (!response.ok) {
    console.error(`fail ${id}: ${response.status} ${await response.text()}`)
    if (response.status === 403) {
      console.error('Похоже, закончился лимит запросов Unsplash. Попробуй позже.')
    }
    continue
  }

  const data = await response.json()
  const ranked = (data.results ?? [])
    .map((item) => ({ item, score: score(item, query) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
  const photo = ranked[0]?.item
  if (!photo) {
    console.error(`fail ${id}: no photos`)
    continue
  }

  const image = await fetch(photo.urls.regular)
  const buffer = Buffer.from(await image.arrayBuffer())
  await sharp(buffer).resize(600, 338, { fit: 'cover' }).webp({ quality: 78 }).toFile(output)

  credits.push({
    id,
    query,
    description: photo.alt_description,
    photographer: photo.user?.name,
    photographerPage: photo.user?.links?.html,
    page: photo.links?.html,
  })
  saved.push(id)
  console.log(`saved ${id}: ${photo.alt_description ?? query}`)
}

const map = Object.entries(QUERIES)
  .filter(([id]) => existsSync(`public/photos/${id}.webp`))
  .map(([id]) => `  ${JSON.stringify(id)}: '/photos/${id}.webp',`)
  .join('\n')

await writeFile(
  'src/content/photo-map.ts',
  `// Заполняется скриптом scripts/fetch-photos.mjs после скачивания фото.\nexport const photos: Record<string, string> = {\n${map}\n}\n`,
)
await writeFile(
  'public/photos/credits.json',
  JSON.stringify(
    [...existingCredits.filter((old) => !credits.some((item) => item.id === old.id)), ...credits],
    null,
    2,
  ),
)

console.log(`Готово: ${saved.length} фото.`)
