# Bandhan Matrimonial - Controlled QA Known Bugs Guide

> **CONFIDENTIAL / QA LEARNING MATRIX**  
> *Note: This document is for QA learners and test automation engineers to verify and assess their test suites, Playwright assertions, API tests, and bug detection coverage.*

This document catalogs the 10 intentionally seeded, realistic defects embedded within **Bandhan Matrimonial**. Each bug is designed to mirror real-world production defects frequently caught in QA cycles, exploratory testing, and end-to-end test automation.

---

### Summary Matrix

| Bug ID | Title | Module / Area | Severity | Test Layer |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Search by city returns extra profile from adjacent city | Search & Filtering | Medium | E2E / API |
| **BUG-002** | Age filter off-by-one error on maximum age boundary | Search & Filtering | Medium | E2E / UI |
| **BUG-003** | Filter Reset button fails to clear Occupation filter | Search & Filtering | Low | UI / Functional |
| **BUG-004** | Rapid double-click generates duplicate interest records | Interests System | High | E2E / DB / API |
| **BUG-005** | Rejected interest can be accepted via stale UI action | Interests System | High | UI / State / E2E |
| **BUG-006** | Profile update omits persistence of `annual_income` | My Profile | Medium | API / DB / E2E |
| **BUG-007** | Empty / whitespace-only messages allowed in messaging | Messaging | Medium | UI / Validation |
| **BUG-008** | Admin Dashboard miscalculates pending interests | Admin Analytics | Medium | API / Admin E2E |
| **BUG-009** | Messaging allowed when interest status is still pending | Messaging Auth | High | Security / API |
| **BUG-010** | Registration validation failure returns HTTP 200 instead of 400 | Auth REST API | Low | API Automation |

---

### Detailed Defect Specifications

#### BUG-001: Search by City Inadvertently Returns Cross-City Match
- **User Story:** US-004 Search Profiles
- **Location:** `backend/controllers/profileController.js` (or Search Profile filter query)
- **Defect Description:** When filtering candidates by `city = 'Indore'`, the search query has a faulty boolean condition: `WHERE city = ? OR (city = 'Bhopal' AND occupation LIKE '%Engineer%')`. As a result, candidates from Bhopal who are engineers (such as Rohit Verma) unexpectedly appear in the Indore search results.
- **Expected Behavior:** Filtering by City "Indore" should strictly return candidates residing in Indore.
- **How to Automate with Playwright:** Select city "Indore", click Search, iterate over all rendered `[data-testid="profile-card"]`, and assert `profile.city === 'Indore'`. The test will fail because Rohit Verma (Bhopal) is rendered.

---

#### BUG-002: Maximum Age Filter Off-by-One Boundary Defect
- **User Story:** US-004 Search Profiles
- **Location:** Search filter age comparator
- **Defect Description:** When filtering candidates with Maximum Age set to 28, a candidate aged 29 (e.g. Aditya Jain, born 1995, age 29) is included because the filter checks `candidateAge <= maxAge + 1` or miscalculates current year age by rounding down months.
- **Expected Behavior:** Selecting Maximum Age 28 should exclude all candidates aged 29 and older.
- **How to Automate with Playwright:** Set Min Age: 24, Max Age: 28. Click Search. Assert each profile card's age badge `text <= 28`. Fails when age 29 card appears.

---

#### BUG-003: Filter Reset Button Does Not Clear Occupation
- **User Story:** US-004 Search Profiles
- **Location:** `src/components/FilterSidebar.tsx` / Search Page Reset Handler
- **Defect Description:** When the user selects multiple filters (Gender: Female, City: Indore, Occupation: Chartered Accountant) and then clicks the "Reset" button (`data-testid="filter-reset"`), gender, age, and city reset to default, but the `occupation` dropdown retains `'Chartered Accountant'`.
- **Expected Behavior:** Clicking "Reset" must clear all filters back to default values (`occupation = ''`).
- **How to Automate with Playwright:** Select an occupation, click `filter-reset`, assert `filter-occupation` value is `""` or `"all"`. The test fails because the field remains populated.

---

#### BUG-004: Race Condition / Non-Idempotent Interest Creation
- **User Story:** US-006 Send Interest
- **Location:** `POST /api/interests`
- **Defect Description:** The Send Interest endpoint does not check for an existing pending interest before inserting a new row, nor is the UI button debounced immediately on the first click. Rapidly calling `POST /api/interests` with the same `sender_id` and `receiver_id` creates multiple duplicate interest entries in the database.
- **Expected Behavior:** Submitting an interest to a user who already has a pending interest must return HTTP 409 Conflict or HTTP 400 with "Interest already sent".
- **How to Automate with Playwright / API:** Issue two concurrent `POST /api/interests` requests or double-click "Send Interest". Query MySQL `SELECT COUNT(*) FROM interests WHERE sender_id = ? AND receiver_id = ?`. Count should be 1, but is > 1.

---

#### BUG-005: Stale State Allows Accepting a Rejected Interest
- **User Story:** US-007 Accept & Reject Received Interests
- **Location:** Interests Received List Component
- **Defect Description:** In the Received Interests tab, if an interest is marked as `rejected`, but the user manipulates or triggers the accept action via stale state or direct button event before re-rendering, the backend accepts the transition from `rejected` to `accepted` without checking the state transition rule.
- **Expected Behavior:** Once an interest status is `'rejected'`, transitioning directly to `'accepted'` without a reset should return HTTP 400 "Cannot accept a previously rejected interest".
- **How to Automate with Playwright / API:** Reject an interest, then submit `PUT /api/interests/:id` with `{ status: 'accepted' }`. The API returns 200 instead of 400.

---

#### BUG-006: Profile Update Fails to Persist Annual Income
- **User Story:** US-010 Profile Update
- **Location:** `PUT /api/profiles/:id` controller SQL update statement
- **Defect Description:** In the update query, `annual_income` is received in the request body, but is missing from the `UPDATE profiles SET ...` query columns list (or mapped incorrectly to `about`). As a result, when a user changes their income from `₹18 - 22 Lakhs` to `₹25 - 30 Lakhs` and saves, the UI momentarily shows the new value from local state, but upon page refresh or direct database query, `annual_income` remains the old value.
- **Expected Behavior:** Saving a profile update persists all edited fields, including `annual_income`, to MySQL.
- **How to Automate with Playwright:** Navigate to My Profile, click Edit, change Annual Income, click Save. Refresh the page (`page.reload()`). Assert annual income text. Test fails because old income is loaded.

---

#### BUG-007: Empty and Whitespace-Only Messages Permitted
- **User Story:** US-008 Candidate Messaging
- **Location:** `POST /api/messages` & Message input form
- **Defect Description:** The message submission handler only checks `if (message !== null)` instead of `if (message && message.trim().length > 0)`. A user can type spaces or click Send on an empty box, resulting in empty message bubbles and blank rows in the `messages` table.
- **Expected Behavior:** Empty or whitespace-only messages should disable the Send button or return HTTP 400 Bad Request.
- **How to Automate with Playwright:** Fill message input with `"   "`, click Send. Verify that no new empty bubble is appended to the message thread and database does not store blank message.

---

#### BUG-008: Admin Statistics Overcounts Pending Interests
- **User Story:** US-009 Admin Dashboard
- **Location:** `GET /api/admin/stats` query
- **Defect Description:** In calculating the count of pending interests for the admin metric card (`data-testid="stat-pending-interests"`), the SQL query uses `SELECT COUNT(*) FROM interests WHERE status != 'accepted'` instead of `WHERE status = 'pending'`. Consequently, all rejected interests are counted as pending, inflating the metric.
- **Expected Behavior:** Pending interests count should equal exactly the number of records with `status = 'pending'`.
- **How to Automate with Playwright:** Query the database for `SELECT COUNT(*) FROM interests WHERE status = 'pending'`. Compare with text content of `[data-testid="stat-pending-interests"]`. Discrepancy detected!

---

#### BUG-009: Messaging Allowed When Interest is Still Pending
- **User Story:** US-008 Candidate Messaging
- **Location:** `POST /api/messages` authorization check
- **Defect Description:** To send a message, business logic dictates that the sender and receiver must have an interest with `status = 'accepted'`. However, the check in `POST /api/messages` allows messaging if `status IN ('pending', 'accepted')`. A sender whose interest has not yet been accepted can still send messages.
- **Expected Behavior:** Sending a message to a user whose interest is still pending should return HTTP 403 Forbidden ("Messaging requires an accepted interest").
- **How to Automate with Playwright:** As Demo User (id 2), attempt to message Priya Patel (id 5, whose interest is pending). The message succeeds instead of returning 403.

---

#### BUG-010: Registration Validation Error Returns HTTP 200
- **User Story:** US-001 User Registration
- **Location:** `POST /api/auth/register`
- **Defect Description:** When submitting invalid registration data (such as password shorter than 6 characters or missing email), the controller catches the error and returns:
  `res.status(200).json({ success: false, message: 'Password must be at least 6 characters' })`
  instead of returning proper HTTP 400 Bad Request.
- **Expected Behavior:** Client validation errors must return standard HTTP 400 status codes in REST APIs.
- **How to Automate with Playwright API Testing:** Call `request.post('/api/auth/register', { data: { email: 'bad' } })` and assert `response.status() === 400`. The test fails because it returns status 200.
