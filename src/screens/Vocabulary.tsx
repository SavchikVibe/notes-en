import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { units, type Unit, type Word } from '@/content'
import { AppBar } from '@/components/AppBar'
import { SpeakButton } from '@/components/SpeakButton'

interface Entry {
  word: Word
  unit: Unit
}

type SortMode = 'lesson' | 'alpha' | 'category'

interface Group {
  key: string
  title: string
  items: Entry[]
}

const SORTS: { key: SortMode; label: string }[] = [
  { key: 'lesson', label: 'По урокам' },
  { key: 'alpha', label: 'По алфавиту' },
  { key: 'category', label: 'По темам' },
]

const TAG_LABELS: Record<string, string> = {
  people: 'Люди',
  family: 'Семья',
  actions: 'Действия',
  job: 'Работа',
  study: 'Учёба',
  food: 'Еда',
  travel: 'Путешествия',
  questions: 'Вопросы',
  time: 'Время',
  routine: 'Распорядок',
  things: 'Предметы',
  home: 'Дом',
  other: 'Другое',
}

function WordRow({ word, open, onToggle }: { word: Word; open: boolean; onToggle: () => void }) {
  return (
    <li className="border-b border-line">
      <div className="flex min-h-[64px] items-center py-2">
        <SpeakButton text={word.term} />

        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[20px] leading-tight text-ink">{word.term}</p>
            <p className="font-ipa text-[14px] leading-snug text-ink-3">[{word.ipa}]</p>
          </div>
          <span className="max-w-[45%] text-right text-[15px] leading-snug text-ink-2">
            {word.translation}
          </span>
          <ChevronDown
            size={17}
            strokeWidth={1.5}
            className={`shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="space-y-2 pb-4 pl-10">
          {word.examples.map((example, index) => (
            <div key={index} className="flex items-start gap-1">
              <SpeakButton text={example.en} size={14} compact />
              <div className="min-w-0 border-l border-line pl-3 pt-0.5">
                <p className="text-[15px] leading-snug text-ink">{example.en}</p>
                <p className="text-[14px] leading-snug text-ink-2">{example.ru}</p>
              </div>
            </div>
          ))}
          {word.tags?.length ? (
            <p className="text-[11px] text-ink-3">{word.tags.map((tag) => TAG_LABELS[tag] ?? tag).join(' · ')}</p>
          ) : null}
        </div>
      )}
    </li>
  )
}

export default function VocabularyScreen() {
  const entries = useMemo<Entry[]>(
    () => units.flatMap((unit) => unit.words.map((word) => ({ word, unit }))),
    [],
  )
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortMode>('lesson')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return entries
    return entries.filter(
      ({ word }) =>
        word.term.toLowerCase().includes(value) ||
        word.translation.toLowerCase().includes(value),
    )
  }, [entries, query])

  const groups = useMemo<Group[]>(() => {
    if (sort === 'alpha') {
      return [
        {
          key: 'all',
          title: '',
          items: [...filtered].sort((a, b) => a.word.term.localeCompare(b.word.term, 'en')),
        },
      ]
    }

    const map = new Map<string, Group>()

    if (sort === 'lesson') {
      for (const entry of filtered) {
        const key = entry.unit.id
        const group = map.get(key) ?? {
          key,
          title: `${String(entry.unit.order).padStart(2, '0')} · ${entry.unit.title}`,
          items: [],
        }
        group.items.push(entry)
        map.set(key, group)
      }
      return [...map.values()]
    }

    for (const entry of filtered) {
      const tag = entry.word.tags?.[0] ?? 'other'
      const group = map.get(tag) ?? {
        key: tag,
        title: TAG_LABELS[tag] ?? 'Другое',
        items: [],
      }
      group.items.push(entry)
      map.set(tag, group)
    }
    return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  }, [filtered, sort])

  return (
    <>
      <AppBar title="Словарь" subtitle={`${entries.length} слов в курсе`} />

      <main className="pb-10">
        <div className="px-5 pt-5">
          <div className="flex items-center gap-2 border-b border-line pb-2">
            <Search size={18} strokeWidth={1.5} className="text-ink-3" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Слово или перевод"
              className="w-full bg-transparent py-1 text-[16px] outline-none placeholder:text-ink-3"
            />
          </div>

          <div className="mt-4 flex gap-5 border-b border-line">
            {SORTS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={`-mb-px border-b-2 pb-2 text-[13px] font-medium ${
                  sort === key ? 'border-accent text-ink' : 'border-transparent text-ink-3'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {groups.map((group) => (
          <section key={group.key}>
            {group.title && (
              <h2 className="px-5 pb-1 pt-4 text-[13px] font-medium text-ink-3">{group.title}</h2>
            )}
            <ul className="px-5">
              {group.items.map(({ word }) => (
                <WordRow
                  key={word.id}
                  word={word}
                  open={openId === word.id}
                  onToggle={() => setOpenId(openId === word.id ? null : word.id)}
                />
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-[15px] text-ink-3">Ничего не найдено.</p>
        )}

        <p className="mt-6 px-5 text-[13px] leading-relaxed text-ink-3">
          Нажми на динамик, чтобы услышать слово или пример. Повторение по интервалам появится на
          этапе 2.
        </p>
      </main>
    </>
  )
}
