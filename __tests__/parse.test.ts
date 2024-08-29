import { jest } from '@jest/globals'
import fs from 'fs'
import * as core from '../__fixtures__/core.js'

jest.unstable_mockModule('@actions/core', () => core)

const { parseIssue, parseTemplate } = await import('../src/parse.js')

describe('parseIssue()', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('Parses a blank issue', async () => {
    const issue = fs.readFileSync('__fixtures__/blank/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/blank/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/blank/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('Parses an example request', async () => {
    const issue = fs.readFileSync('__fixtures__/example/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/example/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/example/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('Parses an invalid issue', async () => {
    const issue = fs.readFileSync('__fixtures__/invalid/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/invalid/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/invalid/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('Parses an issue with missing data', async () => {
    const issue = fs.readFileSync('__fixtures__/missing/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/missing/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/missing/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('Parses an issue with missing headers', async () => {
    const issue = fs.readFileSync('__fixtures__/header/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/header/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/header/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })

  it('Parses an issue with extra fields', async () => {
    const issue = fs.readFileSync('__fixtures__/extra/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/extra/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/extra/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
    expect(core.warning).toHaveBeenCalled()
  })

  it('Parses an issue without IDs in fields', async () => {
    const issue = fs.readFileSync('__fixtures__/no-ids/issue.md', 'utf8')
    const template = JSON.parse(
      fs.readFileSync('__fixtures__/no-ids/parsed-template.json', 'utf8')
    )
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/no-ids/parsed-issue.json', 'utf8')
    )

    const result = await parseIssue(issue, template)
    expect(result).toEqual(expected)
  })
})

describe('parseTemplate()', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('Parses a template with IDs', async () => {
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/example/parsed-template.json', 'utf8')
    )

    const result = await parseTemplate('__fixtures__/example/template.yml')
    expect(result).toEqual(expected)
  })

  it('Parses a template without IDs', async () => {
    const expected = JSON.parse(
      fs.readFileSync('__fixtures__/no-ids/parsed-template.json', 'utf8')
    )

    const result = await parseTemplate('__fixtures__/no-ids/template.yml')
    expect(result).toEqual(expected)
  })

  it('Throws if the template is not found', async () => {
    await expect(
      parseTemplate('__fixtures__/does-not-exist.yml')
    ).rejects.toThrow('Template not found: __fixtures__/does-not-exist.yml')
  })
})
