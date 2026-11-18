import {describe,it,expect} from 'vitest'
import {existsSync,readFileSync} from 'node:fs'
import {products,catalogRevision} from './data'
import {sanitize,reducer,initialState} from './store'

describe('verified photography catalogue',()=>{
  it('has unique permanent identities, explicit unique local photos and no positional assignment',()=>{
    expect(new Set(products.map(p=>p.id)).size).toBe(10)
    expect(new Set(products.map(p=>p.slug)).size).toBe(10)
    expect(new Set(products.map(p=>p.image)).size).toBe(10)
    for(const p of products){
      expect(p.image).toContain(`/products/${p.category.toLowerCase()}/`)
      for(const image of [p.image,...p.additionalImages]) expect(existsSync(`public${image}`)).toBe(true)
      expect(p.sizes).toEqual(['XS','S','M','L','XL'])
      expect(p.revision).toBe(catalogRevision)
      expect(readFileSync('public/images/ATTRIBUTION.md','utf8')).toContain(p.image.split('/').at(-1))
    }
    for(const file of ['src/main.jsx','src/redesign.jsx']) expect(readFileSync(file,'utf8')).not.toMatch(/photos\[|Number\(.*\.id/)
  })
  it('archives legacy garments even when their old color still matches',()=>{
    const legacy={wishlist:['01','03'],bag:[{id:'03',color:'Black',size:'M',quantity:2},{id:'01',color:'Cherry',size:'S',quantity:1}]}
    const migrated=sanitize(legacy)
    expect(migrated.bag).toEqual([])
    expect(migrated.wishlist).toEqual([])
    expect(migrated.previousCatalog).toEqual(legacy)
    expect(sanitize(JSON.parse(JSON.stringify(migrated)))).toEqual(migrated)
  })
  it('preserves new selections and rejects corrupt variants after reload',()=>{
    const p=products[0]
    const state=reducer(initialState,{type:'add',item:{id:p.id,color:p.color,size:'M'}})
    expect(sanitize(state)).toEqual(state)
    expect(sanitize({...state,bag:[null,{id:p.id,color:'Cherry',size:'M',quantity:1}]}).bag).toEqual([])
  })
})
