Notes:
        Uses getServerSession to check the session server-side.
        Returns a 200 status if authenticated, 401 if not.
        Import authOptions from [...nextauth]/route.ts (adjust the path if needed).

7. Authentication Flow

    The task pane (/taskpane) loads and checks authentication via /api/check-auth.
    If unauthenticated, it opens a dialog to /auth/dialog.
    The dialog page calls signIn('azure-ad', { redirect: false, callbackUrl: '/auth/dialog' }), initiating the Azure AD OAuth flow.
    The dialog navigates to https://login.microsoftonline.com (allowed by AppDomains).
    After authentication, Azure AD redirects to /api/auth/callback/azure-ad, where NextAuth.js sets the session cookie and redirects to /auth/dialog (via the redirect callback).
    The dialog page checks the session and sends a success or error message to the task pane.
    The task pane reloads to reflect the authenticated state.

8. Test and Debug

    Local Testing:
        Run npm run dev and sideload the add-in in Word.
        Use http://localhost:3000 in the manifest and Azure AD redirect URI (http://localhost:3000/api/auth/callback/azure-ad).
    Production:
        Deploy to https://domain.com (e.g., via Vercel).
        Update the manifest and Azure AD redirect URI.
    Debugging:
        Open browser developer tools (F12) in the dialog.
        Use Fiddler to trace OAuth redirects.
        Check for the next-auth.session-token cookie.
        Exempt domain.com from proxies (e.g., Zscaler) if needed.

Additional Notes

    App Router Benefits:
        The App Router simplifies route organization and supports server-side rendering, though this solution uses Client Components for Office.js compatibility.
    Redirect Handling:
        The redirect: false option prevents browser redirects, but the OAuth flow still navigates within the dialog. The callbackUrl: '/auth/dialog' ensures the dialog returns to the correct page.
    Session Access:
        Use useSession from next-auth/react in the task pane for client-side session checks, or rely on /api/check-auth for server-side validation.
    Security:
        Use HTTPS for all URLs.
        Validate sessions server-side for API requests.
    Alternative Providers:
        Replace 'azure-ad' with other providers (e.g., 'google') if configured in route.ts.

Final Answer

With the App Router, use signIn from next-auth/react in a minimal Client Component at app/auth/dialog/page.tsx to initiate authentication (e.g., signIn('azure-ad', { redirect: false, callbackUrl: '/auth/dialog' })). Open this route in a dialog from the task pane (app/taskpane/page.tsx) using Office.context.ui.displayDialogAsync. The dialog handles the OAuth flow, checks the session with /api/auth/session, and notifies the task pane via Office.context.ui.messageParent. Configure NextAuth.js in app/api/auth/[...nextauth]/route.ts to redirect back to /auth/dialog after the callback. Update the manifest to include the OAuth provider’s domain (e.g., https://login.microsoftonline.com) in AppDomains. The provided artifacts implement this flow, ensuring the authentication opens in a dialog within the Word add-in.

Let me know if you need help with debugging, specific providers, or further App Router adjustments!
