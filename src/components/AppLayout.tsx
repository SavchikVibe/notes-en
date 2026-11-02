import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <Outlet />
      <TabBar />
    </div>
  )
}
