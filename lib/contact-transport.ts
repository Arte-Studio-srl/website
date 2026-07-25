export async function submitSiteContact(payload: Record<string, unknown>) {
  const isWww =
    typeof window !== 'undefined' &&
    window.location.hostname === 'www.artestudiosrl.it';
  const endpoint = isWww
    ? 'https://artestudiosrl.it/api/contact'
    : '/api/contact';

  const response = await fetch(endpoint, {
    method: 'POST',
    // text/plain keeps the www -> apex request CORS-safelisted.
    headers: { 'Content-Type': isWww ? 'text/plain;charset=UTF-8' : 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { success?: boolean; error?: string };
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Send failed');
  }
}
