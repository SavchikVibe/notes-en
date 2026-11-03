const base = 'https://english-app.registerakm.workers.dev'
const sw = await fetch(`${base}/sw.js`, { cache: 'no-store' })
const text = await sw.text()
const urls = [...text.matchAll(/url:"([^"]+)"/g)].map((m) => m[1])
const results = await Promise.all(
  urls.map(async (url) => {
    const response = await fetch(`${base}/${url}`, { method: 'HEAD', cache: 'no-store' })
    return { url, status: response.status }
  }),
)
const bad = results.filter((item) => item.status !== 200)
const index = await (await fetch(`${base}/`, { cache: 'no-store' })).text()
const js = index.match(/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0]
console.log(
  JSON.stringify(
    {
      swStatus: sw.status,
      cacheControl: sw.headers.get('cache-control'),
      precache: urls.length,
      bad,
      skipWaiting: text.includes('skipWaiting'),
      clientsClaim: text.includes('clientsClaim'),
      indexJs: js,
    },
    null,
    2,
  ),
)
