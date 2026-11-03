import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

async function readKey() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim()
  try {
    const text = await readFile('.env', 'utf8')
    const match = text.match(/^PEXELS_API_KEY=(.+)$/m)
    return match?.[1].trim()
  } catch {
    return undefined
  }
}

const key = await readKey()
if (!key) {
  console.error('Нет PEXELS_API_KEY. Добавь ключ в .env: PEXELS_API_KEY=...')
  process.exit(1)
}

// Первая партия для проверки качества. Потом расширим на все конкретные слова.
const QUERIES = {
  apple: 'apple fruit',
  bread: 'bread loaf',
  cheese: 'cheese',
  milk: 'milk glass',
  egg: 'eggs',
  rice: 'rice bowl',
  coffee: 'coffee cup',
  tea: 'tea cup',
  sandwich: 'sandwich',
  salad: 'salad',
  house: 'house exterior',
  kitchen: 'kitchen interior',
}

await mkdir('public/photos', { recursive: true })

const credits = []
const saved = []

for (const [id, query] of Object.entries(QUERIES)) {
  const output = `public/photos/${id}.webp`
  if (existsSync(output)) {
    console.log(`skip ${id}`)
    saved.push(id)
    continue
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
  const response = await fetch(url, { headers: { Authorization: key } })
  if (!response.ok) {
    console.error(`fail ${id}: ${response.status} ${await response.text()}`)
    continue
  }

  const data = await response.json()
  const photo = data.photos?.find((item) => item.width >= item.height) ?? data.photos?.[0]
  if (!photo) {
    console.error(`fail ${id}: no photos`)
    continue
  }

  const image = await fetch(photo.src.large2x || photo.src.large)
  const buffer = Buffer.from(await image.arrayBuffer())
  await sharp(buffer).resize(600, 338, { fit: 'cover' }).webp({ quality: 78 }).toFile(output)

  credits.push({
    id,
    query,
    photographer: photo.photographer,
    page: photo.url,
    image: photo.src.large2x || photo.src.large,
  })
  saved.push(id)
  console.log(`saved ${id} (${photo.photographer})`)
}

const map = Object.entries(QUERIES)
  .filter(([id]) => existsSync(`public/photos/${id}.webp`))
  .map(([id]) => `  ${JSON.stringify(id)}: '/photos/${id}.webp',`)
  .join('\n')

await writeFile(
  'src/content/photo-map.ts',
  `// Заполняется скриптом scripts/fetch-photos.mjs после скачивания фото.\nexport const photos: Record<string, string> = {\n${map}\n}\n`,
)
await writeFile('public/photos/credits.json', JSON.stringify(credits, null, 2))

console.log(`Готово: ${saved.length} фото. Обнови словарь.`)
