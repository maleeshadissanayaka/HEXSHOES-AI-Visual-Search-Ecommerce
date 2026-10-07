import { chromium } from 'playwright'
import fs from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const report=[]
try {
for(const width of [1440,1024,768,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://localhost:5173/')
 await page.locator('.prod-card').first().waitFor()
 await page.evaluate(()=>document.fonts.ready)
 for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=600){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70)}
 const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,products:document.querySelectorAll('.prod-card').length,brokenImages:Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}))
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`verification/final-home-${width}.png`,fullPage:true})
 await page.getByRole('button',{name:'Add Hex Runner 02 to wishlist',exact:true}).click()
 const wishlist=await page.locator('.wish-count').innerText()
 await page.getByRole('button',{name:'Add Hex Runner 02 to cart',exact:true}).click()
 const cart=await page.locator('.cart-pill').innerText()
 await page.locator('.prod-card').first().hover()
 await page.getByRole('button',{name:'Quick View',exact:true}).first().click()
 await page.getByRole('dialog').waitFor()
 const modalFocus=await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))
 await page.keyboard.press('Escape')
 if(width<=1024){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.locator('.nav-links.open').waitFor();await page.locator('.nav-links a').last().click()}
 await page.getByRole('button',{name:'WATCH FILM',exact:true}).click();await page.getByText('Campaign film coming soon.').waitFor();await page.keyboard.press('Escape')
 await page.locator('#file-input').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('test')})
 await page.getByRole('alert').filter({hasText:'JPG or PNG'}).waitFor()
 report.push({width,layout,errors,wishlist,cart,modalFocus});await page.close()
}
fs.writeFileSync('verification/final-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2))
}finally{await browser.close()}
