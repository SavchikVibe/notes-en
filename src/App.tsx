import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { stopSpeaking } from '@/lib/speech'
import TodayScreen from '@/screens/Today'
import PathScreen from '@/screens/Path'
import VocabularyScreen from '@/screens/Vocabulary'
import ProgressScreen from '@/screens/Progress'
import SettingsScreen from '@/screens/Settings'
import LessonScreen from '@/screens/Lesson'
import ReviewScreen from '@/screens/Review'
import ReadingScreen from '@/screens/Reading'
import ListeningScreen from '@/screens/Listening'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    stopSpeaking()
  }, [location.pathname])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TodayScreen />} />
        <Route path="path" element={<PathScreen />} />
        <Route path="vocab" element={<VocabularyScreen />} />
        <Route path="progress" element={<ProgressScreen />} />
      </Route>
      <Route path="lesson/:id" element={<LessonScreen />} />
      <Route path="review" element={<ReviewScreen />} />
      <Route path="reading" element={<ReadingScreen />} />
      <Route path="listening" element={<ListeningScreen />} />
      <Route path="settings" element={<SettingsScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
