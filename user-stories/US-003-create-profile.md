# US-003: Create Profile

**Title:** Matrimonial Profile Onboarding and Initial Setup  
**As a** newly registered user,  
**I want to** build out my matrimonial profile with personal, education, career, and cultural details,  
**So that I can** showcase my personality, expectations, and lifestyle to prospective life partners.

---

## Acceptance Criteria
1. The user can access the profile setup form upon registration or via the profile page.
2. The user can specify:
   - Full Name (`data-testid="profile-fullname"`)
   - Gender (`data-testid="profile-gender"`)
   - Date of Birth (`data-testid="profile-dob"`)
   - City and State (`data-testid="profile-city"`, `data-testid="profile-state"`)
   - Occupation & Education (`data-testid="profile-occupation"`, `data-testid="profile-education"`)
   - Height (`data-testid="profile-height"`)
   - Religion (`data-testid="profile-religion"`)
   - Annual Income bracket (`data-testid="profile-income"`)
   - About Me biography (`data-testid="profile-about"`)
   - Profile Photo URL (`data-testid="profile-photo-url"`)
3. The system calculates and displays the candidate's age automatically from the Date of Birth.
4. Changes are persisted into the `profiles` table linked to the user's primary key `user_id`.

---

## Negative Scenarios
1. Leaving required fields like Full Name, City, or Date of Birth blank prevents submission.
2. Providing an invalid image URL shows a fallback avatar icon rather than breaking the UI.
3. Specifying a future birth date triggers a validation warning.

---

## Edge Cases
1. Long bio text (> 1000 characters) wraps neatly and persists without SQL truncation errors.
2. Special characters in biography (emojis, quotation marks, Hindi/Devanagari scripts) save properly under UTF-8.
