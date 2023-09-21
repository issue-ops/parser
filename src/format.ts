import { Checkboxes, FormattedField } from './interfaces'

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
  template: FormattedField
): string | string[] | Checkboxes | null {
  // Remove any whitespace
  // Remove any carriage returns
  // Remove any leading or trailing newlines
  const value = input
    .trim()
    .replace(/\r/g, '')
    .replace(/^[\n]+|[\n]+$/g, '')

  // Parse input field types
  switch (template.type) {
    case 'input':
    case 'textarea': {
      // Return empty string if no response was provided
      // Otherwise, return the formatted response
      return value === 'None' || value === '_No response_' || value === ''
        ? ''
        : value
    }
    case 'dropdown': {
      // Return empty list if no response was provided
      // Otherwise, split by commas and return the list
      return value === 'None' || value === '_No response_' || value === ''
        ? []
        : value.split(/, */)
    }
    case 'checkboxes': {
      const checkboxes: Checkboxes = {
        selected: [],
        unselected: []
      }

      // Return empty object if no response was provided
      if (value === 'None' || value === '_No response_' || value === '')
        return checkboxes

      // Split response by newlines
      // Add checked items to selected
      // Add unchecked items to unselected
      for (let line of value.split('\n')) {
        line = line.trim()
        line.startsWith('- [x] ')
          ? checkboxes.selected.push(line.replace('- [x] ', ''))
          : checkboxes.unselected.push(line.replace('- [ ] ', ''))
      }

      return checkboxes
    }
    default:
      // Ignore anything else
      return null
  }
}
