import './Hero.css'
import HexCanvas from './HexCanvas'
import HeroVideo from './HeroVideo'

function Hero() {
  return (
    <section className="hero" id="top">
      <HexCanvas />
      <HeroVideo />
      <div className="hero-fade" />
      <div className="wrap hero-content">
        <div className="hero-badge"><span className="dot" /> FW26 Collection — Live now</div>
        <h1>Built<br />for the<br /><span className="outline">grid.</span></h1>
        <p>Six-sided design thinking applied to footwear. Precision-cut uppers, honest materials, an AI stylist that finds your next pair before you scroll.</p>
        <div className="hero-ctas">
          <a href="#rail" className="btn btn-solid">Shop New Drops</a>
          <a href="#ai-search" className="btn btn-ghost">Find my shoe →</a>
        </div>
      </div>
    </section>
  )
}

export default Hero