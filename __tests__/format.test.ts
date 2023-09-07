/**
 * Unit tests for the action's format.ts file.
 */

import { formatKey, formatValue } from '../src/format'
import { Checkboxes } from '../src/interfaces'

describe('formatKey', () => {
  it('removes non-alphanumeric characters', async () => {
    expect(formatKey('!@#$%^&*()_+')).toBe('')
  })

  it('converts to lowercase', async () => {
    expect(formatKey('ABC')).toBe('abc')
  })

  it('replaces spaces with underscores', async () => {
    expect(formatKey('a b c')).toBe('a_b_c')
  })

  it('replaces multiple consecutive underscores with a single underscore', async () => {
    expect(formatKey('a__b__c')).toBe('a_b_c')
  })

  it('removes leading and trailing underscores', async () => {
    expect(formatKey('_abc_')).toBe('abc')
  })

  it('removes leading and trailing whitespace', async () => {
    expect(formatKey(' abc ')).toBe('abc')
  })

  it('handles empty strings', async () => {
    expect(formatKey('')).toBe('')
  })
})

describe('formatValue', () => {
  it('handles empty strings', async () => {
    expect(formatValue('')).toBe(null)
  })

  it('handles None', async () => {
    expect(formatValue('None')).toBe(null)
  })

  it('handles _No response_', async () => {
    expect(formatValue('_No response_')).toBe(null)
  })

  it('handles single-line CSV', async () => {
    expect(formatValue('a,b,c')).toStrictEqual(['a', 'b', 'c'])
    expect(formatValue('a, b, c')).toStrictEqual(['a', 'b', 'c'])
    expect(formatValue(' a , b , c ')).toStrictEqual(['a', 'b', 'c'])
    expect(formatValue('a,,b,c')).toStrictEqual(['a', '', 'b', 'c'])
    expect(formatValue('a, ,b,c')).toStrictEqual(['a', '', 'b', 'c'])
  })

  it('handles single-line CSV with csvToList=false', async () => {
    expect(formatValue('a,b,c', false)).toBe('a,b,c')
    expect(formatValue('a, b, c', false)).toBe('a, b, c')
    expect(formatValue(' a , b , c ', false)).toBe('a , b , c')
    expect(formatValue('a,,b,c', false)).toBe('a,,b,c')
    expect(formatValue('a, ,b,c', false)).toBe('a, ,b,c')
  })

  it('handles checkboxes', async () => {
    const value = `- [ ] a
- [x] b
- [ ] c
- [x] d
- [ ] e`

    const expected: Checkboxes = {
      selected: ['b', 'd'],
      unselected: ['a', 'c', 'e']
    }

    expect(formatValue(value)).toStrictEqual(expected)
  })

  it('handles multiline strings', async () => {
    const value = `a
b
c`

    expect(formatValue(value)).toBe(value)
  })

  it('handles multiline strings with checkboxes', async () => {
    const value = `- [ ] a
- [x] b
- [ ] c
d
e`

    expect(formatValue(value)).toBe(value)
  })
})
