/**
 * Unit tests for the action's parse.ts file.
 */

import { parse } from '../src/parse'
import fs from 'fs'

describe('parse', () => {
  it('should parse a blank issue', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/blank/issue.md', 'utf8')
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/blank/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse a bug report issue', async () => {
    const issue = fs.readFileSync(
      '__tests__/fixtures/bug-report/issue.md',
      'utf8'
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/bug-report/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with missing data', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/missing/issue.md', 'utf8')
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/missing/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with fields omitted', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/omitted/issue.md', 'utf8')
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/omitted/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with paragraph responses', async () => {
    const issue = fs.readFileSync(
      '__tests__/fixtures/paragraph/issue.md',
      'utf8'
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/paragraph/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with invalid formatting', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/invalid/issue.md', 'utf8')
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/invalid/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with no headers', async () => {
    const issue = fs.readFileSync(
      '__tests__/fixtures/no-header/issue.md',
      'utf8'
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/no-header/expected.json', 'utf8')
    )

    const result = await parse(issue)
    expect(result).toEqual(expected)
  })
})
