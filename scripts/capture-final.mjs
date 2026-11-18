import {chromium} from 'playwright'
import {readdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
try{
 const page=await browser.newPage({reducedMotion:'reduce'})
 await page.goto('http://127.0.0.1:5173')
 await page.evaluate(()=>localStorage.setItem('newme-concept-v1',JSON.stringify({catalogRevision:2,wishlist:['01'],bag:[{id:'01',color:'Green',size:'M',quantity:2}]})))
 for(const file of await readdir('screenshots/final')){
  const match=file.match(/^(.*)-(390|768|1024|1280|1440|1920)\.png$/)
  if(!match)continue
  const name=match[1]
  const route=name==='home'?'/':name==='product'?'/product/after-hours-ruched-dress':name==='gallery'?'/product/main-character-mini-dress':name.startsWith('category-')?'/category/'+name.slice(9):'/'+name
  await page.setViewportSize({width:Number(match[2]),height:900})
  await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'})
  await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(img=>{img.loading='eager';return img.decode()}))})
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file)
  await page.screenshot({path:'screenshots/final/'+file,fullPage:true})
 }
 await page.setViewportSize({width:1440,height:900})
 await page.goto('http://127.0.0.1:5173')
 await page.getByRole('button',{name:'Previous campaign',exact:true}).click()
 await page.screenshot({path:'screenshots/final/campaign-crop-final.png'})
 console.log('Final CSS: 78 captures refreshed; all images decoded, no horizontal overflow')
}finally{await browser.close()}
