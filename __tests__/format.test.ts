import { jest } from '@jest/globals'
import { formatKey, formatValue } from '../src/format.js'
import { Checkboxes, FormattedField } from '../src/interfaces.js'

describe('formatKey', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

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
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('handles invalid types', async () => {
    expect(
      formatValue('ABCDEF', {
        type: 'invalid',
        required: true
      } as unknown as FormattedField)
    ).toBe(null)
  })

  it('handles empty strings', async () => {
    expect(
      formatValue('', {
        type: 'input',
        required: true
      })
    ).toBe('')
  })

  it('handles None', async () => {
    expect(
      formatValue('None', {
        type: 'dropdown',
        required: true,
        multiple: false,
        options: ['a', 'b', 'c']
      })
    ).toStrictEqual([])
  })

  it('handles _No response_', async () => {
    expect(
      formatValue('_No response_', {
        type: 'dropdown',
        required: true,
        multiple: false,
        options: ['a', 'b', 'c']
      })
    ).toStrictEqual([])
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

    expect(
      formatValue(value, {
        type: 'checkboxes',
        required: true,
        options: [
          { label: 'a', required: false },
          { label: 'b', required: false },
          { label: 'c', required: false }
        ]
      })
    ).toStrictEqual(expected)
  })

  it('handles no checkboxes', async () => {
    const value = ''

    const expected: Checkboxes = {
      selected: [],
      unselected: []
    }

    expect(
      formatValue(value, {
        type: 'checkboxes',
        required: true,
        options: [
          { label: 'a', required: false },
          { label: 'b', required: false },
          { label: 'c', required: false }
        ]
      })
    ).toStrictEqual(expected)
  })

  it('handles multiline strings', async () => {
    const value = `a
b
c`

    expect(
      formatValue(value, {
        type: 'textarea',
        required: true
      })
    ).toBe(value)
  })
})
