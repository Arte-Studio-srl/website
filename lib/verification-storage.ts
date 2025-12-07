// Shared verification codes storage
// In production, use Redis or a database

// Use global to persist across hot reloads in development
declare global {
  var verificationCodes: Map<string, { code: string; expiresAt: number }> | undefined;
}

export const verificationCodes = 
  global.verificationCodes || 
  (global.verificationCodes = new Map<string, { code: string; expiresAt: number }>());

// Clean up expired codes periodically
if (typeof setInterval !== 'undefined' && !global.verificationCodesCleanupStarted) {
  global.verificationCodesCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [email, data] of verificationCodes.entries()) {
      if (data.expiresAt < now) {
        verificationCodes.delete(email);
      }
    }
  }, 60000); // Clean up every minute
}

declare global {
  var verificationCodesCleanupStarted: boolean | undefined;
}


