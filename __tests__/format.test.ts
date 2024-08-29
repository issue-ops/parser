import { jest } from '@jest/globals'
import { formatKey, formatValue } from '../src/format.js'
import { Checkboxes, FormattedField } from '../src/interfaces.js'

describe('formatKey()', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('Removes non-alphanumeric characters', async () => {
    expect(formatKey('!@#$%^&*()_+')).toBe('')
  })

  it('Converts to lowercase', async () => {
    expect(formatKey('ABC')).toBe('abc')
  })

  it('Replaces spaces with underscores', async () => {
    expect(formatKey('a b c')).toBe('a_b_c')
  })

  it('Replaces multiple consecutive underscores with a single underscore', async () => {
    expect(formatKey('a__b__c')).toBe('a_b_c')
  })

  it('Removes leading and trailing underscores', async () => {
    expect(formatKey('_abc_')).toBe('abc')
  })

  it('Removes leading and trailing whitespace', async () => {
    expect(formatKey(' abc ')).toBe('abc')
  })

  it('Handles empty strings', async () => {
    expect(formatKey('')).toBe('')
  })
})

describe('formatValue()', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('Handles invalid types', async () => {
    expect(
      formatValue('ABCDEF', {
        type: 'invalid',
        required: true
      } as unknown as FormattedField)
    ).toBe(null)
  })

  it('Handles empty strings', async () => {
    expect(
      formatValue('', {
        label: 'Input Test',
        type: 'input',
        required: true
      })
    ).toBe('')
  })

  it('Handles None', async () => {
    expect(
      formatValue('None', {
        label: 'Dropdown Test',
        type: 'dropdown',
        required: true,
        multiple: false,
        options: ['a', 'b', 'c']
      })
    ).toStrictEqual([])
  })

  it('Handles _No response_', async () => {
    expect(
      formatValue('_No response_', {
        label: 'Dropdown Test',
        type: 'dropdown',
        required: true,
        multiple: false,
        options: ['a', 'b', 'c']
      })
    ).toStrictEqual([])
  })

  it('Handles checkboxes', async () => {
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
        label: 'Checkboxes Test',
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

  it('Handles no checkboxes', async () => {
    const value = ''

    const expected: Checkboxes = {
      selected: [],
      unselected: []
    }

    expect(
      formatValue(value, {
        label: 'Checkboxes Test',
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

  it('Handles multiline strings', async () => {
    const value = `a
b
c`

    expect(
      formatValue(value, {
        label: 'Textarea Test',
        type: 'textarea',
        required: true
      })
    ).toBe(value)
  })
})
