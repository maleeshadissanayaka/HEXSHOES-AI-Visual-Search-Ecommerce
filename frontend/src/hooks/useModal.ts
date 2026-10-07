import { useEffect, type RefObject } from 'react'
export default function useModal(ref:RefObject<HTMLDivElement | null>,onClose:() => void) {
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const panel = ref.current
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button,a[href],input,video[controls],[tabindex="0"]') ?? [])
    focusable()[0]?.focus()
    document.body.style.overflow = 'hidden'
    const keydown = (event:KeyboardEvent) => {
      if(event.key === 'Escape') onClose()
      if(event.key !== 'Tab') return
      const items = focusable(),first = items[0],last = items[items.length-1]
      if(!first) { event.preventDefault(); panel?.focus(); return }
      if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown',keydown)
    return () => { document.removeEventListener('keydown',keydown); document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  },[ref,onClose])
}
