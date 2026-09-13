# US-010: Profile Update

**Title:** Matrimonial Profile Edit and Data Persistence  
**As a** registered candidate,  
**I want to** update my profile information, contact location, career status, income, and bio,  
**So that my** profile always reflects my latest life milestones and partner preferences.

---

## Acceptance Criteria
1. Navigating to "My Profile" (`/my-profile`) displays the user's current profile data.
2. Clicking "Edit Profile" (`data-testid="edit-profile-btn"`) unlocks editable fields for:
   - Full Name, Gender, Date of Birth
   - City, State
   - Occupation, Education
   - Height, Religion, Annual Income
   - About Me biography
   - Profile Photo URL
3. Clicking "Save Profile Changes" (`data-testid="save-profile-btn"`) sends `PUT /api/profiles/:id` and updates the `profiles` table.
4. An updated confirmation banner or toast notifies the user of success.
5. Reloading the profile confirms that all edited fields persist accurately.

---

## Negative Scenarios
1. Attempting to update another user's profile ID returns HTTP 403 Forbidden.
2. Clearing out mandatory fields (such as Full Name) triggers client and server validation errors.

---

## Edge Cases
1. Updating only a subset of fields preserves previously existing values in other fields.
2. Updating income with currency formatting (e.g., `₹25 - 30 Lakhs`) preserves formatting.
