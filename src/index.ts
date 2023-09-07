import * as core from '@actions/core'
import { parse } from './parse'

/**
 * The entrypoint for the action
 */
export async function run(): Promise<void> {
  // Get the input string
  const body: string = core.getInput('body', { required: true })

  // Get other input parameters
  const csvToList: boolean = core.getInput('csv_to_list') === 'true'

  core.info('Running action with the following inputs:')
  core.info(`  csv_to_list: ${csvToList}`)
  core.info(`  body: ${body}`)

  // Parse the body
  const parsedBody = await parse(body, csvToList)
  core.debug(`Parsed body: ${JSON.stringify(parsedBody, null, 2)}`)
  core.setOutput('json', JSON.stringify(parsedBody))
}

run()
