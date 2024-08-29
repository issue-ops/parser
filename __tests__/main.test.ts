import { jest } from '@jest/globals'
import fs from 'fs'
import * as core from '../__fixtures__/core.js'

const parseIssueSpy = jest.fn()
const parseTemplateSpy = jest.fn()

const issue = fs.readFileSync('__fixtures__/example/issue.md', 'utf-8')
const parsedIssue = JSON.parse(
  fs.readFileSync('__fixtures__/example/parsed-issue.json', 'utf-8')
)
const parsedTemplate = JSON.parse(
  fs.readFileSync('__fixtures__/example/parsed-template.json', 'utf-8')
)

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/parse.js', () => ({
  parseIssue: parseIssueSpy,
  parseTemplate: parseTemplateSpy
}))

const main = await import('../src/main.js')

describe('main', () => {
  beforeEach(() => {
    core.getInput
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('example.yml')
      .mockReturnValueOnce(process.cwd())

    parseIssueSpy.mockReturnValue(parsedIssue)
    parseTemplateSpy.mockReturnValue(parsedTemplate)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns the parsed body', async () => {
    await main.run()

    expect(core.getInput).toHaveBeenCalledWith('body', { required: true })
    expect(core.getInput).toHaveReturnedWith(issue)
    expect(core.getInput).toHaveBeenCalledWith('issue-form-template', {
      required: true
    })
    expect(core.getInput).toHaveReturnedWith('example.yml')
    expect(core.getInput).toHaveBeenCalledWith('workspace', { required: true })
    expect(core.getInput).toHaveReturnedWith(process.cwd())

    expect(core.setOutput).toHaveBeenCalledWith(
      'json',
      JSON.stringify(parsedIssue)
    )
  })

  it('Fails if a template is missing', async () => {
    parseTemplateSpy.mockImplementation(() => {
      throw new Error('Template not found: example.yml')
    })

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Template not found: example.yml'
    )
  })
})
