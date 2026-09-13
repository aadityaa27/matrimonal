# US-006: Send Interest

**Title:** Expressing Interest in Candidate Profiles  
**As a** logged-in candidate,  
**I want to** send an expression of interest to another candidate,  
**So that I can** initiate communication and see if there is mutual compatibility.

---

## Acceptance Criteria
1. Clicking "Send Interest" on a profile card or detail page sends a `POST /api/interests` request with `receiver_id`.
2. The interest is inserted into the `interests` table with initial status `'pending'`.
3. The UI button updates to reflect the current state (e.g. "Interest Sent", disabled, or showing "Pending").
4. A toast confirmation "Interest successfully sent!" appears.
5. In the "My Interests" section under "Sent Interests", the new record appears immediately.

---

## Negative Scenarios
1. **Unauthenticated User:** Clicking "Send Interest" when logged out prompts the user to log in first.
2. **Self-Interest:** A user cannot send an interest to their own profile.
3. **Duplicate Interest:** Re-sending an interest to a candidate where a pending or accepted interest already exists should be prevented.

---

## Edge Cases
1. Rapid clicking on the button before the API response finishes.
2. Reciprocal interest: If Candidate A already sent interest to Candidate B, and Candidate B attempts to send interest to Candidate A.
