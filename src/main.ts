import * as core from '@actions/core'
import fs from 'fs'
import YAML from 'yaml'
import { parseIssue, parseTemplate } from './parse'
import { FormattedField } from './interfaces'

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

  // Verify the template exists
  if (
    fs.existsSync(
      `${workspace.replace(/\/+$/, '')}/.github/ISSUE_TEMPLATE/${template}`
    ) === false
  ) {
    core.setFailed(`Template not found: ${template}`)
    return
  }

  // Read and parse the template
  const parsedTemplate: { [key: string]: FormattedField } = await parseTemplate(
    YAML.parse(
      fs.readFileSync(`${workspace}/.github/ISSUE_TEMPLATE/${template}`, 'utf8')
    )
  )

  // Parse the issue
  const parsedIssue = await parseIssue(body, parsedTemplate)

  core.info(`Parsed issue: ${JSON.stringify(parsedIssue, null, 2)}`)
  core.setOutput('json', JSON.stringify(parsedIssue))
}
