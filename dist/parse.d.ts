import { FormattedField, IssueFormTemplate, ParsedBody } from './interfaces.js';
/**
 * Helper function to parse the body of the issue template
 *
 * @param body The body of the issue template
 * @param template The issue form template
 * @returns {object} A dictionary of the parsed body
 */
export declare function parseIssue(body: string, template: {
    [key: string]: FormattedField;
}): Promise<ParsedBody>;
/**
 * Parses the issue form template and returns a dictionary of fields
 * @param template The issue form template
 * @returns A dictionary of fields
 */
export declare function parseTemplate(template: IssueFormTemplate): Promise<{
    [key: string]: FormattedField;
}>;
