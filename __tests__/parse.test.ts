/**
 * Unit tests for the action's parse.ts file.
 */

import fs from 'fs'
import * as core from '@actions/core'
import { parseIssue } from '../src/parse'
import * as format from '../src/format'

describe('parseIssue', () => {
  beforeEach(() => {
    jest.spyOn(core, 'info').mockImplementation()
    jest.spyOn(core, 'setFailed').mockImplementation()
    jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('should parse a blank issue', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/blank/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/blank/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/blank/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('should parse an example request', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/example/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/example/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/example/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('should parse an invalid issue', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/invalid/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/invalid/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/invalid/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with missing data', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/missing/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/missing/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/missing/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with missing headers', async () => {
    const issue = fs.readFileSync('__tests__/fixtures/header/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/header/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/header/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('should parse an issue with extra fields', async () => {
    const warningMock = jest.spyOn(core, 'warning').mockImplementation()

    const issue = fs.readFileSync('__tests__/fixtures/extra/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/extra/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/extra/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
    expect(warningMock).toHaveBeenCalled()
  })

  it('should skip extra fields', async () => {
    const warningMock = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(format, 'formatValue').mockImplementation(() => null)

    const issue = fs.readFileSync('__tests__/fixtures/extra/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__tests__/fixtures/extra/parsed-template.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual({})
    expect(warningMock).toHaveBeenCalled()
  })
})
