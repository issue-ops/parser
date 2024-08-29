import * as core from '@actions/core'
import { FormattedField } from './interfaces.js'
import { parseIssue, parseTemplate } from './parse.js'

/**
 * The entrypoint for the action
 */
export async function run(): Promise<void> {
  // Get the inputs
  const body: string = core.getInput('body', { required: true })
  const template: string = core.getInput('issue-form-template', {
    required: true
  })
  const workspace: string = core.getInput('workspace', { required: true })

  core.info('Running action with the following inputs:')
  core.info(`  body: ${body}`)
  core.info(`  template: ${template}`)
  core.info(`  workspace: ${workspace}`)

  try {
    // Read and parse the template
    const parsedTemplate: { [key: string]: FormattedField } =
      await parseTemplate(`${workspace}/.github/ISSUE_TEMPLATE/${template}`)

    // Parse the issue
    const parsedIssue = await parseIssue(body, parsedTemplate)

    core.info(`Parsed issue: ${JSON.stringify(parsedIssue, null, 2)}`)
    core.setOutput('json', JSON.stringify(parsedIssue))
  } catch (error: any) {
    return core.setFailed(error.message)
  }
}
