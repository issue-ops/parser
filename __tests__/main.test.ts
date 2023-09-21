/**
 * Unit tests for the action's main entrypoint
 */

import fs from 'fs'
import * as core from '@actions/core'
import * as main from '../src/main'

// Get the expected data (before mocking fs)
const issue = fs.readFileSync('__tests__/fixtures/example/issue.md', 'utf-8')
const parsedIssue = JSON.parse(
  fs.readFileSync('__tests__/fixtures/example/parsed-issue.json', 'utf-8')
)
const template = fs.readFileSync(
  '__tests__/fixtures/example/template.yml',
  'utf-8'
)

describe('index', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('retrieves the inputs', async () => {
    // Mock the core functions
    jest.spyOn(core, 'info').mockImplementation()
    jest.spyOn(core, 'setFailed').mockImplementation()
    jest.spyOn(core, 'setOutput').mockImplementation()
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'body':
          return issue
        case 'issue-form-template':
          return 'example.yml'
        case 'workspace':
          return process.cwd()
        default:
          return ''
      }
    })

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
    // Mock the core functions
    jest.spyOn(core, 'info').mockImplementation()
    jest.spyOn(core, 'setFailed').mockImplementation()
    jest.spyOn(core, 'setOutput').mockImplementation()
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'body':
          return issue
        case 'issue-form-template':
          return 'example.yml'
        case 'workspace':
          return process.cwd()
        default:
          return ''
      }
    })

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
    // Mock the core functions
    jest.spyOn(core, 'info').mockImplementation()
    jest.spyOn(core, 'setFailed').mockImplementation()
    jest.spyOn(core, 'setOutput').mockImplementation()
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      switch (name) {
        case 'body':
          return issue
        case 'issue-form-template':
          return 'example.yml'
        case 'workspace':
          return process.cwd()
        default:
          return ''
      }
    })

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
