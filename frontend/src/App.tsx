import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import ProductRail from './components/ProductRail'
import AiSearch from './components/AiSearch'
import HomepageSections from './components/HomepageSections'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import InfoModal, { type InfoTopic } from './components/InfoModal'
import HexAssistant from './components/HexAssistant'

function App() {
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set())
  const [cartCount, setCartCount] = useState(0)
  const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null)
  const closeInfoModal = useCallback(() => setInfoTopic(null), [])

  useEffect(() => {
      const elements = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    elements.forEach((element) => observer.observe(element))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const buttons = reduceMotion ? [] : Array.from(document.querySelectorAll<HTMLElement>('.btn'))
    const handleMove = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLElement
      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      button.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`
    }
    const handleLeave = (event: MouseEvent) => {
      ;(event.currentTarget as HTMLElement).style.transform = ''
    }

    buttons.forEach((button) => {
      button.addEventListener('mousemove', handleMove)
      button.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      observer.disconnect()
      buttons.forEach((button) => {
        button.removeEventListener('mousemove', handleMove)
        button.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  function toggleWishlist(productId: string) {
    setWishlist((current) => {
      const next = new Set(current)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }

  return (
    <>
      <div className="note-banner">DESIGN PREVIEW V2 — visual direction only, real build uses React + Node + Firebase</div>
      <Ticker />
      <Navbar wishlistCount={wishlist.size} cartCount={cartCount} />
      <Hero />
      <HomepageSections />
      <ProductRail
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={() => setCartCount((count) => count + 1)}
      />
      <AiSearch />
      <Newsletter />
      <Footer onOpenInfo={setInfoTopic} />
      {infoTopic && <InfoModal topic={infoTopic} onClose={closeInfoModal} />}
      <HexAssistant />
    </>
  )
}

export default App