import { useEffect, type ReactNode } from 'react'
import './InfoModal.css'

export type InfoTopic = 'about' | 'careers' | 'contact' | 'sizing' | 'returns' | 'shipping'

const infoContent: Record<InfoTopic, { title: string; body: ReactNode }> = {
  about: {
    title: 'About Hexshoes',
    body: <>
      <p>HEXSHOES is a small-batch footwear studio built around one idea: geometry should do the design work, not decoration. Every pair starts from a six-sided (hex) shape principle — clean lines, honest materials, nothing added that doesn't earn its place.</p>
      <p>This site is currently in active development as part of a portfolio/CV project, combining full-stack web development with an applied AI visual search feature.</p>
    </>,
  },
  careers: {
    title: 'Careers',
    body: <>
      <p>HEXSHOES is currently a small, early-stage project — there are no open roles right now.</p>
      <p>If you're interested in future opportunities or want to connect, reach out via the Contact details below.</p>
    </>,
  },
  contact: {
    title: 'Contact Us',
    body: <>
      <p><strong>Maleesha Viraj</strong></p>
      <p>Phone: +94 70 151 4261</p>
      <p>Email: <a href="mailto:maleeshaviraj25d@gmail.com">maleeshaviraj25d@gmail.com</a></p>
      <p>We aim to respond to all enquiries within 1–2 business days.</p>
    </>,
  },
  sizing: {
    title: 'Sizing Guide',
    body: <>
      <p>HEXSHOES runs true to UK sizing. If you're between sizes, we recommend sizing up for high-ankle styles like the Hex Trail.</p>
      <p><strong>UK 6</strong> — EU 39 / US 7<br /><strong>UK 7</strong> — EU 40 / US 8<br /><strong>UK 8</strong> — EU 42 / US 9<br /><strong>UK 9</strong> — EU 43 / US 10<br /><strong>UK 10</strong> — EU 44 / US 11<br /><strong>UK 11</strong> — EU 45 / US 12</p>
    </>,
  },
  returns: {
    title: 'Returns',
    body: <>
      <p>Unworn items in original packaging can be returned within 30 days of delivery for a full refund.</p>
      <p>To start a return, contact us with your order number and we'll send you next steps.</p>
    </>,
  },
  shipping: {
    title: 'Shipping',
    body: <>
      <p>Standard shipping takes 3–5 business days. Free shipping is available on all orders over $150.</p>
      <p>Express shipping options are available at checkout for an additional fee.</p>
    </>,
  },
}

interface InfoModalProps {
  topic: InfoTopic
  onClose: () => void
}

function InfoModal({ topic, onClose }: InfoModalProps) {
  const content = infoContent[topic]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay open info-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="info-box" role="dialog" aria-modal="true" aria-labelledby="info-title">
        <button className="modal-close" type="button" aria-label="Close information" onClick={onClose}>✕</button>
        <h3 id="info-title">{content.title}</h3>
        <div className="info-body">{content.body}</div>
      </div>
    </div>
  )
}

export default InfoModal