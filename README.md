# IssueOps Parser

[![Check dist/](https://github.com/issue-ops/parser/actions/workflows/check-dist.yml/badge.svg)](https://github.com/issue-ops/parser/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/issue-ops/parser/actions/workflows/codeql.yml/badge.svg)](https://github.com/issue-ops/parser/actions/workflows/codeql.yml)
[![Continuous Integration](https://github.com/issue-ops/parser/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/issue-ops/parser/actions/workflows/continuous-integration.yml)
[![Continuous Delivery](https://github.com/issue-ops/parser/actions/workflows/continuous-delivery.yml/badge.svg)](https://github.com/issue-ops/parser/actions/workflows/continuous-delivery.yml)
[![Super Linter](https://github.com/issue-ops/parser/actions/workflows/super-linter.yml/badge.svg)](https://github.com/issue-ops/parser/actions/workflows/super-linter.yml)
[![Code Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Convert issue form responses to JSON

## About

This action is designed to be used in conjunction with
[issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository#creating-issue-forms)
to allow you to parse created issues into machine-readable JSON for processing.

Issues submitted using issue forms use a structured Markdown format. **So long
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
    id: parser
    uses: issue-ops/parser@vX.X.X
    with:
      body: ${{ github.event.issue.body }}

  - name: Output Issue JSON
    id: output-issue
    run: echo ${{ steps.parser.outputs.json }}
```

## Inputs

| Input                 | Description                               |
| --------------------- | ----------------------------------------- |
| `body`                | The issue body to parse                   |
|                       | Default: `${{ github.event.issue.body }}` |
| `issue-form-template` | The issue form template file              |
|                       | e.g. `example.yml`                        |
| `workspace`           | The checkout path on the runner           |
|                       | Default: `${{ github.workspace }}`        |

## Outputs

| Output | Description                       |
| ------ | --------------------------------- |
| `json` | The parsed issue as a JSON string |

## Example

Given an [example issue template](./__tests__/fixtures/example/template.yml) and
the following issue submitted with that template:

```markdown
### The Name of the Thing

this-thing

### The Nickname of the Thing

thing

### The Color of the Thing

blue

### The Shape of the Thing

square

### The Sounds of the Thing

re, mi

### The Topics About the Thing

_No response_

### The Description of the Thing

This is a description.

It has lines.

### The Notes About the Thing

- Note
- Another note
- Lots of notes

### The Code of the Thing

const thing = new Thing()

thing.doThing()

### The String Method of the Code of the Thing

thing.toString()

### Is the Thing a Thing?

- [x] Yes
- [x] No

### Is the Thing Useful?

- [ ] Yes
- [x] Sometimes
- [ ] No

### Read Team

IssueOps-Demo-Readers

### Write Team

IssueOps-Demo-Writers-NotATeam
```

The output of this action would be:

```json
{
  "the_name_of_the_thing": "this-thing",
  "the_nickname_of_the_thing": "thing",
  "the_color_of_the_thing": ["blue"],
  "the_shape_of_the_thing": ["square"],
  "the_sounds_of_the_thing": ["re", "mi"],
  "the_topics_about_the_thing": [],
  "the_description_of_the_thing": "This is a description.\n\nIt has lines.",
  "the_notes_about_the_thing": "- Note\n- Another note\n- Lots of notes",
  "the_code_of_the_thing": "const thing = new Thing()\n\nthing.doThing()",
  "the_string_method_of_the_code_of_the_thing": "thing.toString()",
  "is_the_thing_a_thing": {
    "selected": ["Yes"],
    "unselected": ["No"]
  },
  "is_the_thing_useful": {
    "selected": ["Sometimes"],
    "unselected": ["Yes", "No"]
  },
  "read_team": "IssueOps-Demo-Readers",
  "write_team": "IssueOps-Demo-Writers"
}
```

## Transformations

### Headings

The following transformations will take place for each heading:

<!--markdownlint-disable-->

| Transformation   | Before                      | After                  |
| ---------------- | --------------------------- | ---------------------- |
| Trim             | `### This is  a title! :) ` | `This is  a title! :)` |
| Lowercase        | `This is  a title! :)`      | `this is  a title! :)` |
| Replace Spaces   | `this is  a title! :)`      | `this_is__a_title!_:)` |
| Remove Symbols   | `this_is_a_title!_:)`       | `this_is__a_title_`    |
| Trim Underscores | `this_is__a_title_`         | `this_is_a_title`      |

<!--markdownlint-enable-->

### Values

The following transformations will take place for responses, depending on the
input type. The type is inferred from the issue form template. For information
on each specific type, see
[Syntax for GitHub's form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema).

#### Single Line

[Type: `input`](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#input)

Before:

```plain
This is a response
```

After (no change):

```plain
This is a response
```

### Multiline

[Type: `textarea`](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#textarea)

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

### Dropdown Selections

[Type: `dropdown`](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#dropdown)

Before:

```plain
red, blue, green
```

After:

```json
["red", "blue", "green"]
```

### Checkboxes

[Type: `checkboxes`](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema#checkboxes)

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

If a form is submitted with empty field(s), they will be included in the issue
body as one of the following:

```markdown
### Field A

_No response_

### Field B

None

### Field C

<empty>
```

These will be converted to one of the following, based on the type of input
specified in the issue form template:

| Type         | Output                                                   |
| ------------ | -------------------------------------------------------- |
| `input`      | Empty string (`""`)                                      |
| `textarea`   | Empty string (`""`)                                      |
| `dropdown`   | Empty list (`[]`)                                        |
| `checkboxes` | Empty checkboxes (`{ "selected": [], "unselected": []}`) |
