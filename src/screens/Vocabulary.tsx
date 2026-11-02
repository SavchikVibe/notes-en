import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { allWords } from '@/content'
import { AppBar } from '@/components/AppBar'

export default function VocabularyScreen() {
  const words = useMemo(() => allWords(), [])
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return words
    return words.filter(
      (word) =>
        word.term.toLowerCase().includes(value) ||
        word.translation.toLowerCase().includes(value),
    )
  }, [query, words])

  return (
    <>
      <AppBar title="Словарь" subtitle={`${words.length} слов в курсе`} />

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
        </div>

        <ul className="mt-2 px-5">
          {filtered.map((word) => {
            const open = openId === word.id
            return (
              <li key={word.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : word.id)}
                  className="flex min-h-[68px] w-full items-center gap-4 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[20px] leading-tight text-ink">{word.term}</p>
                    <p className="font-ipa text-[14px] leading-snug text-ink-3">[{word.ipa}]</p>
                  </div>
                  <span className="max-w-[48%] text-right text-[15px] leading-snug text-ink-2">
                    {word.translation}
                  </span>
                  <ChevronDown
                    size={17}
                    strokeWidth={1.5}
                    className={`shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {open && (
                  <div className="space-y-3 pb-5 pl-0.5">
                    {word.examples.map((example, index) => (
                      <div key={index} className="border-l border-line pl-3">
                        <p className="text-[15px] leading-snug text-ink">{example.en}</p>
                        <p className="text-[14px] leading-snug text-ink-2">{example.ru}</p>
                      </div>
                    ))}
                    {word.tags?.length ? (
                      <p className="text-[11px] text-ink-3">{word.tags.join(' · ')}</p>
                    ) : null}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-[15px] text-ink-3">Ничего не найдено.</p>
        )}

        <p className="mt-6 px-5 text-[13px] leading-relaxed text-ink-3">
          Повторение по интервалам появится на этапе 2. Сейчас слова приходят из пройденных уроков.
        </p>
      </main>
    </>
  )
}
