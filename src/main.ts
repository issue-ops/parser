import * as core from '@actions/core'
import { parseIssue } from '@github/issue-parser'
import fs from 'fs'

/**
 * The entrypoint for the action
 */
export async function run(): Promise<void> {
  // Get the inputs
  const body: string = core.getInput('body', { required: true })
  const issueFormTemplate: string = core.getInput('issue-form-template', {
    required: false
  })
  const workspace: string = core.getInput('workspace', { required: true })

  core.info('Running action with the following inputs:')
  core.info(`  body: ${body}`)
  core.info(`  issue-form-template: ${issueFormTemplate}`)
  core.info(`  workspace: ${workspace}`)

  let parsedIssue

  if (issueFormTemplate !== '') {
    const templatePath = `${workspace}/.github/ISSUE_TEMPLATE/${issueFormTemplate}`

    if (!fs.existsSync(templatePath))
      return core.setFailed(`Template not found: ${templatePath}`)

    parsedIssue = parseIssue(body, fs.readFileSync(templatePath, 'utf8'), {
      slugify: true
    })
  } else parsedIssue = parseIssue(body, undefined, { slugify: true })

  core.info(`Parsed issue: ${JSON.stringify(parsedIssue, null, 2)}`)
  core.setOutput('json', JSON.stringify(parsedIssue))

  for (const [key, value] of Object.entries(parsedIssue)) {
    core.setOutput(
      `parsed_${key}`,
      value === undefined
        ? /* istanbul ignore next */
          // Output an empty string
          ''
        : typeof value === 'string'
          ? // If the value is a string, output it as is
            value
          : // Otherwise, stringify the object
            JSON.stringify(value)
    )
  }
}
