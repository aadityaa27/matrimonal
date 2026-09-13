# US-005: Profile Details View

**Title:** Detailed Candidate Profile View  
**As a** user browsing potential matches,  
**I want to** view a candidate's complete profile page,  
**So that I can** thoroughly review their background, family values, education, career, lifestyle, and horoscope/bio before expressing interest.

---

## Acceptance Criteria
1. Clicking "View Profile" on any card opens the detailed profile view (`data-testid="profile-detail-container"`).
2. The detailed view displays:
   - High-resolution Photo (`data-testid="detail-photo"`)
   - Full Name, Age, and Gender (`data-testid="detail-name"`, `data-testid="detail-age"`)
   - Location: City and State (`data-testid="detail-location"`)
   - Professional: Occupation, Education, Annual Income (`data-testid="detail-profession"`)
   - Personal/Demographic: Height, Religion (`data-testid="detail-personal"`)
   - About Me biography (`data-testid="detail-about"`)
3. Action buttons:
   - "Send Interest" (`data-testid="detail-send-interest"`)
   - "Message" (`data-testid="detail-message-btn"`)
   - "Back to Search" (`data-testid="detail-back-btn"`)
4. Displays the current status of any existing interest between the logged-in user and this profile.

---

## Negative Scenarios
1. Navigating to an invalid or non-existent profile ID displays a friendly 404 message: "Candidate profile not found".
2. Viewing one's own profile hides the "Send Interest" and "Message" buttons.

---

## Edge Cases
1. Missing optional fields (e.g. Religion or Annual Income left blank) display "Not Specified" gracefully without layout shifts.
