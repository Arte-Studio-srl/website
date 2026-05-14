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
