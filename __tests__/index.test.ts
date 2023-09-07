/**
 * Unit tests for the action's index.ts file.
 */

import * as core from '@actions/core'
import fs from 'fs'

const getInputMock = jest.spyOn(core, 'getInput')
const setOutputMock = jest.spyOn(core, 'setOutput')

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retrieves the inputs', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'body':
          return fs.readFileSync(
            '__tests__/fixtures/bug-report/issue.md',
            'utf8'
          )
        case 'csv_to_list':
          return 'true'
        default:
          return ''
      }
    })

    const { run } = require('../src/index')
    await run()

    expect(getInputMock).toHaveBeenCalledWith('body', { required: true })
    expect(getInputMock).toHaveBeenCalledWith('csv_to_list')
  })

  it('returns the parsed body as JSON', async () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'body':
          return fs.readFileSync(
            '__tests__/fixtures/bug-report/issue.md',
            'utf8'
          )
        case 'csv_to_list':
          return 'true'
        default:
          return ''
      }
    })

    const expected = JSON.parse(
      fs.readFileSync('__tests__/fixtures/bug-report/expected.json', 'utf8')
    )

    const { run } = require('../src/index')
    await run()

    expect(setOutputMock).toHaveBeenCalledWith('json', JSON.stringify(expected))
  })
})
