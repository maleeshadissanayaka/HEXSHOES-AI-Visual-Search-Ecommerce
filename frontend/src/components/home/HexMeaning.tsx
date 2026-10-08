import "./BrandSections.css";
export default function HexMeaning() {
  return (
    <section className="meaning" aria-label="The HEX philosophy" data-reveal>
      <div className="wrap meaning-grid">
        <h2>
          THE
          <br />
          <strong>HEX</strong>
          <br />
          MEANS
          <br />
          MORE.
        </h2>
        {(
          [
            ["H", "HOVER", "Lighter movement"],
            ["E", "ELEGANCE", "Timeless design"],
            ["X", "XPERIENCE", "A smarter way to shop"],
          ] as const
        ).map(([letter, title, copy]) => (
          <article className="meaning-column" key={letter}>
            <span className="meaning-letter">{letter}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <div className={`material material-${letter}`} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
