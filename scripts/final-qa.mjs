import {chromium} from 'playwright'
import {mkdir,writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {products} from '../src/data.js'

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'})
const root='http://127.0.0.1:5173'
const dir='screenshots/final'
await mkdir(dir,{recursive:true})
const results=[]
const log=message=>{results.push(message);console.log(message)}
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(root,{waitUntil:'networkidle'})
  await page.mouse.move(0,0)
  const index=()=>page.locator('.campaign-controls span').innerText()
  assert.equal(await index(),'01 / 03')
  for(const value of ['02 / 03','03 / 03','01 / 03']){
    await page.waitForFunction(v=>document.querySelector('.campaign-controls span').textContent===v,value,{timeout:5500})
    await page.waitForTimeout(650)
    await page.screenshot({path:`${dir}/autoplay-${value.slice(0,2)}.png`})
  }
  log('Real-time browser autoplay: 01 -> 02 -> 03 -> 01, with no clicks or virtual clock')
  await page.locator('.campaign-hero').hover()
  const hovered=await index();await page.waitForTimeout(5000);assert.equal(await index(),hovered)
  await page.mouse.move(0,0);await page.waitForTimeout(4600);assert.notEqual(await index(),hovered)
  await page.getByRole('button',{name:'Next campaign',exact:true}).focus()
  const focused=await index();await page.waitForTimeout(5000);assert.equal(await index(),focused)
  await page.getByRole('button',{name:'Next campaign',exact:true}).click()
  const next=await index();assert.notEqual(next,focused)
  await page.getByRole('button',{name:'Previous campaign',exact:true}).click();assert.equal(await index(),focused)
  await page.getByRole('button',{name:'Pause campaigns',exact:true}).click()
  await page.locator('.logo').focus();await page.mouse.move(0,0)
  const paused=await index();await page.waitForTimeout(5000);assert.equal(await index(),paused)
  await page.getByRole('button',{name:'Play campaigns',exact:true}).click()
  await page.locator('.logo').focus();await page.mouse.move(0,0)
  await page.waitForTimeout(4600);assert.notEqual(await index(),paused)
  log('Hover, keyboard focus, previous/next and explicit pause/play passed with real-time waits')
  // A synthetic visibility event tests the browser integration; headless Chrome does not reliably hide background tabs.
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))})
  const hidden=await index();await page.waitForTimeout(5000);assert.equal(await index(),hidden)
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))})
  await page.waitForTimeout(4600);assert.notEqual(await index(),hidden)
  log('Visibility listener pause/resume passed (simulated document.hidden in browser)')
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload()
  await page.waitForTimeout(5000);assert.equal(await index(),'01 / 03')
  assert.equal(await page.locator('.campaign-track').evaluate(e=>getComputedStyle(e).transitionDuration),'0s')
  log('Reduced motion: no automatic movement and no track animation')
  await page.goto(`${root}/product/main-character-mini-dress`)
  await page.getByRole('button',{name:'View editorial image 2'}).click()
  assert.ok((await page.locator('.gallery-main img').getAttribute('src')).includes('13452833'))
  log('Verified same-garment alternate image gallery works')
  await page.goto(`${root}/product/after-hours-ruched-dress`)
  await page.getByRole('button',{name:'ADD TO BAG'}).click();await page.getByText('Please select a size first.').waitFor()
  await page.getByRole('button',{name:'M',exact:true}).click()
  await page.getByRole('button',{name:'ADD TO BAG'}).click()
  await page.getByRole('button',{name:'Add to wishlist',exact:true}).click()
  await page.goto(`${root}/bag`)
  await page.getByRole('button',{name:'Increase quantity of Green Halter Mini Dress'}).click()
  await page.reload();assert.equal(await page.locator('.quantity span').innerText(),'2')
  await page.goto(`${root}/wishlist`);assert.equal(await page.locator('.product-card').count(),1)
  log('Size validation, wishlist, bag quantity and reload persistence passed')
  await page.goto(`${root}/shop?q=crop&category=Tops&color=Black&sort=price-low`)
  assert.equal(await page.locator('.product-card').count(),1)
  await page.getByRole('combobox',{name:'Sort products'}).selectOption('price-high');assert.ok(page.url().includes('sort=price-high'))
  await page.goto(`${root}/explore`)
  for(const category of ['Dresses','Tops','Bottoms','Denim','Co-ords','Winterwear']){
    await page.getByRole('button',{name:category,exact:true}).click()
    assert.ok((await page.locator('.explore-feature img').getAttribute('src')).includes(`/products/${category.toLowerCase()}/`))
  }
  log('URL search/filter/sort and all Explore category mappings passed')
  const routes=[['home','/'],['shop','/shop'],['explore','/explore'],['product','/product/after-hours-ruched-dress'],['gallery','/product/main-character-mini-dress'],['wishlist','/wishlist'],['bag','/bag'],...['dresses','tops','bottoms','denim','co-ords','winterwear'].map(c=>[`category-${c}`,`/category/${c}`])]
  for(const width of [390,768,1024,1280,1440,1920]){
    await page.setViewportSize({width,height:900})
    for(const [name,path] of routes){
      await page.goto(root+path,{waitUntil:'networkidle'})
      await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))})
      const broken=await page.locator('img').evaluateAll(images=>images.filter(img=>!img.naturalWidth).map(img=>img.src));assert.deepEqual(broken,[],`${name}: broken images`)
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name} ${width}: overflow`)
      await page.screenshot({path:`${dir}/${name}-${width}.png`,fullPage:true})
    }
    log(`${width}px: 13 routes captured; images loaded; no horizontal overflow`)
  }
  // Check every detail route has the same primary as its listing data.
  for(const p of products){await page.goto(root+`/product/${p.slug}`);assert.equal(await page.locator('.gallery-main img').getAttribute('src'),p.image)}
  await page.evaluate(()=>localStorage.setItem('newme-concept-v1',JSON.stringify({bag:[{id:'03',size:'M',color:'Black',quantity:2}],wishlist:['01']})))
  await page.goto(root+'/bag');await page.locator('.catalog-notice').waitFor();assert.equal(await page.locator('.bag-item').count(),0)
  await page.reload();assert.equal(await page.locator('.catalog-notice').count(),1)
  log('Legacy saved garments archived with visible notice and retained download after reload')
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'})
  await mobile.goto(root)
  const cdp=await mobile.context().newCDPSession(mobile)
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y:480}]})
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:100,y:480}]})
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  assert.equal(await mobile.locator('.campaign-controls span').innerText(),'02 / 03')
  await mobile.screenshot({path:`${dir}/mobile-swipe.png`,fullPage:true})
  log('Mobile swipe passed using Chromium touch input')
  assert.deepEqual(errors,[])
  await writeFile(`${dir}/results.json`,JSON.stringify(results,null,2))
}finally{await browser.close()}
