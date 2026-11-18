import { products, catalogRevision } from './data'
export const initialState = { wishlist: [], bag: [], catalogRevision }
export function sanitize(raw) {
  if (!raw || typeof raw !== 'object') return initialState
  if (raw.catalogRevision !== catalogRevision) {
    const legacyBag = Array.isArray(raw.bag) ? raw.bag.filter(item => item && products.some(p => p.id === item.id) && ['XS','S','M','L','XL'].includes(item.size) && typeof item.color === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) : []
    const legacyWishlist = Array.isArray(raw.wishlist) ? [...new Set(raw.wishlist.filter(id => products.some(p => p.id === id)))] : []
    return {...initialState,...(legacyBag.length || legacyWishlist.length ? {previousCatalog:{bag:legacyBag,wishlist:legacyWishlist}} : {})}
  }
  const wishlist = Array.isArray(raw.wishlist) ? [...new Set(raw.wishlist.filter(id => products.some(p => p.id === id)))] : []
  const bag = Array.isArray(raw.bag) ? raw.bag.filter(item => item && products.some(p => p.id === item.id && p.color === item.color) && ['XS','S','M','L','XL'].includes(item.size) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99) : []
  return {wishlist, bag, catalogRevision,...(raw.previousCatalog ? {previousCatalog:raw.previousCatalog} : {})}
}
export function reducer(state, action) {
  switch(action.type) {
    case 'wishlist': return {...state,wishlist:state.wishlist.includes(action.id) ? state.wishlist.filter(id => id !== action.id) : [...state.wishlist,action.id]}
    case 'add': { const found = state.bag.find(x => x.id === action.item.id && x.size === action.item.size && x.color === action.item.color); return {...state,bag:found ? state.bag.map(x => x === found ? {...x,quantity:Math.min(99,x.quantity+1)} : x) : [...state.bag,{...action.item,quantity:1}]} }
    case 'quantity': return {...state,bag:state.bag.map(x => x.id === action.item.id && x.size === action.item.size && x.color === action.item.color ? {...x,quantity:Math.max(1,Math.min(99,action.quantity))} : x)}
    case 'remove': return {...state,bag:state.bag.filter(x => !(x.id === action.item.id && x.size === action.item.size && x.color === action.item.color))}
    default: return state
  }
}
export const subtotal = bag => bag.reduce((sum,item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.quantity,0)
