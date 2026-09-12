import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  BookOpen, 
  Sparkles, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { PLAYWRIGHT_TEST_SCRIPTS } from '../data/mockProfiles';

interface PlaywrightGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaywrightGuideModal: React.FC<PlaywrightGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'snippets' | 'selectors' | 'tips'>('snippets');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const SELECTOR_DICTIONARY = [
    { target: 'Landing Page Section', testId: 'landing-page', locator: `page.getByTestId('landing-page')` },
    { target: 'Landing Hero Register CTA', testId: 'hero-register-btn', locator: `page.getByTestId('hero-register-btn')` },
    { target: 'Landing Hero Login CTA', testId: 'hero-login-btn', locator: `page.getByTestId('hero-login-btn')` },
    { target: 'Candidate Login Page', testId: 'login-page', locator: `page.getByTestId('login-page')` },
    { target: 'Login Email Input', testId: 'login-email', locator: `page.getByTestId('login-email')` },
    { target: 'Login Password Input', testId: 'login-password', locator: `page.getByTestId('login-password')` },
    { target: 'Login Submit Button', testId: 'login-submit-btn', locator: `page.getByTestId('login-submit-btn')` },
    { target: 'Login Auto-fill Demo Button', testId: 'login-demo-btn', locator: `page.getByTestId('login-demo-btn')` },
    { target: 'Login Error Alert', testId: 'login-error-alert', locator: `page.getByTestId('login-error-alert')` },
    { target: 'Registration Page Container', testId: 'registration-page', locator: `page.getByTestId('registration-page')` },
    { target: 'Reg Full Name Input', testId: 'reg-fullname', locator: `page.getByTestId('reg-fullname')` },
    { target: 'Reg Email Input', testId: 'reg-email', locator: `page.getByTestId('reg-email')` },
    { target: 'Reg Password Input', testId: 'reg-password', locator: `page.getByTestId('reg-password')` },
    { target: 'Reg Bride Radio', testId: 'reg-gender-bride', locator: `page.getByTestId('reg-gender-bride')` },
    { target: 'Reg Groom Radio', testId: 'reg-gender-groom', locator: `page.getByTestId('reg-gender-groom')` },
    { target: 'Reg Date of Birth', testId: 'reg-dob', locator: `page.getByTestId('reg-dob')` },
    { target: 'Reg City Input', testId: 'reg-city', locator: `page.getByTestId('reg-city')` },
    { target: 'Reg Bio Textarea', testId: 'reg-bio', locator: `page.getByTestId('reg-bio')` },
    { target: '10 Photos File Input', testId: 'photo-file-input', locator: `page.getByTestId('photo-file-input')` },
    { target: '10 Photos Dropzone', testId: 'photo-dropzone', locator: `page.getByTestId('photo-dropzone')` },
    { target: 'Load 10 Sample Photos Button', testId: 'load-sample-photos-btn', locator: `page.getByTestId('load-sample-photos-btn')` },
    { target: 'Photo Counter (X / 10)', testId: 'photo-counter', locator: `page.getByTestId('photo-counter')` },
    { target: 'Photo Thumbnail #0', testId: 'photo-thumb-0', locator: `page.getByTestId('photo-thumb-0')` },
    { target: 'Photo Delete #0 Button', testId: 'photo-delete-0', locator: `page.getByTestId('photo-delete-0')` },
    { target: 'Photo Set Primary #1', testId: 'photo-make-primary-1', locator: `page.getByTestId('photo-make-primary-1')` },
    { target: 'Register Submit Button', testId: 'reg-submit-btn', locator: `page.getByTestId('reg-submit-btn')` },
    { target: 'Pre-fill Basic Details Button', testId: 'reg-prefill-btn', locator: `page.getByTestId('reg-prefill-btn')` },
    { target: 'User Profile Page', testId: 'user-profile-page', locator: `page.getByTestId('user-profile-page')` },
    { target: 'User Profile Name', testId: 'user-profile-name', locator: `page.getByTestId('user-profile-name')` },
    { target: 'Profile Photos Album Grid', testId: 'profile-gallery-grid', locator: `page.getByTestId('profile-gallery-grid')` },
    { target: 'Edit Profile Toggle', testId: 'edit-profile-toggle', locator: `page.getByTestId('edit-profile-toggle')` },
    { target: 'Logout Button', testId: 'logout-btn', locator: `page.getByTestId('logout-btn')` },
    { target: 'Reset Demo Database', testId: 'reset-data-btn', locator: `page.getByTestId('reset-data-btn')` },
  ];

  return (
    <div
      id="playwright-guide-modal"
      data-testid="playwright-guide-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-mono font-bold text-sm">
              PW
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Playwright Automation Learning Kit
              </h2>
              <p className="text-xs text-gray-500">
                Cheat sheet, executable test scripts, and locator reference for this app
              </p>
            </div>
          </div>

          <button
            id="close-guide-btn"
            data-testid="close-guide-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-gray-200 flex items-center gap-4 bg-white">
          <button
            onClick={() => setActiveTab('snippets')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'snippets'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ready Test Scripts (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('selectors')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'selectors'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Locator Dictionary</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'tips'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Playwright Best Practices</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50">
          
          {/* Tab 1: Ready-made scripts */}
          {activeTab === 'snippets' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-900">
                <strong>How to run these tests:</strong> Create a test file like <code>matrimony.spec.ts</code> in your Playwright project and copy any of the scripts below. They test real interactive flows in this app!
              </div>

              {PLAYWRIGHT_TEST_SCRIPTS.map((script) => (
                <div 
                  key={script.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs"
                >
                  <div className="p-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{script.title}</h4>
                      <p className="text-[11px] text-gray-500">{script.description}</p>
                    </div>

                    <button
                      id={`copy-btn-${script.id}`}
                      data-testid={`copy-btn-${script.id}`}
                      onClick={() => handleCopy(script.id, script.code)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === script.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 text-[11px] font-mono bg-gray-900 text-gray-100 overflow-x-auto leading-relaxed">
                    <code>{script.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Locator Dictionary */}
          {activeTab === 'selectors' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-xs font-bold text-gray-900">Recommended Playwright Locators</h4>
                <p className="text-[11px] text-gray-500">Every element in this matrimonial app has standardized data-testids.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Target UI Element</th>
                      <th className="py-2.5 px-4">data-testid</th>
                      <th className="py-2.5 px-4">Playwright Locator Code</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {SELECTOR_DICTIONARY.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2.5 px-4 font-sans font-medium text-gray-900">{item.target}</td>
                        <td className="py-2.5 px-4 text-rose-600 font-semibold">{item.testId}</td>
                        <td className="py-2.5 px-4 text-gray-700 bg-gray-50/50">{item.locator}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleCopy(item.testId, item.locator)}
                            className="text-[11px] font-sans text-rose-600 hover:text-rose-800 font-medium"
                          >
                            {copiedId === item.testId ? 'Copied' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Playwright Best Practices */}
          {activeTab === 'tips' && (
            <div className="space-y-4 text-xs text-gray-700">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  1. Prefer Locator APIs over XPath or raw CSS
                </h4>
                <p>
                  Playwright emphasizes user-facing locators: <code>page.getByRole(...)</code>, <code>page.getByLabel(...)</code>, and <code>page.getByTestId(...)</code>. These are resilient against DOM hierarchy changes and CSS refactoring.
                </p>
                <div className="p-3 bg-gray-900 text-gray-200 rounded-xl font-mono text-[11px]">
                  {`// ✅ Best practice\nawait page.getByTestId('filter-search').fill('Ananya');\nawait page.getByTestId('register-submit-btn').click();`}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  2. Web-First Assertions
                </h4>
                <p>
                  Always use <code>await expect(locator)...</code> rather than asserting synchronous values. Web-first assertions automatically wait until the expected condition is met!
                </p>
                <div className="p-3 bg-gray-900 text-gray-200 rounded-xl font-mono text-[11px]">
                  {`// ✅ Auto-waits up to timeout\nawait expect(page.getByTestId('profile-modal')).toBeVisible();\nawait expect(page.getByTestId('filter-verified')).toBeChecked();`}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  3. Clean State in Test Hooks
                </h4>
                <p>
                  Use the <code>reset-data-btn</code> in a <code>beforeEach</code> hook to guarantee deterministic state between test specs:
                </p>
                <div className="p-3 bg-gray-900 text-gray-200 rounded-xl font-mono text-[11px]">
                  {`test.beforeEach(async ({ page }) => {\n  await page.goto('http://localhost:3000');\n  await page.getByTestId('reset-data-btn').click();\n});`}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Targeting URL: <code className="font-mono text-gray-800">http://localhost:3000</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
