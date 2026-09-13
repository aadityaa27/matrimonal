# US-002: User Authentication & Login

**Title:** Candidate & Administrator Secure Login  
**As a** registered candidate or administrator,  
**I want to** log in with my verified email and password,  
**So that I can** access my personalized matrimonial dashboard, manage interests, and view messages.

---

## Acceptance Criteria
1. The login view presents inputs for Email (`data-testid="login-email"`), Password (`data-testid="login-password"`), and a Submit button (`data-testid="login-submit"`).
2. For testing convenience, Quick Demo Credentials buttons (User: `demo@bandhan.com`, Admin: `admin@bandhan.com`) are provided.
3. Upon submitting valid credentials, the system issues a signed JWT token stored in client storage (`localStorage`) and sets authentication state.
4. Normal users are redirected to the Candidate Dashboard (`/dashboard`), while administrators have access to the Admin Dashboard (`/admin`).
5. The navigation header updates dynamically to display user name, status, and a Logout button (`data-testid="nav-logout"`).

---

## Negative Scenarios
1. **Unregistered Email:** Submitting an email that does not exist returns an error message: "Invalid email or password".
2. **Incorrect Password:** Providing an invalid password returns an error message: "Invalid email or password".
3. **Empty Submission:** Clicking login with empty email or password triggers inline validation without sending an API request.
4. **Malformed Email:** Entering plain text without `@` is rejected before submission.

---

## Edge Cases
1. Case-insensitive email handling (`Demo@Bandhan.com` matches `demo@bandhan.com`).
2. Rapid double-click on the login button is handled gracefully without duplicate session token generation.
3. Expired or corrupted JWT tokens trigger a clean logout and redirect to `/login`.
