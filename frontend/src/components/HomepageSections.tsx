import Icon from './Icon';
import './HomepageSections.css';
const categories = [
    { name: 'RUNNERS', subtitle: 'Speed meets style', image: '/editorial/hero-grid.png' },
    { name: 'TRAIL & BOOT', subtitle: 'Built for more', image: '/editorial/trail.png' },
    { name: 'SLIDES', subtitle: 'All-day comfort', image: '/editorial/slides.png' },
];
export default function HomepageSections() {
    return <>
    <section className="benefits" aria-label="Shopping benefits"><div className="wrap benefits-grid">
      {([['truck', 'FREE SHIPPING', 'Worldwide orders'], ['search', 'AI VISUAL SEARCH', 'Find your style instantly'], ['shield', '30-DAY RETURNS', 'Hassle free'], ['box', 'SMALL BATCH PRODUCTION', 'Premium quality']] as const).map(([icon, title, copy]) => <div className="benefit" key={title}><Icon name={icon}/><div><h3>{title}</h3><p>{copy}</p></div></div>)}
    </div></section>
    <section className="meaning" aria-label="The HEX philosophy" data-reveal><div className="wrap meaning-grid"><h2>THE<br /><strong>HEX</strong><br />MEANS<br />MORE.</h2>
      {([['H', 'HOVER', 'Lighter movement'], ['E', 'ELEGANCE', 'Timeless design'], ['X', 'XPERIENCE', 'A smarter way to shop']] as const).map(([letter, title, copy]) => <article className="meaning-column" key={letter}><span className="meaning-letter">{letter}</span><h3>{title}</h3><p>{copy}</p><div className={`material material-${letter}`} aria-hidden="true"/></article>)}
    </div></section>
    <section className="cats section-space" id="cats" data-reveal><div className="wrap"><div className="section-heading"><h2>SHOP BY CATEGORY</h2><a href="#rail">VIEW ALL <Icon name="arrow"/></a></div><div className="cat-grid">{categories.map(category => <a className="cat-tile" href="#rail" key={category.name}><img src={category.image} alt="" loading="lazy"/><div className="category-copy"><h3>{category.name}</h3><p>{category.subtitle}</p></div><span className="round-arrow"><Icon name="arrow"/></span></a>)}</div></div></section>
  </>;
}
