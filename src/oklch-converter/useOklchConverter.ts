import { THSL, TRGB, TLCH } from './types'

export const useOklchConverter = () => {
  const hslToString = (hsl: THSL) => {
    const { h, s, l } = hsl
    return `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, ${l.toFixed(2)}%)`
  }
  const rgbToString = (rgb: TRGB) => {
    const { r, g, b } = rgb
    return `rgb(${r}, ${g}, ${b})`
  }

  const rgbToHex = (rgb: TRGB): string => {
    const { r, g, b } = rgb
    const toHex = (c: number): string => {
      return c.toString(16).padStart(2, '0')
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const rgbToHSL = (rgb: TRGB): THSL => {
    let { r, g, b } = rgb
    ;(r /= 255), (g /= 255), (b /= 255)

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    let l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  const oklchToRGB = (lch: TLCH): TRGB => {
    // Convert Oklch to CIELAB
    const { l, c, h } = lch
    const aLab = c * Math.cos((h * Math.PI) / 180)
    const bLab = c * Math.sin((h * Math.PI) / 180)

    // Convert CIELAB to CIE XYZ
    let y = (l + 16) / 116
    let x = aLab / 500 + y
    let z = y - bLab / 200
    x = 0.95047 * (x ** 3 > 0.008856 ? x ** 3 : (x - 16 / 116) / 7.787)
    y = 1.0 * (y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787)
    z = 1.08883 * (z ** 3 > 0.008856 ? z ** 3 : (z - 16 / 116) / 7.787)

    // Convert CIE XYZ to Linear RGB
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415
    let b = x * 0.0557 + y * -0.204 + z * 1.057

    // Convert Linear RGB to RGB
    r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r
    g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g
    b = b > 0.0031308 ? 1.055 * b ** (1 / 2.4) - 0.055 : 12.92 * b

    // Clamp and round the values to get valid RGB
    r = Math.min(Math.max(0, r), 1)
    g = Math.min(Math.max(0, g), 1)
    b = Math.min(Math.max(0, b), 1)

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  const oklchToHSL = (oklch: TLCH): THSL => {
    const rgb = oklchToRGB(oklch)
    return rgbToHSL(rgb)
  }
  const oklchToHSLString = (oklch: TLCH): string => {
    return hslToString(oklchToHSL(oklch))
  }

  const oklchToHex = (oklch: TLCH): string => {
    const rgb = oklchToRGB(oklch)
    return rgbToHex(rgb)
  }

  const hexToRGB = (hex: string): TRGB => {
    let r: number = parseInt(hex.slice(1, 3), 16)
    let g: number = parseInt(hex.slice(3, 5), 16)
    let b: number = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }
  const hexToRGBString = (hex: string): string => {
    return rgbToString(hexToRGB(hex))
  }

  const hexToHSL = (hex: string): THSL => {
    const rgb = hexToRGB(hex)
    return rgbToHSL(rgb)
  }
  const hexToHSLString = (hex: string): string => {
    return hslToString(hexToHSL(hex))
  }

  const hslToRGB = (hsl: THSL): TRGB => {
    const { h, s, l } = hsl
    let r, g, b

    if (s === 0) {
      r = g = b = l // Achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  const rgbToOklch = (rgb: TRGB): TLCH => {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    // Apply sRGB to Linear RGB conversion
    let linearR: number, linearG: number, linearB: number
    ;[linearR, linearG, linearB] = [r, g, b].map((c: number) =>
      c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    )

    // Convert Linear RGB to CIE XYZ
    let x: number = linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375
    let y: number = linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.072175
    let z: number = linearR * 0.0193339 + linearG * 0.119192 + linearB * 0.9503041

    // Convert CIE XYZ to CIELAB
    ;[x, y, z] = [x, y, z].map((c: number) => (c > 0.008856 ? c ** (1 / 3) : (903.3 * c + 16) / 116))
    let l: number = 116 * y - 16
    let a: number = 500 * (x - y)
    let bStar: number = 200 * (y - z)

    // Convert CIELAB to Oklch
    //let c: number = Math.sqrt(a * a + bStar * bStar);
    let h: number = Math.atan2(bStar, a) * (180 / Math.PI)
    if (h < 0) h += 360

    // Assume c_max is the maximum chroma value observed or expected in your conversions
    const c_max = 100 /* your determined or observed maximum chroma value */
    // Adjusted part of the rgbToOklch function for calculating 'c'
    let c: number = Math.sqrt(a * a + bStar * bStar)
    c = (c / c_max) * 0.37 // Scale c to be within 0 and 0.37

    // Scale and round values to match the specified ranges
    l = Math.round(((l + 16) / 116) * 1000) / 1000 // Scale l to be between 0 and 1
    c = Number(c.toFixed(2)) // Ensure c is correctly scaled, adjust if necessary based on your color space calculations
    h = Number(h.toFixed(1)) // h is already within 0 to 360

    return {
      l,
      c,
      h
    }
  }
  const rgbToOklchString = (rgb: TRGB): string => {
    const { l, c, h } = rgbToOklch(rgb)
    return `oklch(${l} ${c} ${h})`
  }

  const hexToOklchString = (hex: string): string => {
    // Use hexToRGB to convert hex to RGB
    const rgb = hexToRGB(hex)
    // Use rgbToOklch to convert RGB to Oklch
    return rgbToOklchString(rgb)
  }

  const hslToOklchString = (hsl: THSL): string => {
    // Use hslToRGB to convert HSL to RGB
    const rgb = hslToRGB(hsl)
    // Use rgbToOklch to convert RGB to Oklch
    return rgbToOklchString(rgb)
  }

  return {
    hslToOklchString,
    hexToOklchString,
    hexToRGBString,
    hexToHSLString,

    oklchToHSLString,
    oklchToHex
  }
}
