import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true, // Email-based login
  },
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false, // Adjust based on your password complexity requirements
  },
  mfa: {
    enabled: true, // Multi-Factor Authentication
    sms: true,     // Send codes via SMS
  },
});
