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

const BAD = ['sign', 'logo', 'drawing', 'illustration', 'collage', 'packaging', 'label', 'diagram', 'cartoon', 'doll', 'stamp', 'coin', 'magazine', 'newspaper', 'screenshot', 'meme', 'chart', 'graph', 'archive', 'advertisement', 'advertising', 'bandit', 'sausage', 'hot dog', 'candle', 'soap', 'perfume', 'lotion', 'cosmetic']
const WHITE = ['white background', 'isolated on white', 'white surface', 'plain background']
const CONTEXT = ['table', 'wooden', 'board', 'plate', 'bowl', 'basket', 'kitchen', 'garden', 'room', 'street', 'park', 'classroom', 'hospital', 'office', 'mountain', 'beach', 'stage', 'party', 'campus', 'playground', 'station', 'airport', 'sky']

function score(photo, query) {
  const text = `${photo.alt_description ?? ''} ${photo.description ?? ''}`.toLowerCase()
  if (BAD.some((word) => text.includes(word))) return -1
  let result = 0
  for (const word of query.toLowerCase().split(/\s+/)) {
    if (text.includes(word)) result += 1
  }
  if (WHITE.some((word) => text.includes(word))) result -= 3
  if (CONTEXT.some((word) => text.includes(word))) result += 1
  return result
}

// Первая партия для проверки качества. Потом расширим на все конкретные слова.
const QUERIES = {
  apple: 'apples in a basket',
  bread: 'loaf of bread on wooden table',
  cheese: 'cheese board',
  milk: 'milk bottle and glass on table',
  egg: 'brown eggs in carton',
  rice: 'bowl of rice on table',
  coffee: 'coffee cup on wooden table',
  tea: 'tea cup on table',
  sandwich: 'sandwich on wooden board',
  salad: 'fresh green salad bowl',
  house: 'suburban house garden',
  kitchen: 'modern kitchen interior',
  room: 'cozy living room',
  bathroom: 'bathroom interior',
  bedroom: 'bedroom interior',
  yard: 'backyard garden',
  key: 'keys on wooden table',
  wallet: 'leather wallet on table',
  umbrella: 'umbrella in rain',
  jacket: 'jacket on hanger',
  hat: 'hat on table',
  glasses: 'eyeglasses on table',
  book: 'open book on table',
  pen: 'pen on notebook',
  table: 'empty wooden dining table',
  chair: 'wooden chair in room',
  phone: 'smartphone on table',
  bag: 'leather handbag on table',
  park: 'city park trees',
  store: 'grocery store aisle',
  bank: 'bank building',
  hospital: 'hospital building',
  school: 'school building',
  restaurant: 'restaurant interior',
  bus: 'city bus',
  train: 'train at station',
  stop: 'bus stop',
  student: 'student with books in library',
  teacher: 'teacher in classroom',
  mother: 'mother and child',
  father: 'father and child',
  brother: 'two brothers',
  sister: 'two sisters together',
  family: 'family together outdoors',
  doctor: 'doctor with stethoscope',
  engineer: 'engineer at work',
  driver: 'driver in car',
  cook: 'chef cooking in kitchen',
  nurse: 'nurse with patient',
  friend: 'friends together',
  parents: 'parents with children',
  son: 'boy playing with mother',
  daughter: 'mother and daughter',
  husband: 'married couple walking',
  wife: 'couple at home',
  children: 'children playing in park',
  menu: 'restaurant menu card',
  check: 'restaurant receipt on table',
  grocery: 'grocery store shelves',
  ticket: 'train ticket on table',
  map: 'city map on table',
  passport: 'passport on table',
  suitcase: 'suitcase travel',
  charger: 'phone charger on table',
  flight: 'airplane in sky',
  coat: 'winter coat',
  boots: 'brown leather boots',
  shirt: 'white shirt on hanger',
  shoes: 'pair of leather shoes',
  guitar: 'acoustic guitar',
  chess: 'chess board',
  yoga: 'yoga mat',
  cycling: 'bicycle ride',
  hiking: 'hiking in mountains',
  beach: 'sandy beach ocean',
  hotel: 'hotel room',
  photo: 'camera and photos',
  movie: 'cinema screen',
  concert: 'concert stage',
  party: 'friends at a party',
  birthday: 'birthday cake with candles',
  medicine: 'medicine pills on table',
  dishes: 'dishes in sink',
  laundry: 'laundry basket',
  trash: 'trash bin',
  vacuum: 'vacuum cleaner',
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
