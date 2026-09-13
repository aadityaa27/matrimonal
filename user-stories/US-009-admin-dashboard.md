# US-009: Admin Dashboard & User Management

**Title:** Platform Administration & User Governance  
**As a** Bandhan Matrimonial administrator,  
**I want to** monitor system statistics and manage user accounts,  
**So that I can** oversee platform safety, audit activity, and moderate inappropriate or duplicate profiles.

---

## Acceptance Criteria
1. Only users with role `admin` can access the Admin Dashboard (`/admin`). Normal users attempting to access `/admin` are redirected or shown 403 Forbidden.
2. The dashboard displays key operational metrics:
   - Total Registered Users (`data-testid="stat-total-users"`)
   - Male Users (`data-testid="stat-male-users"`)
   - Female Users (`data-testid="stat-female-users"`)
   - Pending Interests (`data-testid="stat-pending-interests"`)
   - Total Messages Exchanged (`data-testid="stat-total-messages"`)
3. A Users Table (`data-testid="admin-users-table"`) lists all registered accounts with:
   - User ID, Email, Role, Full Name, City, Registration Date
   - "Delete User" button (`data-testid="admin-delete-user-btn"`)
4. Deleting a user removes them and their associated profiles, interests, and messages (via cascade delete) after confirmation.

---

## Negative Scenarios
1. Non-admin users attempting to call `GET /api/admin/*` receive HTTP 403 Forbidden.
2. Admin cannot delete their own active admin account.

---

## Edge Cases
1. Deleting a user who has active messages and interests cascades cleanly without database integrity violations.
