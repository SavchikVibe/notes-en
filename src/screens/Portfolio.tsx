import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { listWritings, type Writing } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'

function words(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PortfolioScreen() {
  const navigate = useNavigate()
  const [writings, setWritings] = useState<Writing[] | null>(null)
  const [selected, setSelected] = useState<Writing | null>(null)

  useEffect(() => {
    void listWritings().then(setWritings)
  }, [])

  if (!writings) {
    return (
      <>
        <AppBar title="Портфолио" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (selected) {
    return (
      <>
        <AppBar
          title="Работа"
          subtitle={formatDate(selected.updatedAt)}
          onBack={() => setSelected(null)}
        />
        <main className="px-5 pb-10 pt-6">
          <p className="text-[13px] font-medium text-ink-3">Задание</p>
          <p className="mt-1 text-[17px] leading-snug text-ink">{selected.prompt}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[13px] font-medium text-ink-3">Первый вариант</p>
              <p className="mt-2 whitespace-pre-line border-l-2 border-line-strong pl-3 text-[15px] leading-relaxed text-ink-2">
                {selected.firstText ?? selected.text}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink-3">Сейчас</p>
              <p className="mt-2 whitespace-pre-line border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-ink">
                {selected.text}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-ink-3">
            {words(selected.text)} слов · проверок: {selected.revisions}
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <AppBar title="Портфолио" onBack={() => navigate('/')} />
      <main className="px-5 pb-10 pt-6">
        {writings.length === 0 ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Check size={28} strokeWidth={1.5} />
            </div>
            <h1 className="mt-6 text-[30px] leading-tight">Пока пусто</h1>
            <p className="mt-2 text-[15px] leading-snug text-ink-2">
              Здесь появятся письменные работы из уроков и студий: первый вариант и то, что
              получилось после правок.
            </p>
            <Button className="mt-8 w-full" onClick={() => navigate('/')}>
              К занятиям
            </Button>
          </>
        ) : (
          <>
            <p className="text-[13px] font-medium text-ink-3">
              Работ: {writings.length} · сначала свежие
            </p>
            <ul className="mt-3">
              {writings.map((writing) => (
                <li key={writing.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(writing)}
                    className="flex min-h-[60px] w-full items-start justify-between gap-4 border-b border-line py-3.5 text-left active:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[16px] leading-snug text-ink">
                        {writing.prompt}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-3">
                        {formatDate(writing.updatedAt)} · {words(writing.text)} слов
                        {writing.revisions > 0 ? ` · проверок: ${writing.revisions}` : ''}
                      </p>
                    </div>
                    <ArrowLeft
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 rotate-180 text-ink-3"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  )
}
