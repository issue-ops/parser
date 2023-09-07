/**
 * A parsed issue body
 *
 * Each key can be a string. Each value can be a string, list of strings,
 * object, or null.
 */
export interface ParsedBody {
  [key: string]: string | string[] | Checkboxes | null
}

/**
 * A parsed checkboxes input
 */
export interface Checkboxes {
  selected: string[]
  unselected: string[]
}
