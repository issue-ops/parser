/**
 * A GitHub issue form template
 */
export interface IssueFormTemplate {
    name: string;
    description: string;
    body: (MarkdownField | TextareaField | InputField | DropdownField | CheckboxesField)[];
    assignees?: string[];
    labels?: string[];
    title?: string;
    projects?: string[];
}
/**
 * A GitHub issue forms Markdown field
 */
export interface MarkdownField {
    type: 'markdown';
    id?: string;
    attributes: {
        value: string;
    };
}
/**
 * A GitHub issue forms textarea field
 */
export interface TextareaField {
    type: 'textarea';
    id?: string;
    attributes: {
        label: string;
        description?: string;
        placeholder?: string;
        value?: string;
        render?: string;
    };
    validations?: {
        required?: boolean;
    };
}
/**
 * A GitHub issue forms input field
 */
export interface InputField {
    type: 'input';
    id?: string;
    attributes: {
        label: string;
        description?: string;
        placeholder?: string;
        value?: string;
    };
    validations?: {
        required?: boolean;
    };
}
/**
 * A GitHub issue forms dropdown field
 */
export interface DropdownField {
    type: 'dropdown';
    id?: string;
    attributes: {
        label: string;
        description?: string;
        multiple?: boolean;
        options: string[];
    };
    validations?: {
        required?: boolean;
    };
}
/**
 * A GitHub issue forms checkboxes field
 */
export interface CheckboxesField {
    type: 'checkboxes';
    id?: string;
    attributes: {
        label: string;
        description?: string;
        options: {
            label: string;
            required?: boolean;
        }[];
    };
    validations?: {
        required?: boolean;
    };
}
/**
 * A formatted GitHub issue forms field
 */
export interface FormattedField {
    id?: string;
    label: string;
    type: 'markdown' | 'textarea' | 'input' | 'dropdown' | 'checkboxes';
    required: boolean;
    multiple?: boolean;
    options?: (string | {
        label: string;
        required: boolean;
    })[];
}
/**
 * A parsed issue body
 *
 * Each key can be a string. Each value can be a string, list of strings,
 * or checkboxes.
 */
export interface ParsedBody {
    [key: string]: string | string[] | Checkboxes;
}
/**
 * A parsed checkboxes input
 */
export interface Checkboxes {
    selected: string[];
    unselected: string[];
}
