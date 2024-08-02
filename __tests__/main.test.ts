import { jest } from '@jest/globals'
import fs from 'fs'
import * as core from '../__fixtures__/core.js'

jest.unstable_mockModule('@actions/core', () => core)

const main = await import('../src/main.js')

// Get the expected data (before mocking fs)
const issue = fs.readFileSync('__fixtures__/example/issue.md', 'utf-8')
const parsedIssue = JSON.parse(
  fs.readFileSync('__fixtures__/example/parsed-issue.json', 'utf-8')
)
const template = fs.readFileSync('__fixtures__/example/template.yml', 'utf-8')

describe('index', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  it('retrieves the inputs', async () => {
    core.getInput
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('example.yml')
      .mockReturnValueOnce(process.cwd())

    // Mock the fs functions
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true)
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      return template
    })

    await main.run()

    expect(core.getInput).toHaveBeenCalledWith('body', { required: true })
    expect(core.getInput).toHaveReturnedWith(issue)
    expect(core.getInput).toHaveBeenCalledWith('issue-form-template', {
      required: true
    })
    expect(core.getInput).toHaveReturnedWith('example.yml')
    expect(core.getInput).toHaveBeenCalledWith('workspace', { required: true })
    expect(core.getInput).toHaveReturnedWith(process.cwd())
  })

  it('returns the parsed body', async () => {
    core.getInput
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('example.yml')
      .mockReturnValueOnce(process.cwd())

    // Mock the fs functions
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true)
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      return template
    })

    await main.run()

    expect(core.setOutput).toHaveBeenCalledWith(
      'json',
      JSON.stringify(parsedIssue)
    )
  })

  it('fails if a template is missing', async () => {
    core.getInput
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('example.yml')
      .mockReturnValueOnce(process.cwd())

    // Mock the fs functions
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false)
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      return template
    })

    await main.run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Template not found: example.yml'
    )
  })
})
