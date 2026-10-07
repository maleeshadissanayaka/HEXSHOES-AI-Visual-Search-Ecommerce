import type { InfoTopic } from './InfoModal'
import './Footer.css'

interface FooterProps {
  onOpenInfo: (topic: InfoTopic) => void
}

function Footer({ onOpenInfo }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-mark">HEX<span>S</span>HOES</div>
            <p>Small-batch footwear designed around geometry — six sides, straight lines, nothing decorative that doesn't earn its place.</p>
          </div>
          <div className="foot-col">
            <h4>Shop</h4>
            <a href="#cats">Men</a>
            <a href="#cats">Women</a>
            <a href="#rail">New Drops</a>
            <a href="#ai-search">Find My Shoe</a>
          </div>
          <div className="foot-col">
            <h4>Support</h4>
            <button type="button" onClick={() => onOpenInfo('sizing')}>Sizing Guide</button>
            <button type="button" onClick={() => onOpenInfo('returns')}>Returns</button>
            <button type="button" onClick={() => onOpenInfo('shipping')}>Shipping</button>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <button type="button" onClick={() => onOpenInfo('about')}>About</button>
            <button type="button" onClick={() => onOpenInfo('careers')}>Careers</button>
            <button type="button" onClick={() => onOpenInfo('contact')}>Contact</button>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 HEXSHOES</span>
          <span>PREVIEW BUILD — NOT LIVE</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer