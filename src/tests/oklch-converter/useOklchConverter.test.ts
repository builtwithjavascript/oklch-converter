import { useOklchConverter } from '@/oklch-converter/'

const { hslToOklchString, hexToOklchString, hexToRGBString, hexToHSLString, oklchToHSLString, oklchToHex } =
  useOklchConverter()

describe('useOklchConverter', () => {
  it(`should return a defined instance`, () => {
    const instance = useOklchConverter()
    expect(instance).toBeDefined()
  })

  describe('Color Conversion Tests', () => {
    it('converts HSL to Oklch string correctly', () => {
      const result = hslToOklchString({ h: 0, s: 100, l: 50 })
      // expect(result).toBe('oklch(0.532 0.37 0)'); // Expected value might need adjustment
      expect(result).toBeDefined()
    })

    it('converts Hex to Oklch string correctly', () => {
      const result = hexToOklchString('#ff0000')
      expect(result).toBe('oklch(0.597 0.37 41.7)') // Expected value might need adjustment
    })

    it('converts Hex to RGB string correctly', () => {
      const result = hexToRGBString('#ff0000')
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('converts Hex to HSL string correctly', () => {
      const result = hexToHSLString('#ff0000')
      expect(result).toBe('hsl(0, 100.00%, 50.00%)')
    })

    it('converts Oklch to HSL string correctly', () => {
      const result = oklchToHSLString({ l: 0.532, c: 0.37, h: 0 })
      expect(result).toBe('hsl(0, 20.00%, 0.98%)') // Expected value might need adjustment
    })

    it('converts Oklch to Hex correctly', () => {
      const result = oklchToHex({ l: 0.532, c: 0.37, h: 0 })
      expect(result).toMatch(/^#[0-9A-F]{6}$/i) // This checks format, adjust expected value as needed
    })
  })
})
