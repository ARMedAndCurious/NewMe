import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({headless:true, executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
try {
  for (const width of [390,768,1024,1280,1440,1920]) {
    const page = await browser.newPage({viewport:{width,height:900}})
    for (const path of ['/','/shop','/product/after-hours-ruched-dress','/case-study']) {
      await page.goto(`http://127.0.0.1:5173${path}`)
      await page.locator('h1').first().waitFor()
      const dimensions = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}))
      assert.ok(dimensions.scroll <= dimensions.client, `${width}px ${path}: horizontal overflow ${dimensions.scroll} > ${dimensions.client}`)
    }
    console.log(`${width}px: home, listing, product, case study render without horizontal overflow`)
    await page.close()
  }
  const page = await browser.newPage({viewport:{width:1280,height:900}})
  await page.goto('http://127.0.0.1:5173/product/after-hours-ruched-dress')
  await page.getByRole('button',{name:'ADD TO BAG'}).click()
  await page.getByText('Please select a size first.').waitFor()
  await page.getByRole('button',{name:'M',exact:true}).click()
  await page.getByRole('button',{name:'ADD TO BAG'}).click()
  await page.getByText('Added to your bag.').waitFor()
  await page.goto('http://127.0.0.1:5173/bag')
   await page.getByText('Green Halter Mini Dress').waitFor()
   await page.getByRole('button',{name:'Increase quantity of Green Halter Mini Dress'}).click()
  await page.reload()
  assert.equal(await page.locator('.quantity span').innerText(),'2')
  await page.getByRole('button',{name:'REMOVE'}).click()
  await page.getByText('Nothing in the bag yet.').waitFor()
  console.log('Product validation, add to bag, quantity, reload persistence and removal: passed')
  await page.close()
} finally { await browser.close() }
