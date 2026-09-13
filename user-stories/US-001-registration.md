# US-001: User Registration

**Title:** New Candidate Registration on Bandhan Matrimonial  
**As a** prospective bride, groom, or guardian,  
**I want to** register an account by providing basic personal, demographic, and contact information,  
**So that I can** search matrimonial matches, express interest in profiles, and connect with potential life partners.

---

## Acceptance Criteria
1. The user must be able to access the registration form from the navigation menu (`data-testid="nav-register"` or `/register`).
2. The registration form must require the following fields:
   - Full Name (`data-testid="register-name"`)
   - Email Address (`data-testid="register-email"`)
   - Password with minimum 6 characters (`data-testid="register-password"`)
   - Gender: Male, Female, or Other (`data-testid="register-gender"`)
   - Date of Birth (`data-testid="register-dob"`)
   - City (`data-testid="register-city"`)
   - Phone Number (`data-testid="register-phone"`)
3. Submitting valid information must create both a record in the `users` table and an initial record in the `profiles` table.
4. Upon successful registration, the system must return an authentication token or prompt the user with a success confirmation and redirect to the Login page or Dashboard.
5. All input controls must have accessible labels and stable `data-testid` attributes for automated testing.

---

## Negative Scenarios
1. **Empty Required Fields:** Submitting the form with any required field blank displays an inline error message and prevents API submission.
2. **Invalid Email Syntax:** Providing an email without `@` or standard domain format (e.g. `rohan.invalid`) fails client and server validation.
3. **Short Password:** Supplying a password with fewer than 6 characters displays a "Password must be at least 6 characters" validation notice.
4. **Duplicate Email:** Attempting to register with an already registered email address (e.g., `demo@bandhan.com`) displays "Email address already registered".
5. **Future Date of Birth:** Selecting a date in the future or under 18 years old is rejected.

---

## Edge Cases
1. Registration with leading or trailing whitespace in Name or Email is automatically trimmed.
2. International or Indian standard phone formats (10 digits, +91 prefixes).
3. Names containing spaces, apostrophes, and hyphens (e.g. `Mary-Jane O'Connor`).
