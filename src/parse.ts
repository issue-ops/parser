import * as core from '@actions/core'
import { formatKey, formatValue } from './format.js'
import {
  Checkboxes,
  FormattedField,
  IssueFormTemplate,
  ParsedBody
} from './interfaces.js'

/**
 * Helper function to parse the body of the issue template
 *
 * @param body The body of the issue template
 * @param template The issue form template
 * @returns {object} A dictionary of the parsed body
 */
export async function parseIssue(
  body: string,
  template: { [key: string]: FormattedField }
): Promise<ParsedBody> {
  const parsedBody: {
    [key: string]: string | string[] | Checkboxes
  } = {}

  // Match the sections of the issue body
  const regexp = /### *(?<key>.*?)\s*[\r\n]+(?<value>[\s\S]*?)(?=###|$)/g
  const matches = body.matchAll(regexp)

  for (const match of matches) {
    let key: string = match.groups?.key || ''
    let value: string | string[] | Checkboxes | null = match.groups?.value || ''

    // Skip malformed sections
    if (key === '' || value === '') continue

    // Format the key to camelcase
    key = formatKey(key)

    // Check if the key is in the template
    if (!template[key]) {
      core.warning(`Skipping key not found in template: ${key}`)
      continue
    }

    // Format the value (returns null if the value couldn't be parsed)
    value = formatValue(value, template[key])
    /* istanbul ignore next */
    if (value === null) {
      core.warning(`Skipping invalid value for key: ${key}`)
      continue
    }

    core.info(`Formatted Key: ${key}`)
    core.info(
      `Formatted Value: ${
        typeof value === 'string' ? value : JSON.stringify(value)
      }`
    )

    // Add to the parsed issue body
    parsedBody[key] = value
  }

  // Return the dictionary
  return parsedBody
}

/**
 * Parses the issue form template and returns a dictionary of fields
 * @param template The issue form template
 * @returns A dictionary of fields
 */
export async function parseTemplate(
  template: IssueFormTemplate
): Promise<{ [key: string]: FormattedField }> {
  const fields: { [key: string]: FormattedField } = {}

  for (const item of template.body) {
    // Skip markdown fields
    if (item.type === 'markdown') continue

    // Convert the label to snake case. This is the heading in the issue body
    // when the form is submitted, and is used by issue-ops/parser as the key.
    const formattedKey: string = formatKey(item.attributes.label)

    // Take the rest of the attributes and add them to the fields object
    fields[formattedKey] = {
      type: item.type,
      required: item.validations?.required || false
    }

    if (item.type === 'dropdown') {
      // These fields are only used by dropdowns
      fields[formattedKey].multiple = item.attributes.multiple || false
      fields[formattedKey].options = item.attributes.options
    }

    if (item.type === 'checkboxes') {
      // Checkboxes have a different options format than dropdowns
      // Enforce false for required if not present
      fields[formattedKey].options = item.attributes.options.map((x) => {
        return { label: x.label, required: x.required || false }
      })
    }
  }

  return fields
}
