export interface Product {
  id: string
  name: string
  tag: string
  desc: string
  image?: string
  price: string
}

export const products: Product[] = [
  { id: 'HX-01A', name: 'Hex Runner 02', tag: '#HX-01A · JET BLACK', desc: 'Low-profile, matte canvas', price: '$128.00' },
  { id: 'HX-02F', name: 'Hex Trail', tag: '#HX-02F · OLIVE', desc: 'High-ankle, ripstop panel', price: '$164.00' },
  { id: 'HX-03C', name: 'Hex Slide', tag: '#HX-03C · CORK', desc: 'Minimal strap, cork sole', price: '$74.00' },
  { id: 'HX-04E', name: 'Hex Mono', tag: '#HX-04E · CHALK', desc: 'Tonal knit, sock-fit', price: '$142.00' },
]