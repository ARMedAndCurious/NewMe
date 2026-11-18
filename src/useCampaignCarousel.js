import {useEffect, useState} from 'react'

export function useCampaignCarousel(count, delay = 4500) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const onMotion = event => { if (event.matches) setPaused(true) }
    const onVisibility = () => setHidden(document.hidden)
    media?.addEventListener?.('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { media?.removeEventListener?.('change', onMotion); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  useEffect(() => {
    if (paused || hovered || focused || hidden || count < 2) return undefined
    const timer = window.setInterval(() => setSlide(previous => (previous + 1) % count), delay)
    return () => window.clearInterval(timer)
  }, [paused, hovered, focused, hidden, count, delay, revision])

  function navigate(direction) {
    setSlide(previous => (previous + direction + count) % count)
    setRevision(previous => previous + 1)
  }
  function togglePause() { setPaused(previous => !previous); setRevision(previous => previous + 1) }
  return {slide, paused, hovered, focused, hidden, setHovered, setFocused, navigate, togglePause}
}
