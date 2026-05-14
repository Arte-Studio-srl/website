export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_FIELD_LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  subject: 200,
  message: 5000,
  source: 60,
} as const;

export const REQUIRED_CONTACT_FIELDS = ['name', 'email', 'subject', 'message'] as const;

export type ContactField = keyof typeof CONTACT_FIELD_LIMITS;
export type ContactPayload = Partial<Record<ContactField, string>>;
export type ContactRequiredField = (typeof REQUIRED_CONTACT_FIELDS)[number];

type ContactValidationIssue =
  | { field: ContactField; code: 'required' }
  | { field: 'email'; code: 'invalidEmail' }
  | { field: ContactField; code: 'tooLong'; limit: number };

export function getContactValidationIssues(
  body: ContactPayload,
  requiredFields: readonly ContactRequiredField[] = REQUIRED_CONTACT_FIELDS,
): ContactValidationIssue[] {
  const issues: ContactValidationIssue[] = [];

  for (const field of requiredFields) {
    if (!body[field]?.trim()) issues.push({ field, code: 'required' });
  }

  if (body.email?.trim() && !EMAIL_REGEX.test(body.email.trim())) {
    issues.push({ field: 'email', code: 'invalidEmail' });
  }

  for (const [field, max] of Object.entries(CONTACT_FIELD_LIMITS) as [ContactField, number][]) {
    const value = body[field];
    if (typeof value === 'string' && value.length > max) {
      issues.push({ field, code: 'tooLong', limit: max });
    }
  }

  return issues;
}

export function validateContactPayload(
  body: ContactPayload,
  requiredFields?: readonly ContactRequiredField[],
) {
  return getContactValidationIssues(body, requiredFields).map((issue) => {
    if (issue.code === 'required') return `${issue.field} is required`;
    if (issue.code === 'invalidEmail') return 'Invalid email';
    return `${issue.field} exceeds ${issue.limit} characters`;
  });
}

export function createContactFieldErrors<T extends ContactPayload>(
  values: T,
  messages: {
    required: string | Partial<Record<ContactRequiredField, string>>;
    invalidEmail: string;
    tooLong?: (field: ContactField, limit: number) => string;
  },
  requiredFields?: readonly ContactRequiredField[],
) {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const issue of getContactValidationIssues(values, requiredFields)) {
    const field = issue.field as keyof T;
    if (errors[field]) continue;
    if (issue.code === 'required') {
      errors[field] =
        typeof messages.required === 'string'
          ? messages.required
          : messages.required[issue.field as ContactRequiredField] || 'Required';
    } else if (issue.code === 'invalidEmail') {
      errors[field] = messages.invalidEmail;
    } else if (messages.tooLong) {
      errors[field] = messages.tooLong(issue.field, issue.limit);
    }
  }

  return errors;
}
