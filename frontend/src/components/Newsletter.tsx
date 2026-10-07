import './Newsletter.css'

function Newsletter() {
  return (
    <section className="news" data-reveal>
      <div className="wrap">
        <h2>Stay in the grid</h2>
        <p>New drops, restocks, and early access — no spam.</p>
        <form className="news-form" onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="your@email.com" aria-label="Email address" />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter