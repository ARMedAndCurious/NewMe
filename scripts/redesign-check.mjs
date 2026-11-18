import {chromium} from 'playwright'
import {mkdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
await mkdir('screenshots/redesign',{recursive:true})
try {
 for(const width of [390,768,1024,1280,1440,1920]) {
  const page=await browser.newPage({viewport:{width,height:900}})
  for(const [name,path] of [['home','/'],['shop','/shop'],['product','/product/after-hours-ruched-dress'],['category','/explore']]) {
   await page.goto(`http://127.0.0.1:5173${path}`,{waitUntil:'networkidle'})
   await page.screenshot({path:`screenshots/redesign/${name}-${width}.png`,fullPage:true})
   const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}))
   assert.ok(dims.scroll<=dims.client,`${name} ${width}: overflow ${dims.scroll} > ${dims.client}`)
  }
  console.log(`${width}: four captures, no horizontal overflow`)
  await page.close()
 }
 const page=await browser.newPage({viewport:{width:1280,height:900}})
 await page.goto('http://127.0.0.1:5173/')
 await page.getByRole('button',{name:'Next campaign'}).click()
 await page.getByRole('heading',{name:'IN YOUR DENIM ERA'}).waitFor()
 await page.goto('http://127.0.0.1:5173/explore')
 await page.getByRole('button',{name:'Winterwear'}).click()
 await page.getByRole('heading',{name:'Winterwear'}).waitFor()
 await page.getByRole('link',{name:'SHOP ALL WINTERWEAR'}).click()
  await page.getByText('Black Long Puffer Coat').first().waitFor()
 console.log('Campaign controls and Explore category navigation passed')
 await page.close()
} finally {await browser.close()}
