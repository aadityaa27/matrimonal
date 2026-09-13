# US-008: Candidate Messaging

**Title:** Matrimonial Direct Messaging for Accepted Matches  
**As a** candidate with mutual interest,  
**I want to** exchange direct text messages with my accepted matches,  
**So that we can** discuss family background, compatibility, and arrange family meetings.

---

## Acceptance Criteria
1. The Messages page (`/messages`) displays a Conversation List (`data-testid="conversations-sidebar"`) of matched users.
2. Selecting a conversation loads the message history in the conversation view (`data-testid="message-thread"`), sorted chronologically.
3. Each message displays the sender's name, message body, and timestamp (`data-testid="message-bubble"`).
4. A message input field (`data-testid="message-input"`) and Send button (`data-testid="message-send-btn"`) allow composing and sending text.
5. Sending a message stores it in the `messages` table and appends it to the active conversation immediately.

---

## Negative Scenarios
1. **No Accepted Match:** Attempting to send a message to a user without an accepted interest must be rejected by backend authorization with HTTP 403 Forbidden ("Messaging requires an accepted interest").
2. **Empty Message:** Attempting to submit a blank or whitespace-only message is prevented.

---

## Edge Cases
1. Long multi-line messages with line breaks.
2. Messages containing emojis and punctuation.
