'use client';

import { useCallback, useState } from 'react';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactStatus = 'idle' | 'success' | 'error';

type Values = Record<string, string | undefined>;
type FormErrors<T> = Partial<Record<keyof T, string>>;
type SubmitContactPayload = (payload: Record<string, unknown>) => Promise<void>;

export async function submitSiteContact(payload: Record<string, unknown>) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { success?: boolean; error?: string };
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Send failed');
  }
}

export function useContactForm<T extends Values>({
  initialValues,
  validate,
  buildPayload,
  submit,
  successResetMs = 3500,
}: {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
  buildPayload: (values: T) => Record<string, unknown>;
  submit: SubmitContactPayload;
  successResetMs?: number;
}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name as keyof T] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setStatus('idle');
    try {
      await submit(buildPayload(values));
      setStatus('success');
      setValues(initialValues);
      if (successResetMs) setTimeout(() => setStatus('idle'), successResetMs);
    } catch (error) {
      console.error('Contact send error', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, buildPayload, submit, initialValues, successResetMs]);

  const resetStatus = useCallback(() => setStatus('idle'), []);

  return { values, errors, status, isSubmitting, handleChange, handleSubmit, resetStatus };
}
