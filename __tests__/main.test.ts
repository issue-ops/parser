import { jest } from '@jest/globals'
import fs from 'fs'
import * as core from '../__fixtures__/core.js'

const issue = fs.readFileSync('__fixtures__/example/issue.md', 'utf-8')
const parsedIssueWithTemplate = JSON.parse(
  fs.readFileSync(
    '__fixtures__/example/parsed-issue-with-template.json',
    'utf-8'
  )
)
const parsedIssueNoTemplate = JSON.parse(
  fs.readFileSync('__fixtures__/example/parsed-issue-no-template.json', 'utf-8')
)

jest.unstable_mockModule('@actions/core', () => core)

const main = await import('../src/main.js')

describe('main', () => {
  beforeEach(() => {
    core.getInput
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('template.yml')
      .mockReturnValueOnce(`${process.cwd()}/__fixtures__/example`)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Returns the parsed body (template included)', async () => {
    await main.run()

    // Gets the inputs
    expect(core.getInput).toHaveBeenCalledWith('body', { required: true })
    expect(core.getInput).toHaveBeenCalledWith('issue-form-template', {
      required: false
    })
    expect(core.getInput).toHaveBeenCalledWith('workspace', { required: true })

    // Sets the outputs
    expect(core.setOutput).toHaveBeenCalledWith(
      'json',
      JSON.stringify(parsedIssueWithTemplate)
    )

    for (const [key, value] of Object.entries(parsedIssueWithTemplate))
      expect(core.setOutput).toHaveBeenCalledWith(
        `parsed_${key}`,
        typeof value === 'string' ? value : JSON.stringify(value)
      )

    // Does not fail
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Returns the parsed body (no template)', async () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('')
      .mockReturnValueOnce(`${process.cwd()}/__fixtures__/example`)

    await main.run()

    // Gets the inputs
    expect(core.getInput).toHaveBeenCalledWith('body', { required: true })
    expect(core.getInput).toHaveBeenCalledWith('issue-form-template', {
      required: false
    })
    expect(core.getInput).toHaveBeenCalledWith('workspace', { required: true })

    // Sets the outputs
    expect(core.setOutput).toHaveBeenCalledWith(
      'json',
      JSON.stringify(parsedIssueNoTemplate)
    )

    for (const [key, value] of Object.entries(parsedIssueNoTemplate))
      expect(core.setOutput).toHaveBeenCalledWith(`parsed_${key}`, value)

    // Does not fail
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('Fails if template does not exist', async () => {
    core.getInput
      .mockReset()
      .mockReturnValueOnce(issue)
      .mockReturnValueOnce('does-not-exist.yml')
      .mockReturnValueOnce(`${process.cwd()}/__fixtures__/example`)

    await main.run()

    // Gets the inputs
    expect(core.getInput).toHaveBeenCalledWith('body', { required: true })
    expect(core.getInput).toHaveBeenCalledWith('issue-form-template', {
      required: false
    })
    expect(core.getInput).toHaveBeenCalledWith('workspace', { required: true })

    // Fails
    expect(core.setFailed).toHaveBeenCalled()

    // Does not set an output
    expect(core.setOutput).not.toHaveBeenCalled()
  })
})
