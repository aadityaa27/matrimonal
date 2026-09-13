# US-004: Search Profiles

**Title:** Dynamic Matrimonial Profile Search & Filtering  
**As a** registered candidate seeking a match,  
**I want to** filter matrimonial profiles by gender, age range, city, education, and occupation,  
**So that I can** quickly discover candidates matching my partner preferences.

---

## Acceptance Criteria
1. The search page (`/search`) presents clear filtering controls:
   - Gender: All, Brides (Female), Grooms (Male) (`data-testid="filter-gender-all"`, `data-testid="filter-gender-female"`, `data-testid="filter-gender-male"`)
   - Minimum Age (`data-testid="filter-min-age"`)
   - Maximum Age (`data-testid="filter-max-age"`)
   - City (`data-testid="filter-city"`)
   - Education (`data-testid="filter-education"`)
   - Occupation (`data-testid="filter-occupation"`)
   - Search button (`data-testid="filter-submit"`)
   - Reset button (`data-testid="filter-reset"`)
2. Profiles are displayed as responsive cards (`data-testid="profile-card"`), showing photo, name, age, city, occupation, education, and action buttons.
3. Each profile card includes a "View Profile" button (`data-testid="view-profile-btn"`) and a "Send Interest" button (`data-testid="send-interest-btn"`).
4. When filters yield 0 results, an intuitive empty state with "No profiles found matching criteria" is displayed.

---

## Negative Scenarios
1. **Min Age > Max Age:** Selecting Minimum Age 35 and Maximum Age 25 produces an appropriate error or returns no records.
2. **Non-Existent City:** Filtering by a city with no registered candidates correctly yields zero matches.
3. **Reset Behavior:** Clicking Reset restores default filter selections.

---

## Edge Cases
1. Multiple concurrent filters applied simultaneously (e.g., Female + Age 24-28 + Indore + B.Tech).
2. Boundary age matches: Candidates whose birthday is today matching exactly min or max age.
