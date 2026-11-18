const legacyProducts = [
  {id:'01',slug:'after-hours-ruched-dress',name:'After Hours Ruched Dress',category:'Dresses',price:189900,oldPrice:249900,tag:'',color:'Cherry',tone:'#a43f4a',bg:'#dfc0b9',shape:'dress',description:'A little drama, in the best way. A figure-skimming silhouette made for wherever the night takes you.'},
  {id:'02',slug:'off-duty-wide-leg-jeans',name:'Off-Duty Wide Leg Jeans',category:'Denim',price:219900,tag:'NEW IN',color:'Blue',tone:'#687b8e',bg:'#c5c8c4',shape:'pants',description:'The pair you reach for on repeat. Easy through the leg with an effortlessly lived-in feel.'},
  {id:'03',slug:'the-sculpted-corset-top',name:'The Sculpted Corset Top',category:'Tops',price:129900,oldPrice:169900,tag:'',color:'Black',tone:'#383237',bg:'#d6c6b9',shape:'top',description:'A sharp little statement. Structured lines meet a flattering, ready-for-anything fit.'},
  {id:'04',slug:'main-character-mini-dress',name:'Main Character Mini Dress',category:'Dresses',price:199900,tag:'NEW IN',color:'Cream',tone:'#e5d8c4',bg:'#b6a89b',shape:'dress',description:'Your plans called. This mini brings a little extra to every entrance.'},
  {id:'05',slug:'soft-spot-knit-top',name:'Soft Spot Knit Top',category:'Tops',price:99900,tag:'NEW IN',color:'Pink',tone:'#cf8395',bg:'#e4c9c5',shape:'top',description:'A soft, easy layer with just the right amount of attitude.'},
  {id:'06',slug:'after-dark-cargo-pants',name:'After Dark Cargo Pants',category:'Bottoms',price:209900,tag:'',color:'Black',tone:'#4a4844',bg:'#c6c0b4',shape:'pants',description:'Relaxed proportions and an all-day, all-night point of view.'},
  {id:'07',slug:'weekend-edit-shirt',name:'Weekend Edit Shirt',category:'Tops',price:149900,tag:'',color:'Cream',tone:'#e5ddce',bg:'#cbb6a5',shape:'top',description:'An easy silhouette that makes getting dressed feel like the fun part.'},
  {id:'08',slug:'city-lights-maxi-dress',name:'City Lights Maxi Dress',category:'Dresses',price:239900,tag:'NEW IN',color:'Black',tone:'#38343c',bg:'#b8a8a5',shape:'dress',description:'A long-line silhouette for moments worth dressing up for.'},
  {id:'09',slug:'city-set',name:'City Set',category:'Co-ords',price:199900,tag:'',color:'Cream',tone:'#e5ddce',bg:'#cbb6a5',shape:'top',description:'A fictional coordinated look for the concept.'},
  {id:'10',slug:'cool-weather-layer',name:'Cool Weather Layer',category:'Winterwear',price:229900,tag:'',color:'Black',tone:'#383237',bg:'#d6c6b9',shape:'top',description:'A fictional layering piece for the concept.'}
]
export const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Denim', 'Co-ords', 'Winterwear']
// IDs and slugs remain permanent. Photography identities are versioned separately.
export const catalogRevision = 2
const verified = {
  '01': {name:'Green Halter Mini Dress',color:'Green',tone:'#78936b',image:'/images/products/dresses/29762904.jpg',description:'A green halter-neck dress with a gathered, flared mini skirt.'},
  '02': {name:'Off-Duty Blue Skinny Jeans',color:'Blue',tone:'#9bb8cf',image:'/images/products/denim/17630744.jpg',imageFit:'contain',description:'Light blue skinny jeans, shown from the side with tapered legs and back pockets. The white top is styling only.'},
  '03': {name:'Black Puff Sleeve Crop Top',color:'Black',tone:'#222222',image:'/images/products/tops/17824844.jpg',description:'A black cropped top with a gathered neckline and puff sleeves.'},
  '04': {name:'Navy Floral Dress',color:'Navy',tone:'#263647',image:'/images/products/dresses/13452828.jpg',additionalImages:['/images/products/dresses/13452833.jpg'],description:'A dark navy dress with a small floral print and short sleeves. Belt and accessories are styling only.'},
  '05': {name:'Pink Square Neck Crop Top',color:'Pink',tone:'#e90091',image:'/images/products/tops/17824817.jpg',description:'A bright pink square-neck cropped top, styled under an open black jacket. Jacket is not included.'},
  '06': {name:'Orange Tailored Trousers',color:'Orange',tone:'#d96b24',image:'/images/products/bottoms/10341113.jpg',description:'Orange trousers with pressed front creases and straight legs. Jacket and shoes are styling only.'},
  '07': {name:'Contrast Trim Crop Tee',color:'Black / White',tone:'#252525',image:'/images/products/tops/26050708.jpg',description:'A black short-sleeve cropped tee with white neckline trim and a contrasting white hem.'},
  '08': {name:'Silver Fringe Dress',color:'Silver',tone:'#b8b8bd',image:'/images/products/dresses/34440739.jpg',description:'A silver sleeveless dress with a reflective finish and fringed skirt detailing.'},
  '09': {name:'Orange Off-Shoulder Trouser Set',color:'Orange',tone:'#ff5b08',image:'/images/products/co-ords/15661635.jpg',description:'A coordinated orange off-shoulder crop top and matching ruched trousers. Both pieces are visible together.'},
  '10': {name:'Black Long Puffer Coat',color:'Black',tone:'#202c2b',image:'/images/products/winterwear/10955950.jpg',description:'A long black quilted puffer coat with a hood, photographed outdoors in snow.'},
}
export const products = legacyProducts.map(product => ({...product,...verified[product.id],additionalImages:verified[product.id].additionalImages || [],sizes:['XS','S','M','L','XL'],revision:catalogRevision}))
export const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(value / 100)
export function filterProducts(items, {q='',category='',size='',color='',price='',sort='featured'}={}) {
  const query = q.trim().toLowerCase()
  const result = items.filter(p => (!query || `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(query)) && (!category || p.category.toLowerCase() === category.toLowerCase()) && (!color || p.color.toLowerCase() === color.toLowerCase()) && (!size || ['XS','S','M','L','XL'].includes(size)) && (!price || (price === 'under1500' ? p.price < 150000 : price === '1500plus' ? p.price >= 150000 : true)))
  if (sort === 'price-low') result.sort((a,b) => a.price-b.price)
  if (sort === 'price-high') result.sort((a,b) => b.price-a.price)
  if (sort === 'newest') result.sort((a,b) => b.id.localeCompare(a.id))
  return result
}

