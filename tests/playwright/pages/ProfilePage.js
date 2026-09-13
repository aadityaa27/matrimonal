export class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.editBtn = page.locator('[data-testid="edit-profile-btn"]');
    this.saveBtn = page.locator('[data-testid="save-profile-btn"]');
    this.fullNameInput = page.locator('[data-testid="profile-fullname"]');
    this.cityInput = page.locator('[data-testid="profile-city"]');
    this.occupationInput = page.locator('[data-testid="profile-occupation"]');
    this.incomeInput = page.locator('[data-testid="profile-income"]');
    this.aboutInput = page.locator('[data-testid="profile-about"]');
    this.profileNameDisplay = page.locator('[data-testid="profile-display-name"]');
    this.profileIncomeDisplay = page.locator('[data-testid="profile-display-income"]');
    this.toastSuccess = page.locator('[data-testid="toast-success"]');
  }

  async gotoMyProfile() {
    await this.page.goto('/my-profile');
  }

  async startEditing() {
    await this.editBtn.click();
  }

  async updateIncome(newIncome) {
    await this.incomeInput.fill(newIncome);
  }

  async saveChanges() {
    await this.saveBtn.click();
  }
}

export class InterestsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.tabReceived = page.locator('[data-testid="tab-received-interests"]');
    this.tabSent = page.locator('[data-testid="tab-sent-interests"]');
    this.receivedCards = page.locator('[data-testid="received-interest-card"]');
    this.sentCards = page.locator('[data-testid="sent-interest-card"]');
    this.acceptBtn = page.locator('[data-testid="accept-interest-btn"]');
    this.rejectBtn = page.locator('[data-testid="reject-interest-btn"]');
  }

  async goto() {
    await this.page.goto('/interests');
  }

  async openReceivedTab() {
    await this.tabReceived.click();
  }

  async openSentTab() {
    await this.tabSent.click();
  }

  async acceptFirstReceived() {
    await this.acceptBtn.first().click();
  }

  async rejectFirstReceived() {
    await this.rejectBtn.first().click();
  }
}

export class MessagesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.conversations = page.locator('[data-testid="conversation-item"]');
    this.messageThread = page.locator('[data-testid="message-thread"]');
    this.messageInput = page.locator('[data-testid="message-input"]');
    this.sendBtn = page.locator('[data-testid="message-send-btn"]');
    this.messageBubbles = page.locator('[data-testid="message-bubble"]');
  }

  async goto() {
    await this.page.goto('/messages');
  }

  async selectConversation(index = 0) {
    await this.conversations.nth(index).click();
  }

  async sendMessage(text) {
    await this.messageInput.fill(text);
    await this.sendBtn.click();
  }
}

export class AdminPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.statTotalUsers = page.locator('[data-testid="stat-total-users"]');
    this.statMaleUsers = page.locator('[data-testid="stat-male-users"]');
    this.statFemaleUsers = page.locator('[data-testid="stat-female-users"]');
    this.statPendingInterests = page.locator('[data-testid="stat-pending-interests"]');
    this.statTotalMessages = page.locator('[data-testid="stat-total-messages"]');
    this.userRows = page.locator('[data-testid="admin-user-row"]');
    this.deleteUserBtns = page.locator('[data-testid="admin-delete-user-btn"]');
  }

  async goto() {
    await this.page.goto('/admin');
  }

  async deleteUser(index = 0) {
    await this.deleteUserBtns.nth(index).click();
  }
}
