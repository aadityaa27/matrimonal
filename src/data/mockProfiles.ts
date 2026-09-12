import { Profile, InterestRequest } from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'profile-1',
    name: 'Ananya Sharma',
    gender: 'female',
    age: 27,
    dob: '1999-04-15',
    height: "5' 5\"",
    religion: 'Hindu',
    motherTongue: 'Hindi',
    community: 'Brahmin',
    maritalStatus: 'Never Married',
    education: 'M.S. in Computer Science',
    occupation: 'Senior Software Engineer',
    company: 'Cloudflare',
    annualIncome: '$135,000',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: 'Tech enthusiast who loves hiking in the Pacific Northwest, trying new espresso brews, and classical Bharatnatyam dance. Looking for an open-minded and humorous partner.',
    hobbies: ['Hiking', 'Classical Dance', 'Specialty Coffee', 'Reading Fiction'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (206) 555-0192',
    email: 'ananya.sharma@example.com',
    joinedDate: '2026-08-10',
    preferences: {
      ageRange: [27, 33],
      heightRange: "5' 8\" to 6' 2\"",
      religion: ['Hindu', 'Jain'],
      education: ['Masters', 'Bachelors'],
      location: 'USA / Canada'
    }
  },
  {
    id: 'profile-2',
    name: 'Rohan Patel',
    gender: 'male',
    age: 29,
    dob: '1997-09-22',
    height: "5' 11\"",
    religion: 'Hindu',
    motherTongue: 'Gujarati',
    community: 'Patel',
    maritalStatus: 'Never Married',
    education: 'MBA, Finance',
    occupation: 'Investment Banking VP',
    company: 'Goldman Sachs',
    annualIncome: '$180,000',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    bio: 'Finance professional with a heart for culinary exploration and marathon running. Value progressive family traditions and mutual ambition.',
    hobbies: ['Marathon Running', 'Cooking', 'Podcasts', 'Tennis'],
    verified: true,
    isShortlisted: true,
    interestStatus: 'pending',
    phone: '+1 (212) 555-0184',
    email: 'rohan.patel@example.com',
    joinedDate: '2026-07-28',
    preferences: {
      ageRange: [25, 30],
      heightRange: "5' 3\" to 5' 9\"",
      religion: ['Hindu'],
      education: ['Masters', 'Bachelors'],
      location: 'East Coast USA'
    }
  },
  {
    id: 'profile-3',
    name: 'Dr. Priya Nair',
    gender: 'female',
    age: 31,
    dob: '1995-11-04',
    height: "5' 4\"",
    religion: 'Hindu',
    motherTongue: 'Malayalam',
    community: 'Nair',
    maritalStatus: 'Never Married',
    education: 'M.D. Pediatrics',
    occupation: 'Pediatric Resident',
    company: 'Boston Children\'s Hospital',
    annualIncome: '$95,000',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    bio: 'Passionate pediatrician and avid ceramicist. When not in hospital rounds, you will find me at pottery studio or baking sourdough.',
    hobbies: ['Pottery', 'Sourdough Baking', 'Gardening', 'Museums'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (617) 555-0149',
    email: 'priya.nair@example.com',
    joinedDate: '2026-08-01',
    preferences: {
      ageRange: [30, 36],
      heightRange: "5' 7\" to 6' 1\"",
      religion: ['Hindu', 'Any'],
      education: ['Doctorate', 'Masters'],
      location: 'USA'
    }
  },
  {
    id: 'profile-4',
    name: 'Arjun Sen',
    gender: 'male',
    age: 32,
    dob: '1994-03-18',
    height: "6' 0\"",
    religion: 'Hindu',
    motherTongue: 'Bengali',
    community: 'Kayastha',
    maritalStatus: 'Never Married',
    education: 'Ph.D. in Data Science',
    occupation: 'AI Research Scientist',
    company: 'DeepMind',
    annualIncome: '$210,000',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    bio: 'Curious researcher working on machine learning architectures. Passionate about jazz guitar, chess tournaments, and sci-fi books.',
    hobbies: ['Jazz Guitar', 'Chess', 'Bouldering', 'Indie Cinema'],
    verified: false,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (415) 555-0133',
    email: 'arjun.sen@example.com',
    joinedDate: '2026-08-15',
    preferences: {
      ageRange: [27, 33],
      heightRange: "5' 2\" to 5' 9\"",
      religion: ['Any'],
      education: ['Masters', 'Bachelors', 'Doctorate'],
      location: 'California or Remote'
    }
  },
  {
    id: 'profile-5',
    name: 'Zoya Khan',
    gender: 'female',
    age: 26,
    dob: '2000-01-12',
    height: "5' 6\"",
    religion: 'Muslim',
    motherTongue: 'Urdu',
    community: 'Sunni',
    maritalStatus: 'Never Married',
    education: 'B.Des. in Interaction Design',
    occupation: 'Lead Product Designer',
    company: 'Stripe',
    annualIncome: '$140,000',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    bio: 'Designing interfaces with empathy. Big fan of indie acoustic music, typography, specialty matcha, and weekend road trips across Texas hill country.',
    hobbies: ['Graphic Design', 'Matcha brewing', 'Road trips', 'Photography'],
    verified: true,
    isShortlisted: true,
    interestStatus: 'none',
    phone: '+1 (512) 555-0177',
    email: 'zoya.khan@example.com',
    joinedDate: '2026-08-20',
    preferences: {
      ageRange: [26, 32],
      heightRange: "5' 8\" to 6' 3\"",
      religion: ['Muslim'],
      education: ['Bachelors', 'Masters'],
      location: 'USA'
    }
  },
  {
    id: 'profile-6',
    name: 'Kavita Reddy',
    gender: 'female',
    age: 28,
    dob: '1998-06-30',
    height: "5' 7\"",
    religion: 'Hindu',
    motherTongue: 'Telugu',
    community: 'Reddy',
    maritalStatus: 'Never Married',
    education: 'M.S. in Biotechnology',
    occupation: 'Clinical Research Associate',
    company: 'Pfizer',
    annualIncome: '$110,000',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    bio: 'Passionate about healthcare discovery and clean nutrition. Love badminton, attending classical concerts, and volunteering on weekends.',
    hobbies: ['Badminton', 'Carnatic Music', 'Baking', 'Volunteering'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (312) 555-0162',
    email: 'kavita.reddy@example.com',
    joinedDate: '2026-08-22',
    preferences: {
      ageRange: [28, 34],
      heightRange: "5' 9\" to 6' 2\"",
      religion: ['Hindu'],
      education: ['Masters', 'Bachelors'],
      location: 'USA'
    }
  },
  {
    id: 'profile-7',
    name: 'Gurpreet Singh',
    gender: 'male',
    age: 30,
    dob: '1996-08-14',
    height: "6' 1\"",
    religion: 'Sikh',
    motherTongue: 'Punjabi',
    community: 'Jat',
    maritalStatus: 'Never Married',
    education: 'B.Tech in Civil Engineering',
    occupation: 'Infrastructure Project Director',
    company: 'Skanska Construction',
    annualIncome: '$145,000',
    city: 'Toronto',
    state: 'ON',
    country: 'Canada',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    bio: 'Down to earth civil engineer with a passion for sustainable architecture, bhangra dance fitness, and family get-togethers. Believes in mutual respect and shared dreams.',
    hobbies: ['Bhangra', 'Architecture', 'Camping', 'Cricket'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'accepted',
    phone: '+1 (416) 555-0118',
    email: 'gurpreet.singh@example.com',
    joinedDate: '2026-07-15',
    preferences: {
      ageRange: [25, 30],
      heightRange: "5' 4\" to 5' 9\"",
      religion: ['Sikh'],
      education: ['Bachelors', 'Masters'],
      location: 'Canada / USA'
    }
  },
  {
    id: 'profile-8',
    name: 'Sneha Joshi',
    gender: 'female',
    age: 30,
    dob: '1996-12-05',
    height: "5' 3\"",
    religion: 'Hindu',
    motherTongue: 'Marathi',
    community: 'Deshastha Brahmin',
    maritalStatus: 'Never Married',
    education: 'Chartered Accountant (CA)',
    occupation: 'Senior Audit Manager',
    company: 'Deloitte',
    annualIncome: '$125,000',
    city: 'Jersey City',
    state: 'NJ',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    bio: 'Balancing balance sheets by day and discovering hidden street food by night. Enthusiastic traveler who has visited 18 countries and counting.',
    hobbies: ['International Travel', 'Trekking', 'Food blogging', 'Yoga'],
    verified: false,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (201) 555-0155',
    email: 'sneha.joshi@example.com',
    joinedDate: '2026-08-25',
    preferences: {
      ageRange: [29, 35],
      heightRange: "5' 6\" to 6' 0\"",
      religion: ['Hindu'],
      education: ['Bachelors', 'Masters'],
      location: 'Tri-state Area / East Coast'
    }
  },
  {
    id: 'profile-9',
    name: 'David Mathew',
    gender: 'male',
    age: 33,
    dob: '1993-05-19',
    height: "5' 10\"",
    religion: 'Christian',
    motherTongue: 'Malayalam',
    community: 'Syrian Christian',
    maritalStatus: 'Never Married',
    education: 'M.S. in Electrical Engineering',
    occupation: 'Hardware Systems Architect',
    company: 'Apple',
    annualIncome: '$195,000',
    city: 'San Jose',
    state: 'CA',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    bio: 'Tech enthusiast who loves classic cars, church choir, and brewing espresso. Looking for a partner grounded in faith and kindness.',
    hobbies: ['Automotive Restoration', 'Acoustic Guitar', 'Choir', 'Cycling'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (408) 555-0129',
    email: 'david.mathew@example.com',
    joinedDate: '2026-08-05',
    preferences: {
      ageRange: [27, 33],
      heightRange: "5' 2\" to 5' 8\"",
      religion: ['Christian'],
      education: ['Masters', 'Bachelors'],
      location: 'Bay Area / West Coast'
    }
  },
  {
    id: 'profile-10',
    name: 'Meera Iyer',
    gender: 'female',
    age: 29,
    dob: '1997-02-14',
    height: "5' 5\"",
    religion: 'Hindu',
    motherTongue: 'Tamil',
    community: 'Iyer',
    maritalStatus: 'Never Married',
    education: 'Ph.D. in Linguistics',
    occupation: 'Assistant Professor',
    company: 'University of Washington',
    annualIncome: '$90,000',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=500&auto=format&fit=crop&q=80',
    bio: 'Bookworm, linguist, and collector of vintage vinyl records. Love quiet Sunday mornings, filter coffee, and philosophical debates.',
    hobbies: ['Vinyl Records', 'Linguistics', 'Poetry', 'Scrabble'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (206) 555-0174',
    email: 'meera.iyer@example.com',
    joinedDate: '2026-08-28',
    preferences: {
      ageRange: [28, 35],
      heightRange: "5' 7\" to 6' 1\"",
      religion: ['Hindu', 'Any'],
      education: ['Masters', 'Doctorate'],
      location: 'USA'
    }
  },
  {
    id: 'profile-11',
    name: 'Aditya Desai',
    gender: 'male',
    age: 28,
    dob: '1998-10-10',
    height: "5' 8\"",
    religion: 'Jain',
    motherTongue: 'Gujarati',
    community: 'Shwetambar',
    maritalStatus: 'Never Married',
    education: 'B.S. in Computer Science',
    occupation: 'Full Stack Engineer',
    company: 'Shopify',
    annualIncome: '$130,000',
    city: 'Vancouver',
    state: 'BC',
    country: 'Canada',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    bio: 'Vegetarian foodie, weekend ski enthusiast in Whistler, and open-source contributor. Seeking someone compassionate with positive energy.',
    hobbies: ['Skiing', 'Cooking Vegetarian', 'Open Source', 'Board Games'],
    verified: true,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (604) 555-0199',
    email: 'aditya.desai@example.com',
    joinedDate: '2026-08-29',
    preferences: {
      ageRange: [24, 29],
      heightRange: "5' 2\" to 5' 8\"",
      religion: ['Jain', 'Hindu'],
      education: ['Bachelors', 'Masters'],
      location: 'Canada / Pacific Northwest'
    }
  },
  {
    id: 'profile-12',
    name: 'Tanya Fernandez',
    gender: 'female',
    age: 34,
    dob: '1992-07-21',
    height: "5' 4\"",
    religion: 'Christian',
    motherTongue: 'English',
    community: 'Goan Catholic',
    maritalStatus: 'Divorced',
    education: 'LL.M. in Corporate Law',
    occupation: 'Corporate Counsel',
    company: 'Salesforce',
    annualIncome: '$170,000',
    city: 'Dallas',
    state: 'TX',
    country: 'USA',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
    bio: 'Independent legal counsel who loves dog rescue shelters, jazz concerts, and hosting dinner parties. Believes in fresh starts and open communication.',
    hobbies: ['Animal Rescue', 'Live Jazz', 'Hosting', 'Wine Tasting'],
    verified: false,
    isShortlisted: false,
    interestStatus: 'none',
    phone: '+1 (214) 555-0112',
    email: 'tanya.fernandez@example.com',
    joinedDate: '2026-09-01',
    preferences: {
      ageRange: [32, 40],
      heightRange: "5' 7\" to 6' 2\"",
      religion: ['Christian', 'Any'],
      education: ['Masters', 'Bachelors', 'Doctorate'],
      location: 'USA'
    }
  }
];

export const INITIAL_INTEREST_REQUESTS: InterestRequest[] = [
  {
    id: 'req-1',
    senderProfileId: 'profile-2',
    senderName: 'Rohan Patel',
    senderAge: 29,
    senderOccupation: 'Investment Banking VP, Goldman Sachs',
    senderCity: 'New York, USA',
    senderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    message: 'Hello! I noticed our shared passion for running and cultural values. Would love to connect and get to know each other better.',
    sentDate: '2026-09-10',
    status: 'pending'
  },
  {
    id: 'req-2',
    senderProfileId: 'profile-7',
    senderName: 'Gurpreet Singh',
    senderAge: 30,
    senderOccupation: 'Infrastructure Project Director, Skanska',
    senderCity: 'Toronto, Canada',
    senderPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    message: 'Hi there! Your profile caught my eye. Looking for a genuine connection and forward-thinking conversation.',
    sentDate: '2026-09-08',
    status: 'pending'
  }
];

export const PLAYWRIGHT_TEST_SCRIPTS = [
  {
    id: 'test-1',
    title: '1. Basic Search and Result Assertion',
    description: 'Verifies that typing into the search input filters profiles and updates the results count.',
    code: `import { test, expect } from '@playwright/test';

test('should filter profiles by search query', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Fill in the search input
  const searchInput = page.getByTestId('filter-search');
  await searchInput.fill('Ananya');

  // Verify that only Ananya appears
  await expect(page.getByTestId('profile-card-profile-1')).toBeVisible();
  await expect(page.getByTestId('profile-name-profile-1')).toHaveText('Ananya Sharma');
  
  // Results count should be 1
  await expect(page.getByTestId('results-count')).toContainText('1 profile found');
});`
  },
  {
    id: 'test-2',
    title: '2. Dropdown and Checkbox Filter Test',
    description: 'Selects a religion dropdown and toggles the verified-only checkbox.',
    code: `import { test, expect } from '@playwright/test';

test('should filter by religion and verified status', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Select Religion from dropdown
  await page.getByTestId('filter-religion').selectOption('Muslim');

  // Ensure only matching profile is shown
  await expect(page.getByTestId('profile-card-profile-5')).toBeVisible();

  // Toggle verified only checkbox
  const verifiedCheckbox = page.getByTestId('filter-verified');
  await verifiedCheckbox.check();
  await expect(verifiedCheckbox).toBeChecked();

  // Assert card is still visible because profile-5 is verified
  await expect(page.getByTestId('profile-card-profile-5')).toBeVisible();
});`
  },
  {
    id: 'test-3',
    title: '3. Form Fill and Validation Error Assertion',
    description: 'Submits the profile registration form with invalid inputs and validates specific error messages.',
    code: `import { test, expect } from '@playwright/test';

test('should validate registration form fields', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Navigate to Register tab
  await page.getByTestId('nav-register').click();

  // Try submitting empty form
  await page.getByTestId('register-submit-btn').click();

  // Assert required field errors
  await expect(page.getByTestId('error-fullName')).toHaveText('Full name is required');
  await expect(page.getByTestId('error-email')).toHaveText('Valid email address is required');
  await expect(page.getByTestId('error-agreeToTerms')).toBeVisible();

  // Fill valid details
  await page.getByTestId('input-fullName').fill('Pooja Hegde');
  await page.getByTestId('input-email').fill('pooja.hegde@example.com');
  await page.getByTestId('input-phone').fill('5551234567');
  await page.getByTestId('input-password').fill('Secret123!');
  await page.getByTestId('input-confirmPassword').fill('Secret123!');
  await page.getByTestId('input-dob').fill('1998-05-20');
  await page.getByTestId('select-religion').selectOption('Hindu');
  await page.getByTestId('input-education').fill('B.Tech');
  await page.getByTestId('input-occupation').fill('Software Engineer');
  await page.getByTestId('input-city').fill('Austin');
  await page.getByTestId('textarea-bio').fill('Passionate engineer and foodie seeking partner.');
  await page.getByTestId('checkbox-terms').check();

  // Submit and verify success banner
  await page.getByTestId('register-submit-btn').click();
  await expect(page.getByTestId('registration-success-msg')).toBeVisible();
});`
  },
  {
    id: 'test-4',
    title: '4. Dialog Modal Open, Assertions & Close',
    description: 'Clicks View Profile, verifies details in modal, reveals contact details, and closes the modal.',
    code: `import { test, expect } from '@playwright/test';

test('should open profile modal and reveal contact details', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Open profile modal
  await page.getByTestId('view-profile-btn-profile-1').click();

  // Assert modal is open
  const modal = page.getByTestId('profile-modal');
  await expect(modal).toBeVisible();
  await expect(page.getByTestId('modal-profile-name')).toHaveText('Ananya Sharma');

  // Click to reveal gated contact info
  await page.getByTestId('reveal-contact-btn').click();
  await expect(page.getByTestId('modal-phone-value')).toContainText('+1 (206) 555-0192');

  // Close modal with button or Escape key
  await page.getByTestId('close-modal-btn').click();
  await expect(modal).not.toBeVisible();
});`
  },
  {
    id: 'test-5',
    title: '5. Action State and Toast Alert',
    description: 'Tests "Send Interest" button click, verifies button transitions to "Interest Sent", and validates toast notification.',
    code: `import { test, expect } from '@playwright/test';

test('should send interest and verify status update and toast', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Send interest to profile-1
  const sendInterestBtn = page.getByTestId('send-interest-btn-profile-1');
  await expect(sendInterestBtn).toHaveText('Send Interest');
  await sendInterestBtn.click();

  // Verify button state changes to "Interest Sent" and becomes disabled
  await expect(sendInterestBtn).toHaveText('Interest Sent');
  await expect(sendInterestBtn).toBeDisabled();

  // Check toast notification
  const toast = page.getByTestId('toast-notification');
  await expect(toast).toContainText('Interest sent to Ananya Sharma');
});`
  },
  {
    id: 'test-6',
    title: '6. Accept / Decline Interest Request',
    description: 'Navigates to Received Interests tab and accepts a pending request.',
    code: `import { test, expect } from '@playwright/test';

test('should accept an incoming interest request', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Navigate to Received Interests tab
  await page.getByTestId('nav-interests').click();

  // Check pending request exists
  const reqItem = page.getByTestId('interest-item-req-1');
  await expect(reqItem).toBeVisible();

  // Click accept button
  await page.getByTestId('accept-interest-req-1').click();

  // Status should update to Connected / Accepted
  await expect(page.getByTestId('interest-status-req-1')).toHaveText('Connected');
});`
  },
  {
    id: 'test-7',
    title: '7. Shortlist Toggle and Tab Navigation',
    description: 'Toggles profile bookmark/shortlist and verifies presence in the Shortlisted tab.',
    code: `import { test, expect } from '@playwright/test';

test('should toggle shortlist and view under Shortlisted tab', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Shortlist profile-3
  const shortlistBtn = page.getByTestId('shortlist-btn-profile-3');
  await shortlistBtn.click();

  // Navigate to Shortlisted tab
  await page.getByTestId('nav-shortlisted').click();

  // Assert profile-3 is listed
  await expect(page.getByTestId('profile-card-profile-3')).toBeVisible();
});`
  },
  {
    id: 'test-8',
    title: '8. Table View Switcher & Column Sorting',
    description: 'Switches from Grid to Table view and tests sorting by age.',
    code: `import { test, expect } from '@playwright/test';

test('should switch to table view and sort by age ascending', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Toggle table view
  await page.getByTestId('view-mode-table').click();
  await expect(page.getByTestId('profiles-data-table')).toBeVisible();

  // Sort by Age (Youngest first)
  await page.getByTestId('sort-by').selectOption('age-asc');

  // The first row should be 26 years old (Zoya Khan)
  const firstRowName = page.getByTestId('table-row-0-name');
  await expect(firstRowName).toHaveText('Zoya Khan');
});`
  },
  {
    id: 'test-9',
    title: '9. Basic Registration & 10 Photos Database Upload',
    description: 'Navigates from Landing to Registration, fills basic personal details, uploads/attaches 10 photos to the database, submits, and verifies User Profile album.',
    code: `import { test, expect } from '@playwright/test';

test('should register basic details and upload 10 photos to database', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Assert Landing Page is visible
  await expect(page.getByTestId('landing-page')).toBeVisible();

  // Click CTA to navigate to Registration Page
  await page.getByTestId('hero-register-btn').click();
  await expect(page.getByTestId('registration-page')).toBeVisible();

  // Pre-fill basic candidate details
  await page.getByTestId('reg-prefill-btn').click();
  await expect(page.getByTestId('reg-fullname')).toHaveValue('Pooja Nair');
  await expect(page.getByTestId('reg-email')).toHaveValue('pooja.nair@example.com');

  // Load 10 sample photos into the database uploader
  await page.getByTestId('load-sample-photos-btn').click();
  await expect(page.getByTestId('photo-counter')).toContainText('10 / 10 Photos');

  // Verify first photo is designated as primary
  await expect(page.getByTestId('photo-primary-badge-0')).toBeVisible();

  // Submit registration form
  await page.getByTestId('reg-submit-btn').click();

  // Assert user is logged in and redirected to User Profile page
  await expect(page.getByTestId('user-profile-page')).toBeVisible();
  await expect(page.getByTestId('user-profile-name')).toHaveText('Pooja Nair');

  // Verify all 10 photos are present in the database album
  await expect(page.getByTestId('profile-photo-counter')).toContainText('10 / 10 Photos');
  await expect(page.getByTestId('album-photo-0')).toBeVisible();
  await expect(page.getByTestId('album-photo-9')).toBeVisible();
});`
  },
  {
    id: 'test-10',
    title: '10. Candidate Login and Sign Out Flow',
    description: 'Validates login with credentials, verifies candidate profile and database album, then signs out back to landing page.',
    code: `import { test, expect } from '@playwright/test';

test('should login candidate with credentials and sign out', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Click Login CTA on Landing page
  await page.getByTestId('hero-login-btn').click();
  await expect(page.getByTestId('login-page')).toBeVisible();

  // Auto-fill demo credentials
  await page.getByTestId('login-demo-btn').click();
  await expect(page.getByTestId('login-email')).toHaveValue('ananya@example.com');

  // Submit login form
  await page.getByTestId('login-submit-btn').click();

  // Assert logged in and redirected to User Profile page
  await expect(page.getByTestId('user-profile-page')).toBeVisible();
  await expect(page.getByTestId('user-profile-name')).toHaveText('Ananya Sharma');

  // Sign out
  await page.getByTestId('logout-btn').click();

  // Assert redirect back to Landing Page
  await expect(page.getByTestId('landing-page')).toBeVisible();
});`
  }
];
