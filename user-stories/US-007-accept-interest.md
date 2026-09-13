# US-007: Accept & Reject Received Interests

**Title:** Managing Received Connection Interests  
**As a** registered candidate receiving match requests,  
**I want to** view received interests and choose to Accept or Reject them,  
**So that I can** control who can interact with me and begin conversations only with compatible matches.

---

## Acceptance Criteria
1. The "My Interests" page (`/interests`) features two tabs:
   - "Received Interests" (`data-testid="tab-received-interests"`)
   - "Sent Interests" (`data-testid="tab-sent-interests"`)
2. For each pending received interest, the candidate card shows:
   - Sender's Photo, Name, Age, City, Occupation
   - Sent Date
   - "Accept" button (`data-testid="accept-interest-btn"`)
   - "Reject" button (`data-testid="reject-interest-btn"`)
3. Clicking "Accept" sends `PUT /api/interests/:id` with `{ status: 'accepted' }`, updates the status badge to "Accepted", and enables messaging with that candidate.
4. Clicking "Reject" updates the status to `'rejected'`.
5. Once accepted or rejected, action buttons are replaced by a status badge.

---

## Negative Scenarios
1. A candidate cannot modify an interest where they are neither sender nor receiver (unauthorized access).
2. Modifying an already rejected interest should not be permitted unless explicitly reset.

---

## Edge Cases
1. Multiple interests arriving simultaneously while viewing the tab.
2. Network timeout during Accept action rolls back button state.
