import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
fs.mkdirSync('verification',{recursive:true});
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(4000);
 for(let y=0;y<7000;y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120)}
 await page.evaluate(()=>window.scrollTo(0,0));
 console.log(JSON.stringify({width,errors,layout:await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth,products:document.querySelectorAll('.prod-card').length,brokenImages:Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),text:document.body.innerText.includes('DESIGN PREVIEW')}))}));
 if(width===390){await page.getByRole('button',{name:'Menu',exact:true}).click();console.log('Mobile menu visible:',await page.getByRole('link',{name:'Our Story',exact:true}).first().isVisible());await page.getByRole('button',{name:'Close',exact:true}).click()}
 await page.screenshot({path:`verification/home-${width}.png`,fullPage:true});
 await page.route('http://127.0.0.1:8000/search',async route=>{console.log('AI request:',route.request().method(),route.request().headers()['content-type']);await route.fulfill({json:{matches:[{filename:'shoe1.jpg',score:.92}]}})});
 await page.locator('#file-input').setInputFiles('public/catalog/shoe1.jpg');await page.getByText('92.0%').waitFor();console.log('AI upload and results passed');
 await page.close();
}
await browser.close();
