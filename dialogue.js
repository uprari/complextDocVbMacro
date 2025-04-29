'use client';
//app/auth/dialog/
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function AuthDialog() {
  useEffect(() => {
    const handleSignIn = async () => {
      try {
        // Initiate Azure AD sign-in
        await signIn('azure-ad', { redirect: false, callbackUrl: '/auth/dialog' });

        // Check session to confirm authentication
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await response.json();

        if (session?.user) {
          Office.context.ui.messageParent(JSON.stringify({ status: 'success' }));
        } else {
          Office.context.ui.messageParent(
            JSON.stringify({ status: 'error', error: 'Authentication failed' })
          );
        }
      } catch (error) {
        Office.context.ui.messageParent(
          JSON.stringify({ status: 'error', error: error.message })
        );
      }
    };

    if (typeof Office !== 'undefined') {
      handleSignIn();
    }
  }, []);

  return <div>Authenticating...</div>;
}
