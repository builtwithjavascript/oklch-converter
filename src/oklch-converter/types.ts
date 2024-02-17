// export interface Oklch {
//   mode: 'oklch'
//   l: number
//   c: number
//   h?: number
//   alpha?: number
// }

// export interface Hsl {
//   mode: 'hsl'
//   h?: number
//   s: number
//   l: number
//   alpha?: number
// }
// export type TStringToStringArray = (value: string) => string[]
// export type TConvertHexValue = (strHex: string, useOkLch: boolean) => string[]
// export type TOklchStringFromHex = (strHex: string) => string

export type TRGB = { r: number; g: number; b: number }
export type THSL = { h: number; s: number; l: number }
export type TLCH = { l: number; c: number; h: number }
