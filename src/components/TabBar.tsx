import { NavLink } from 'react-router-dom'
import { BookA, CalendarCheck, ChartLine, Route } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Сегодня', icon: CalendarCheck, end: true },
  { to: '/path', label: 'Путь', icon: Route, end: false },
  { to: '/vocab', label: 'Словарь', icon: BookA, end: false },
  { to: '/progress', label: 'Прогресс', icon: ChartLine, end: false },
]

export function TabBar() {
  return (
    <nav
      className="sticky bottom-0 z-20 mt-auto border-t border-line bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid h-[60px] grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                isActive ? 'text-accent' : 'text-ink-3'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
