import { Checkboxes, FormattedField } from './interfaces.js';
/**
 * Formats a input name to a snake case string
 *
 * - Removes leading and trailing whitespace
 * - Converts to lowercase
 * - Replaces spaces with underscores
 * - Replaces non-alphanumeric characters with underscores
 * - Replaces multiple consecutive underscores with a single underscore
 */
export declare function formatKey(name: string): string;
/**
 * Formats a input value to an appropriate type
 */
export declare function formatValue(input: string, field: FormattedField): string | string[] | Checkboxes | null;
