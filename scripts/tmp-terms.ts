import fs from 'node:fs'
import path from 'node:path'

const terms = new Set<string>()
for (const f of fs.readdirSync('src/content/units')) {
  const s = fs.readFileSync(path.join('src/content/units', f), 'utf8')
  for (const m of s.matchAll(/^\s*term: '([^']+)'/gm)) terms.add(m[1].toLowerCase())
}
const candidates = [
  'floor', 'utterance', 'elicit', 'restate',
  'formulate', 'robust', 'preliminary', 'exploratory',
  'dispute', 'civility', 'straw man', 'ad hominem',
  'peer-reviewed', 'preprint', 'sample size', 'subgroup',
]
for (const c of candidates) console.log(c, terms.has(c) ? 'ЗАНЯТО' : 'свободно')
