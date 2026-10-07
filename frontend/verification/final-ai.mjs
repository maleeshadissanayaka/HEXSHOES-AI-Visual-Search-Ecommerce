import {chromium} from 'playwright'
import fs from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try{
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
await page.goto('http://localhost:5173/')
const responsePromise=page.waitForResponse(r=>r.url()==='http://127.0.0.1:8000/search',{timeout:120000})
await page.locator('#file-input').setInputFiles('../ai-service/test_query.jpg')
const response=await responsePromise;const body=await response.json()
if(!response.ok()||!body.matches?.length)throw new Error('Real AI service returned no matches')
await page.locator('.result-tile').first().waitFor()
await page.waitForTimeout(700)
const images=await page.locator('.result-tile img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))
console.log(JSON.stringify({status:response.status(),realMatches:body.matches,images},null,2))
fs.writeFileSync('verification/final-ai-results.json',JSON.stringify({status:response.status(),matches:body.matches,images},null,2))
await page.locator('#ai-search').screenshot({path:'verification/final-ai-1440.png'})
}finally{await browser.close()}
