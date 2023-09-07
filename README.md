# IssueOps Parser

[![Check dist/](https://github.com/ncalteen/issueops-parser/actions/workflows/check-dist.yml/badge.svg)](https://github.com/ncalteen/issueops-parser/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/ncalteen/issueops-parser/actions/workflows/codeql.yml/badge.svg)](https://github.com/ncalteen/issueops-parser/actions/workflows/codeql.yml)
[![Continuous Integration](https://github.com/ncalteen/issueops-parser/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/ncalteen/issueops-parser/actions/workflows/continuous-integration.yml)
[![Super Linter](https://github.com/ncalteen/issueops-parser/actions/workflows/super-linter.yml/badge.svg)](https://github.com/ncalteen/issueops-parser/actions/workflows/super-linter.yml)
[![Code Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Convert issue form responses to JSON

## About

This action is designed to be used in conjunction with
[issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms)
to allow you to parse created issues into machine-readable JSON for processing.

Issues submitted using issue forms use a structured markdown format. **So long
as the issue body is not heavily modified by the user,** we can reliably parse
the issue body into a JSON object.

You can use this action to conditionally run steps in a workflow based on the
contents of the issue body. For example, you may want to run a step only if the
issue body contains a specific keyword, version number, etc.

## Setup

Here is a simple example of how to use this action in your workflow. Make sure
to replace `vX.X.X` with the latest version of this action.

```yaml
steps:
  - name: Parse Issue
    id: parse-issue
    uses: ncalteen/issueops-parser@vX.X.X
    with:
      body: ${{ github.event.issue.body }}

  - name: Output Issue JSON
    id: output-issue
    run: echo ${{ steps.issue-parser.outputs.json }}
```

## Inputs

| Input         | Default                          | Description                                          |
| ------------- | -------------------------------- | ---------------------------------------------------- |
| `body`        | `${{ github.event.issue.body }}` | The issue body to parse                              |
| `csv_to_list` | `true`                           | Convert single-line responses with comments to lists |

## Outputs

| Output | Description                       |
| ------ | --------------------------------- |
| `json` | The parsed issue as a JSON string |

## Example

Given the following issue body:

```markdown
### Your contact details

me@me.com

### What happened?

A bug happened!

### Version

1.0.0

### What browsers are you seeing the problem on?

Chrome, Safari

### What else?

- [x] Never give up
- [ ] Hot Dog is a Sandwich
```

The output of this action would be:

```json
{
  "your_contact_details": "me@me.com",
  "what_happened": "A bug happened!",
  "version": "1.0.0",
  "what_browsers_are_you_seeing_the_problem_on": ["Chrome", "Safari"],
  "code_of_conduct": {
    "selected": ["Never give up"],
    "unselected": ["Hot Dog is a Sandwich"]
  }
}
```

## Transformations

### Headings

The following transformations will take place for each heading:

<!--markdownlint-disable-->

| Transformation     | Before                      | After                  |
| ------------------ | --------------------------- | ---------------------- |
| Trim               | `### This is  a title! :) ` | `This is  a title! :)` |
| Lowercase          | `This is  a title! :)`      | `this is  a title! :)` |
| Replace Spaces     | `this is  a title! :)`      | `this_is__a_title!_:)` |
| Remove Symbols     | `this_is_a_title!_:)`       | `this_is__a_title_`    |
| Dedupe Underscores | `this_is__a_title_`         | `this_is_a_title`      |

<!--markdownlint-enable-->

### Values

The following transformations will take place for responses, depending on the
type/format.

#### Single Line

Before:

```plain
This is a response
```

After:

```plain
This is a response
```

#### Single Line with Commas

> [!NOTE]
>
> This can be disable by setting the `csv_to_list` parameter to `'false'`.

Before:

```plain
These, are, options
```

After:

```json
["These", "are", "options"]
```

### Multiline

> [!NOTE]
>
> Empty lines are preserved in multiline responses.

Before:

```plain
First line :D

Third line!
```

After:

```plain
First line :D\n\nThird line!
```

### Checkboxes

Before:

```plain
- [x] Pick me!
- [ ] Don't pick me D:
```

After:

```json
{
  "selected": ["Pick me!"],
  "unselected": ["Don't pick me D:"]
}
```

## Omitting Inputs

In the following situations, an input will be omitted from the output JSON:

| Scenario        | Example                 |
| --------------- | ----------------------- |
| Invalid Heading | `## This is invalid`    |
| Empty Heading   | `###`                   |
|                 | `This is a value`       |
| No Value        | `### This is a heading` |
|                 | `<empty>`               |
|                 | `### This is another`   |
|                 | `This is a value`       |
