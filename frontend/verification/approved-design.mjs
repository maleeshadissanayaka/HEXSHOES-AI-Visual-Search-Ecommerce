import { chromium } from 'playwright'
import fs from 'node:fs'

const baseUrl = process.env.HEX_PREVIEW_URL || 'http://127.0.0.1:5173'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const report = []
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const productsResponse = page.waitForResponse(response => response.url() === 'http://localhost:4000/api/products')
    await page.goto(baseUrl)
    const response = await productsResponse
    const products = await response.json()
    await page.waitForFunction(count => document.querySelectorAll('.prod-card').length === count, products.length)
    await page.evaluate(() => document.fonts.ready)
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 450) {
      await page.evaluate(y => scrollTo(0, y), y)
      await page.waitForTimeout(100)
    }
    await page.waitForTimeout(800)
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(700)
    const names = await page.locator('.prod-info h3').allTextContents()
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      brokenImages: Array.from(document.images).filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
      fonts: { archivo: document.fonts.check('900 40px Archivo'), space: document.fonts.check('12px "Space Grotesk"'), mono: document.fonts.check('10px "JetBrains Mono"') },
    }))
    await page.screenshot({ path: `verification/approved-desktop-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: `Add ${products[0].name} to wishlist`, exact: true }).click()
    await page.getByRole('button', { name: `Add ${products[0].name} to cart`, exact: true }).click()
    await page.locator('.prod-card').first().hover()
    await page.getByRole('button', { name: 'Quick View', exact: true }).first().click()
    await page.getByRole('button', { name: '9', exact: true }).click()
    const sizeSelected = await page.getByRole('button', { name: '9', exact: true }).getAttribute('aria-pressed')
    await page.getByRole('button', { name: 'Remove from wishlist', exact: true }).click()
    await page.getByRole('button', { name: 'Add to Cart', exact: true }).click()
    const modal = await page.getByRole('dialog').isVisible()
    await page.keyboard.press('Escape')
    const wishCount = await page.locator('.wish-count').innerText()
    const cartCount = await page.locator('.cart-pill').innerText()
    await page.getByRole('button', { name: 'Watch Film', exact: true }).click()
    const film = await page.getByRole('dialog', { name: 'HEXSHOES campaign film' }).isVisible()
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Sizing Guide', exact: true }).click()
    const sizing = await page.getByRole('dialog').isVisible()
    await page.keyboard.press('Escape')
    let mobileMenu = null
    if (width === 390) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      mobileMenu = await page.locator('#main-menu').isVisible()
      await page.locator('#main-menu').getByRole('link', { name: 'New Drops', exact: true }).click()
      await page.waitForTimeout(500)
    }
    let ai
    try {
      const searchResponse = page.waitForResponse(r => r.url() === 'http://127.0.0.1:8000/search', { timeout: 60000 })
      await page.locator('#file-input').setInputFiles('public/catalog/shoe1.jpg')
      const r = await searchResponse
      const results = await r.json()
      await page.waitForFunction(count => document.querySelectorAll('.result-tile').length === count, results.matches.length)
      ai = { status: r.status(), matchCount: results.matches.length, requestMethod: r.request().method(), contentType: r.request().headers()['content-type'], firstMatch: results.matches[0] }
      await page.locator('#ai-search').scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      await page.screenshot({ path: `verification/approved-ai-${width}.png` })
      await page.evaluate(() => scrollTo(0, 0))
      await page.waitForTimeout(600)
      await page.screenshot({ path: `verification/approved-live-${width}.png`, fullPage: true })
    } catch (error) {
      ai = { error: error.message }
    }
    report.push({ width, api: { status: response.status(), count: products.length, namesMatchFirestore: JSON.stringify(names) === JSON.stringify(products.map(p => p.name)), names }, layout, errors, interactions: { modal, sizeSelected, wishCount, cartCount, film, sizing, mobileMenu }, ai })
    console.log(JSON.stringify(report[report.length - 1]))
    await page.close()
  }
  const reduced = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
  await reduced.goto(baseUrl)
  report.push({ reducedMotion: await reduced.locator('.meaning').evaluate(el => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })) })
  await reduced.close()
  fs.writeFileSync('verification/approved-results.json', JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
