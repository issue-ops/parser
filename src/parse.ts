import * as core from '@actions/core'
import fs from 'fs'
import yaml from 'yaml'
import { formatKey, formatValue } from './format.js'
import {
  Checkboxes,
  CheckboxesField,
  DropdownField,
  FormattedField,
  InputField,
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
    const header: string = match.groups?.key || ''
    let value: string | string[] | Checkboxes | null = match.groups?.value || ''
    let key: string | undefined = undefined

    // Skip malformed sections
    if (header === '' || value === '') continue

    // Get the key by matching the body header with the template labels.
    for (const [k, v] of Object.entries(template)) {
      if (v.label === header) {
        key = k
        break
      }
    }

    // Skip the field if there was no matching key.
    if (!key) {
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

    core.info(`Key: ${key}`)
    core.info(
      `Value: ${typeof value === 'string' ? value : JSON.stringify(value)}`
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
  templatePath: string
): Promise<{ [key: string]: FormattedField }> {
  const fields: { [key: string]: FormattedField } = {}

  // Verify the template exists
  if (!fs.existsSync(templatePath))
    throw new Error(`Template not found: ${templatePath}`)

  const template = yaml.parse(fs.readFileSync(templatePath, 'utf8'))

  for (const item of template.body) {
    // Skip markdown fields
    if (item.type === 'markdown') continue

    // Check if the ID is present in the field attributes. If so, use it as the
    // key. Otherwise, convert the label to snake case (this is the heading in
    // the issue body when the form is submitted).
    const key: string =
      item.id || formatKey((item as InputField).attributes.label)

    // Take the rest of the attributes and add them to the fields object
    fields[key] = {
      type: item.type,
      label: (item as InputField).attributes.label,
      required: (item as InputField).validations?.required || false
    }

    if (item.type === 'dropdown') {
      // These fields are only used by dropdowns
      fields[key].multiple =
        (item as DropdownField).attributes.multiple || false
      fields[key].options = (item as DropdownField).attributes.options
    }

    if (item.type === 'checkboxes') {
      // Checkboxes have a different options format than dropdowns
      // Enforce false for required if not present
      fields[key].options = (item as CheckboxesField).attributes.options.map(
        (x) => {
          return { label: x.label, required: x.required || false }
        }
      )
    }
  }

  return fields
}
