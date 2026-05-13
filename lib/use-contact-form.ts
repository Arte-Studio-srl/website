'use client';

import { useCallback, useState } from 'react';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactStatus = 'idle' | 'success' | 'error';

type Values = Record<string, string | undefined>;
type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useContactForm<T extends Values>({
  initialValues,
  validate,
  buildPayload,
  successResetMs = 3500,
}: {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
  buildPayload: (values: T) => Record<string, unknown>;
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(values)),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Send failed');
      }
      setStatus('success');
      setValues(initialValues);
      if (successResetMs) setTimeout(() => setStatus('idle'), successResetMs);
    } catch (error) {
      console.error('Contact send error', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, buildPayload, initialValues, successResetMs]);

  const resetStatus = useCallback(() => setStatus('idle'), []);

  return { values, errors, status, isSubmitting, handleChange, handleSubmit, resetStatus };
}
