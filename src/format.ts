import { Checkboxes } from './interfaces'

/**
 * Formats a input name to a snake case string
 *
 * - Removes leading and trailing whitespace
 * - Converts to lowercase
 * - Replaces spaces with underscores
 * - Replaces non-alphanumeric characters with underscores
 * - Replaces multiple consecutive underscores with a single underscore
 */
export function formatKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
}

/**
 * Formats a input value to an appropriate type
 */
export function formatValue(
  input: string,
  csvToList = true
): string | string[] | Checkboxes | null {
  // Remove any whitespace
  // Remove any carriage returns
  // Remove any leading or trailing newlines
  const value = input
    .trim()
    .replace(/\r/g, '')
    .replace(/^[\n]+|[\n]+$/g, '')

  // Check for empty response
  if (value === 'None' || value === '_No response_' || value === '') {
    return null
  }

  // Check for single-line CSV
  if (
    csvToList &&
    value.includes('\n') === false &&
    value.includes(',') === true
  ) {
    return value.split(',').map((item) => item.trim())
  }

  // Check for non-checkbox lines
  // If found, return as a multiline string
  for (const line of value.split('\n')) {
    if (
      line.startsWith('- [ ] ') === false &&
      line.startsWith('- [x] ') === false
    ) {
      return value
    }
  }

  // At this point, we know that the value is a checkbox list
  const checkboxes: Checkboxes = {
    selected: [],
    unselected: []
  }

  for (let line of value.split('\n')) {
    line = line.trim()
    line.startsWith('- [x] ')
      ? checkboxes.selected.push(line.replace('- [x] ', ''))
      : checkboxes.unselected.push(line.replace('- [ ] ', ''))
  }

  return checkboxes
}
