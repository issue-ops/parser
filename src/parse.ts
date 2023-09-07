import * as core from '@actions/core'
import { formatKey, formatValue } from './format'
import { Checkboxes, ParsedBody } from './interfaces'

/**
 * Helper function to parse the body of the issue template
 *
 * @param {string} body The body of the issue template
 * @returns {object} A dictionary of the parsed body
 */
export async function parse(
  body: string,
  csvToList = true
): Promise<ParsedBody> {
  const parsedBody: {
    [key: string]: string | string[] | Checkboxes | null
  } = {}

  // Match the sections of the issue body
  const regexp = /### *(?<key>.*?)\s*[\r\n]+(?<value>[\s\S]*?)(?=###|$)/g
  const matches = body.matchAll(regexp)

  for (const match of matches) {
    let key: string = match.groups?.key || ''
    let value: any = match.groups?.value || ''

    if (key === '' || value === '') continue

    core.info(`Unformatted Key: ${key}`)
    core.info(`Unformatted Value: ${value}`)

    key = formatKey(key)
    value = formatValue(value, csvToList)

    core.info(`Formatted Key: ${key}`)
    core.info(`Formatted Value: ${JSON.stringify(value)}`)

    parsedBody[key] = value
  }

  // Return the dictionary
  return parsedBody
}
