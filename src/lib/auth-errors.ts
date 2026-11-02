interface FriendlyAuthErrorInput {
  message: string;
  status?: number;
}

export function toFriendlyAuthError(error: FriendlyAuthErrorInput): string {
  const message = error.message.toLowerCase();

  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('invalid login credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }
  if (message.includes('password should be at least')) {
    return 'Your password must be at least 8 characters long.';
  }
  if (message.includes('rate limit') || error.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (message.includes('fetch') || message.includes('network')) {
    return 'We could not reach the server. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}
