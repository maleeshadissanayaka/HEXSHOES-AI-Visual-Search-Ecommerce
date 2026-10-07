import './HomepageSections.css'

const categories = [
  {
    name: 'Runners',
    image: 'https://images.pexels.com/photos/18212364/pexels-photo-18212364.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Runner shoes',
  },
  {
    name: 'Trail & Boot',
    image: 'https://images.pexels.com/photos/29573336/pexels-photo-29573336.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Trail and boot shoes',
  },
  {
    name: 'Slides',
    image: 'https://images.pexels.com/photos/12628401/pexels-photo-12628401.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Slide shoes',
  },
]

function HomepageSections() {
  return (
    <>
      <section className="usp">
        <div className="usp-item"><div className="k">Free Shipping</div><div className="v">ON ORDERS $150+</div></div>
        <div className="usp-item"><div className="k">AI Visual Match</div><div className="v">FIND BY PHOTO</div></div>
        <div className="usp-item"><div className="k">30-Day Returns</div><div className="v">NO QUESTIONS</div></div>
        <div className="usp-item"><div className="k">Small Batch</div><div className="v">LIMITED RUNS</div></div>
      </section>

      <section className="meaning" data-reveal>
        <div className="wrap">
          <div className="meaning-eyebrow">What HEX stands for</div>
          <div className="meaning-words">
            <div className="meaning-word"><span><span className="letter">H</span><span className="rest">over</span></span><span className="tag">— every detail responds to you</span></div>
            <div className="meaning-word"><span><span className="letter">E</span><span className="rest">legance</span></span><span className="tag">— precision over decoration</span></div>
            <div className="meaning-word"><span><span className="letter">X</span><span className="rest">perience</span></span><span className="tag">— the feeling, not just the shoe</span></div>
          </div>
          <p className="meaning-sub">Hover with Elegance, Xperience — three words, one design principle behind every pair we make.</p>
        </div>
      </section>

      <section className="cinema" data-reveal>
        <div className="cinema-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="cinema-grain" />
        </div>
        <div className="cinema-content">
          <div className="eyebrow">FW26 — Behind the Design</div>
          <h2>Motion is<br />material too.</h2>
          <p>Swap this panel for real studio footage once you have it — for now it's a living placeholder, animated to show how the finished site will feel in motion.</p>
          <a href="#rail" className="btn btn-solid">Shop the collection</a>
        </div>
      </section>

      <section className="cats" id="cats" data-reveal>
        <div className="wrap">
          <div className="cats-head">
            <h2>Shop by Category</h2>
            <a href="#rail">View all →</a>
          </div>
          <div className="cat-grid" data-reveal-stagger>
            {categories.map((category) => (
              <div className="cat-tile" key={category.name}>
                <div className="tile-svg">
                  <img src={category.image} alt={category.alt} loading="lazy" />
                </div>
                <div className="tile-label">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomepageSections