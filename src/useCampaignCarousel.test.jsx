// @vitest-environment jsdom
import {act, cleanup, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {useCampaignCarousel} from './useCampaignCarousel'

describe('campaign carousel autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(document, 'hidden', {configurable:true, value:false})
    window.matchMedia = vi.fn().mockReturnValue({matches:false, addEventListener:vi.fn(), removeEventListener:vi.fn()})
  })
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks() })
  const advance = ms => act(() => { vi.advanceTimersByTime(ms) })

  it('advances every 4.5 seconds and wraps', () => {
    const {result} = renderHook(() => useCampaignCarousel(3))
    advance(4500); expect(result.current.slide).toBe(1)
    advance(9000); expect(result.current.slide).toBe(0)
  })
  it('pauses and resumes with a fresh countdown', () => {
    const {result} = renderHook(() => useCampaignCarousel(3))
    act(() => result.current.togglePause()); advance(9000); expect(result.current.slide).toBe(0)
    act(() => result.current.togglePause()); advance(4499); expect(result.current.slide).toBe(0)
    advance(1); expect(result.current.slide).toBe(1)
  })
  it('navigates manually and resets the timer', () => {
    const {result} = renderHook(() => useCampaignCarousel(3))
    advance(4000); act(() => result.current.navigate(-1)); expect(result.current.slide).toBe(2)
    advance(4499); expect(result.current.slide).toBe(2)
    advance(1); expect(result.current.slide).toBe(0)
    act(() => result.current.navigate(1)); expect(result.current.slide).toBe(1)
  })
  it('pauses while hovered, focused, or hidden', () => {
    const {result} = renderHook(() => useCampaignCarousel(3))
    act(() => result.current.setHovered(true)); advance(5000); expect(result.current.slide).toBe(0)
    act(() => { result.current.setHovered(false); result.current.setFocused(true) }); advance(5000); expect(result.current.slide).toBe(0)
    act(() => { result.current.setFocused(false); Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange')) }); advance(5000); expect(result.current.slide).toBe(0)
    act(() => { Object.defineProperty(document,'hidden',{configurable:true,value:false}); document.dispatchEvent(new Event('visibilitychange')) }); advance(4500); expect(result.current.slide).toBe(1)
  })
  it('starts paused for reduced motion and cleans up timers and listeners', () => {
    const remove = vi.fn(); window.matchMedia.mockReturnValue({matches:true,addEventListener:vi.fn(),removeEventListener:remove})
    const {result,unmount} = renderHook(() => useCampaignCarousel(3))
    advance(9000); expect(result.current.slide).toBe(0)
    act(() => result.current.togglePause()); expect(vi.getTimerCount()).toBe(1)
    unmount(); expect(vi.getTimerCount()).toBe(0); expect(remove).toHaveBeenCalledOnce()
  })
  it('keeps a single timer after repeated navigation and overlapping pause conditions',()=>{
    const {result,unmount}=renderHook(()=>useCampaignCarousel(3))
    act(()=>{result.current.navigate(1);result.current.navigate(-1)})
    expect(vi.getTimerCount()).toBe(1)
    act(()=>{result.current.setHovered(true);result.current.setFocused(true)})
    act(()=>result.current.setHovered(false))
    advance(9000);expect(result.current.slide).toBe(0)
    act(()=>result.current.setFocused(false))
    expect(vi.getTimerCount()).toBe(1)
    unmount();expect(vi.getTimerCount()).toBe(0)
  })
})
